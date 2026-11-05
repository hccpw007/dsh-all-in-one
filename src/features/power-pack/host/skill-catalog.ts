/**
 * 技能目录扫描。
 *
 * 技能包编辑页需要列出用户可勾选的技能。根 skill-filesystem 在 Web 组合里由
 * 各预设自己挂载，宿主根作用域没有可查询的技能提供者，因此这里直接按宿主
 * 的发现规则扫描用户级技能根，只读取 frontmatter 里的名称与描述。
 */
import { open, readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type { SkillCatalogItem } from '../types'

import { resolveDshHome } from '../../../common/dsh-home'
import { logPerf } from '../../../common/perf'
import { createReadCache } from './read-cache'

/** 技能目录扫描结果，额外保留源路径供符号链接使用。 */
export interface SkillEntry extends SkillCatalogItem {
  /** 技能条目本身的路径：目录型为技能目录，flat 文件为 Markdown 文件。 */
  path: string
  /** 目录型技能需要链接整个目录，flat 技能只链接文件。 */
  kind: 'directory' | 'file'
}

/** 解析共享 agent 主目录：`$DSH_AGENTS_HOME` → `~/.agents`。 */
function resolveAgentsHome(): string {
  const configured = process.env.DSH_AGENTS_HOME?.trim()
  if (configured) return configured

  return join(homedir(), '.agents')
}

/** 宿主认可的技能名语法，非法名不会被加载，因而不进入可勾选清单。 */
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** 只读取 frontmatter 所需的头部字节数：最大的 SKILL.md 约 46KB，头部远小于该值。 */
const FRONTMATTER_PROBE_BYTES = 8 * 1024

/** 技能清单的缓存时长：技能目录变化很慢，5 秒足以吸收页面切换与保存带来的重复扫描。 */
const SKILL_CACHE_TTL_MS = 5000

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
 * 读取一个技能文件的 frontmatter 文本。
 *
 * 元数据只在文件开头，整份读取一个 46KB 的 SKILL.md 大部分字节都被丢弃；先读头部
 * 8KB，若 frontmatter 在头部内没有闭合（超大描述）再退回整份读取，保证解析结果不变。
 * @param file SKILL.md 路径
 * @returns 用于解析的文本；文件不存在时返回 undefined
 */
async function readFrontmatterText(file: string): Promise<string | undefined> {
  const handle = await open(file, 'r')

  try {
    const buffer = Buffer.alloc(FRONTMATTER_PROBE_BYTES)
    const { bytesRead } = await handle.read(buffer, 0, FRONTMATTER_PROBE_BYTES, 0)
    const head = buffer.subarray(0, bytesRead).toString('utf8')

    // 头部已包含闭合分隔线，或以整份文件都不足 8KB，都不必再读
    if (bytesRead < FRONTMATTER_PROBE_BYTES || /\n---/.test(head)) return head

    return await readFile(file, 'utf8')
  } finally {
    await handle.close()
  }
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
    const raw = await readFrontmatterText(file)
    const parsed = raw === undefined ? undefined : parseFrontmatter(raw)
    if (!parsed || !SKILL_NAME_PATTERN.test(parsed.name)) return undefined

    return { name: parsed.name, description: parsed.description, path, kind }
  } catch (error) {
    // 技能根下混放非技能目录是常态（如只放说明文件的占位目录），缺 SKILL.md
    // 不代表读取失败；当作「不是技能」跳过，否则每个无关目录都会刷一条 ENOENT 栈。
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined

    console.error('[power-pack] 读取技能文件失败:', file, error)
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
    console.error('[power-pack] 读取技能根目录失败:', root, error)
    return []
  }

  // 目录型技能读 SKILL.md，flat 技能直接读自身。
  // 并发读取：串行 readFile 是技能扫描的主要成本（2,000 个技能时实测 119ms）
  const resolved = await Promise.all(
    entries.map(async (entry): Promise<SkillEntry | undefined> => {
      if (entry.name.startsWith('.')) return undefined

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
          console.error('[power-pack] 跟随技能符号链接失败:', path, error)
          kind = undefined
        }
      }

      if (!kind) return undefined

      return readSkillEntry(path, kind)
    }),
  )

  return resolved.filter((skill): skill is SkillEntry => skill !== undefined)
}

/** 技能清单的读取缓存；保存技能包时的重复扫描由它吸收。 */
const skillsCache = createReadCache<SkillEntry[]>(SKILL_CACHE_TTL_MS)

/**
 * 扫描全部技能根并去重。
 * @returns 可勾选的技能条目，按名称排序
 */
async function scanSkillEntries(): Promise<SkillEntry[]> {
  const startedAt = performance.now()
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

  logPerf('listSkillEntries', startedAt, { roots: roots.length, skills: result.length })

  return result.sort((left, right) => left.name.localeCompare(right.name))
}

/**
 * 汇总用户级技能根，按宿主发现顺序去重：`$DSH_HOME/skills` 优先于 `~/.agents/skills`。
 * 结果按 5 秒 TTL 缓存，并对并发调用合并。
 * @param force 跳过缓存重新扫描
 * @returns 可勾选的技能条目，按名称排序
 */
export async function listSkillEntries(force = false): Promise<SkillEntry[]> {
  return skillsCache.read('skills', scanSkillEntries, force)
}
