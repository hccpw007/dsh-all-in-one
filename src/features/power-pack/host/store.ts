/**
 * 「技能包」的持久化。
 *
 * 数据存放在 `$DSH_HOME/all-in-one/power-packs.json`：技能包属于用户级配置，
 * 不写进 profile 的 patch，避免升级或切换 bundle 时被覆盖。
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { PowerPack, PowerPackDocument, ResourceRule, RuleMode } from '../types'

import { resolveDshHome } from './skill-catalog'

/** 规则模式白名单，防止客户端写入未知值。 */
const RULE_MODES: RuleMode[] = ['all', 'include', 'exclude']

/** 重命名前使用过的配置文件，按新到旧排列，读取时迁移一次。 */
const LEGACY_FILE_NAMES = ['skill-packs.json', 'chat-styles.json']

/** 技能包标识只允许安全字符：它会被拼进存储路径与预设 id。 */
const PACK_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/

/**
 * 存储文件路径。
 * @returns `$DSH_HOME/all-in-one/power-packs.json`
 */
export function powerPacksFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'power-packs.json')
}

/**
 * 判断技能包标识是否安全：它会被拼进存储路径与预设 id。
 * @param id 技能包标识
 * @returns 合法时返回 true
 */
export function isValidPackId(id: string): boolean {
  return PACK_ID_PATTERN.test(id)
}

/** 收窄为字符串数组，忽略非字符串项。 */
function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/** 校验并补全资源规则。 */
function normalizeRule(value: unknown): ResourceRule {
  if (typeof value !== 'object' || value === null) return { mode: 'all', items: [] }

  const candidate = value as { mode?: unknown; items?: unknown }
  const mode = RULE_MODES.find((item) => item === candidate.mode) ?? 'all'

  return { mode, items: stringList(candidate.items) }
}

/** 校验并补全单个技能包。 */
export function normalizePack(value: unknown): PowerPack | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as Record<string, unknown>
  const id = typeof candidate.id === 'string' ? candidate.id.trim() : ''
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
  if (!PACK_ID_PATTERN.test(id) || name === '') return undefined

  return {
    id,
    name,
    description: typeof candidate.description === 'string' ? candidate.description : '',
    systemPrompt: typeof candidate.systemPrompt === 'string' ? candidate.systemPrompt : '',
    skills: normalizeRule(candidate.skills),
    plugins: normalizeRule(candidate.plugins),
    mcp: normalizeRule(candidate.mcp),
  }
}

/**
 * 解析一份技能包文件。
 *
 * 兼容重命名前的字段名与文件名：旧文档把列表放在 `styles` 里。
 * @param file 配置文件路径
 * @returns 文档；文件不存在或内容损坏时返回 undefined
 */
async function parsePackFile(file: string): Promise<PowerPackDocument | undefined> {
  try {
    const raw = await readFile(file, 'utf8')
    const parsed = JSON.parse(raw) as { packs?: unknown; styles?: unknown; defaultPackId?: unknown }
    const list = Array.isArray(parsed.packs) ? parsed.packs : parsed.styles
    const packs = Array.isArray(list)
      ? list.map(normalizePack).filter((pack): pack is PowerPack => pack !== undefined)
      : []
    // 默认技能包可能已被删除或来自旧文件，只保留仍存在的 id
    const defaultPackId = typeof parsed.defaultPackId === 'string'
      && packs.some((pack) => pack.id === parsed.defaultPackId)
      ? parsed.defaultPackId
      : ''

    return { version: 1, packs, defaultPackId }
  } catch (error) {
    // 首次运行时文件不存在是正常情况；其它读取错误留下日志但仍保持可用
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[power-pack] 读取技能包配置失败:', file, error)
    }
    return undefined
  }
}

/**
 * 读取全部技能包；新文件缺失时依次尝试重命名前的配置。
 * @returns 技能包文档
 */
export async function readPacks(): Promise<PowerPackDocument> {
  const current = await parsePackFile(powerPacksFile())
  if (current !== undefined) return current

  // 依次尝试历史文件名，迁移一次后以新文件为准
  for (const name of LEGACY_FILE_NAMES) {
    const migrated = await parsePackFile(join(resolveDshHome(), 'all-in-one', name))
    if (migrated === undefined) continue

    await writePacks(migrated)
    return migrated
  }

  return { version: 1, packs: [], defaultPackId: '' }
}

/**
 * 原子写入技能包文档：先写临时文件再改名，避免写入中断留下半份配置。
 * @param document 技能包文档
 */
export async function writePacks(document: PowerPackDocument): Promise<void> {
  const file = powerPacksFile()
  const temp = `${file}.tmp`

  try {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(temp, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
    await rename(temp, file)
  } catch (error) {
    console.error('[power-pack] 写入技能包配置失败:', file, error)
    throw error
  }
}
