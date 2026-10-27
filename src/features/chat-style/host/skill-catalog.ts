/**
 * 技能目录扫描。
 *
 * 风格编辑页需要列出用户可勾选的技能。根 skill-filesystem 在 Web 组合里由
 * 各预设自己挂载，宿主根作用域没有可查询的技能提供者，因此这里直接按宿主
 * 的发现规则扫描用户级技能根，只读取 frontmatter 里的名称与描述。
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type { SkillCatalogItem } from '../types'

/** 技能目录扫描结果，额外保留源路径供符号链接使用。 */
export interface SkillEntry extends SkillCatalogItem {
  /** 技能条目本身的路径：目录型为技能目录，flat 文件为 Markdown 文件。 */
  path: string
  /** 目录型技能需要链接整个目录，flat 技能只链接文件。 */
  kind: 'directory' | 'file'
}

/** 解析 DSH 主目录，与宿主一致：显式配置 → `$DSH_HOME` → `~/.dsh`。 */
export function resolveDshHome(): string {
  const configured = process.env.DSH_HOME?.trim()
  if (configured) return configured

  return join(homedir(), '.dsh')
}

/** 解析共享 agent 主目录：`$DSH_AGENTS_HOME` → `~/.agents`。 */
function resolveAgentsHome(): string {
  const configured = process.env.DSH_AGENTS_HOME?.trim()
  if (configured) return configured

  return join(homedir(), '.agents')
}

/** 宿主认可的技能名语法，非法名不会被加载，因而不进入可勾选清单。 */
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * frontmatter 里只取名称与描述两行，支持单行值、引号值与 `>-` / `|` 块。
 * @param raw SKILL.md 全文
 * @returns 名称与描述，缺失时返回 undefined
 */
function parseFrontmatter(raw: string): { name: string; description: string } | undefined {
  const firstLineEnd = raw.indexOf('\n')
  if (firstLineEnd < 0) return undefined
  if (raw.slice(0, firstLineEnd).replace(/\r$/, '') !== '---') return undefined

  const closing = raw.indexOf('\n---', firstLineEnd)
  if (closing < 0) return undefined

  const lines = raw.slice(firstLineEnd + 1, closing).split('\n')
  const values: Record<string, string> = {}

  // 逐行收集目标字段；块标量把后续缩进行拼回同一段文本
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(name|description):\s*(.*)$/.exec(lines[index].replace(/\r$/, ''))
    if (!match) continue

    const [, key, rest] = match
    if (rest === '>' || rest === '>-' || rest === '|' || rest === '|-') {
      const block: string[] = []
      while (index + 1 < lines.length && /^\s+.+/.test(lines[index + 1])) {
        index += 1
        block.push(lines[index].trim())
      }
      values[key] = block.join(' ')
      continue
    }

    values[key] = rest.replace(/^['"]|['"]$/g, '')
  }

  if (!values.name || !values.description) return undefined

  return { name: values.name, description: values.description }
}

/**
 * 读取一个候选条目的技能元数据。
 * @param path 目录型技能目录或 flat Markdown 路径
 * @param kind 条目类型
 * @returns 合法技能条目；文件缺失、没有 frontmatter 或名称非法时返回 undefined
 */
async function readSkillEntry(path: string, kind: SkillEntry['kind']): Promise<SkillEntry | undefined> {
  const file = kind === 'directory' ? join(path, 'SKILL.md') : path

  try {
    const raw = await readFile(file, 'utf8')
    const parsed = parseFrontmatter(raw)
    if (!parsed || !SKILL_NAME_PATTERN.test(parsed.name)) return undefined

    return { name: parsed.name, description: parsed.description, path, kind }
  } catch (error) {
    console.error('[chat-style] 读取技能文件失败:', file, error)
    return undefined
  }
}

/**
 * 扫描一个技能根目录。
 * @param root 技能根目录
 * @returns 该根下的技能条目；目录不存在时返回空数组
 */
async function scanRoot(root: string): Promise<SkillEntry[]> {
  let entries
  try {
    entries = await readdir(root, { withFileTypes: true })
  } catch (error) {
    // 根目录不存在是常态（用户可能只启用一个根），按空目录处理
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    console.error('[chat-style] 读取技能根目录失败:', root, error)
    return []
  }

  const skills: SkillEntry[] = []

  // 目录型技能读 SKILL.md，flat 技能直接读自身
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const path = join(root, entry.name)
    let kind: SkillEntry['kind'] | undefined

    if (entry.isDirectory()) kind = 'directory'
    else if (entry.isFile() && entry.name.endsWith('.md')) kind = 'file'
    else if (entry.isSymbolicLink()) {
      // 技能根常是符号链接（~/.dsh/skills → ~/.claude/skills），按目标类型判断
      try {
        const info = await stat(path)
        if (info.isDirectory()) kind = 'directory'
        else if (info.isFile() && entry.name.endsWith('.md')) kind = 'file'
      } catch (error) {
        console.error('[chat-style] 跟随技能符号链接失败:', path, error)
        kind = undefined
      }
    }

    if (!kind) continue

    const skill = await readSkillEntry(path, kind)
    if (skill) skills.push(skill)
  }

  return skills
}

/**
 * 汇总用户级技能根，按宿主发现顺序去重：`$DSH_HOME/skills` 优先于 `~/.agents/skills`。
 * @returns 可勾选的技能条目，按名称排序
 */
export async function listSkillEntries(): Promise<SkillEntry[]> {
  const roots = [join(resolveDshHome(), 'skills'), join(resolveAgentsHome(), 'skills')]
  const seen = new Set<string>()
  const result: SkillEntry[] = []

  for (const root of roots) {
    for (const skill of await scanRoot(root)) {
      if (seen.has(skill.name)) continue
      seen.add(skill.name)
      result.push(skill)
    }
  }

  return result.sort((left, right) => left.name.localeCompare(right.name))
}
