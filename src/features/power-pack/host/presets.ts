/**
 * 组合预设的注册、失效与按需重建。
 *
 * 「模式 × 技能包」由插件合成一个预设后交给宿主挂载：宿主一次只认一个预设，
 * 组合是让两个维度同时生效的唯一途径。
 *
 * 宿主只把预设保存在内存里，插件重启后注册表为空；而会话记录的是创建时选中的
 * 组合预设 id，直接恢复会因找不到预设而失败。宿主 `register()` 是 eager 的：
 * 它当场挂载一整棵预设行树并审计每一行，一棵树就要一两秒。因此这里不预先重建，
 * 只把记录读成待重建清单，交由 `preset-lazy` 在会话真正用到该 id 时再注册——
 * 启动期只读一个 JSON，未被访问的历史会话不产生任何挂载开销。
 *
 * 预设的全部行都挂在该预设的作用域下，因此仅对绑定它的会话生效；全局组合里
 * 的插件与 MCP 由隔离行负责屏蔽，不需要也不允许在这里重复挂载。
 */
import type { AgentPresetApi } from '../../../types/host'
import type { GlobalToolGroup, PowerPack } from '../types'

import { composePackRows } from './compose'
import { readComposeState } from './compose-state'
import { readPresetRows } from './preset-source'
import type { PresetRow } from './standard-rows'
import { readPacks } from './store'

/** 组合预设 id 的前缀，与宿主内置预设区分。 */
const PRESET_ID_PREFIX = 'power-pack-'

/** 组合预设的排序，排在标准、PTC、极简等内置模式之后。 */
const PRESET_ORDER = 200

/** 等待宿主注册某个模式预设的次数与间隔。 */
const PRESET_READ_ATTEMPTS = 12
const PRESET_READ_INTERVAL_MS = 250

/** 技能包注入预设的行 id：只有这些行会随技能包配置变化。 */
const PACK_ROW_IDS = new Set(['power-pack-isolate', 'power-pack-prompt', 'skill-filesystem', 'tool-skill'])

/** 宿主预设的挂载代际；`collect` 只在无人使用时真正销毁它。 */
interface HostPresetGeneration {
  retired?: boolean
  users?: number
}

/** 宿主预设定义记录中本模块需要的部分。 */
interface HostPresetRecord {
  generation?: HostPresetGeneration
}

/** 宿主预设注册服务的内部形状；宿主没有公开注销单个注册项的接口。 */
interface HostPresetRegistry {
  definitions?: Map<string, HostPresetRecord>
  collect?: (generation: HostPresetGeneration) => Promise<void>
}

/** 一个已注册的组合预设。 */
interface ComposedPreset {
  /** 技能包 id 与模式 id 拼成的键，用于判断能否复用。 */
  key: string
  id: string
  dispose: () => Promise<void>
}

/** 共享表在 globalThis 上的键。 */
const SHARED_STATE = Symbol.for('dsh-all-in-one.composed-presets')

/**
 * 取跨插件实例共享的已注册预设表。
 *
 * 插件热重载会重新执行本模块、重建模块级状态，而宿主的预设注册表不会重建：
 * 表若只存在模块作用域里，新实例既看不见旧注册（重复注册报错），也无法注销
 * 它们（改了技能包后旧配置继续生效）。因此这张表挂在 globalThis 上共享。
 * @returns 共享的注册表
 */
function sharedComposed(): Map<string, ComposedPreset> {
  const holder = globalThis as unknown as Record<symbol, Map<string, ComposedPreset> | undefined>
  const existing = holder[SHARED_STATE]
  if (existing !== undefined) return existing

  const created = new Map<string, ComposedPreset>()
  holder[SHARED_STATE] = created

  return created
}

/** 当前已注册的组合预设，键为 `技能包@模式`。 */
const composed = sharedComposed()

/**
 * 生成组合预设 id；技能包与模式都参与，界面可以据此反解两个维度的选择。
 * @param packId 技能包标识
 * @param modeId 模式预设标识
 * @returns 组合预设 id
 */
function composedPresetId(packId: string, modeId: string): string {
  return `${PRESET_ID_PREFIX}${packId}@${modeId}`
}

/**
 * 判断一个预设 id 是否由本插件合成。
 * @param presetId 预设标识
 * @returns 属于组合预设时返回 true
 */
export function isComposedPresetId(presetId: string): boolean {
  return presetId.startsWith(PRESET_ID_PREFIX)
}

/**
 * 把组合预设 id 拆回技能包与模式。
 * @param presetId 组合预设 id
 * @returns 两个维度；不含 `@` 的旧版 id 视为只有技能包
 */
export function splitComposedPresetId(presetId: string): { packId: string; modeId: string } {
  const body = presetId.slice(PRESET_ID_PREFIX.length)
  const separator = body.indexOf('@')
  if (separator < 0) return { packId: body, modeId: '' }

  return { packId: body.slice(0, separator), modeId: body.slice(separator + 1) }
}

/**
 * 取宿主预设服务的内部注册表。
 * @param api 宿主的 Agent 预设服务
 * @returns 内部结构；宿主改版读不到时为 undefined 字段
 */
function hostRegistry(api: AgentPresetApi): HostPresetRegistry {
  return api as unknown as HostPresetRegistry
}

/**
 * 把纯数据序列化成与键序无关的文本，用于判断注册行是否过期。
 *
 * 技能包行只含字符串、布尔与数组，序列化结果可以直接比较；键序不稳定会让同一份
 * 配置每次算出不同指纹，因此这里统一排序。
 * @param value 待序列化的值
 * @returns 稳定文本
 */
function stableText(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableText).join(',')}]`

  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const entries = Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableText(record[key])}`)

    return `{${entries.join(',')}}`
  }

  // undefined 不是合法 JSON，用固定字面量保证两侧仍可比较
  return JSON.stringify(value) ?? 'undefined'
}

/**
 * 取组合行里属于技能包的部分并序列化，作为注册是否过期的指纹。
 * @param rows 预设组合行
 * @returns 稳定指纹
 */
function packRowSignature(rows: PresetRow[]): string {
  return stableText(rows.filter((row) => PACK_ROW_IDS.has(row.id)))
}

/**
 * 丢弃宿主里的一条同名注册。
 *
 * 宿主的注册表不随插件实例销毁，而保存技能包或跨进程改配置后，旧注册的定义仍是
 * 旧配置；只从定义表删除并不能阻止新会话复用它，必须同时让挂载代际退役。正被
 * 会话使用的代际只会被标记退役，由宿主的 `collect` 等最后一个使用者释放后销毁。
 * @param api 宿主的 Agent 预设服务
 * @param presetId 组合预设 id
 */
async function dropHostPreset(api: AgentPresetApi, presetId: string): Promise<void> {
  const registry = hostRegistry(api)
  const record = registry.definitions?.get(presetId)
  if (record === undefined) return

  registry.definitions?.delete(presetId)

  const generation = record.generation
  if (generation === undefined) return

  generation.retired = true
  if (typeof registry.collect !== 'function') return

  try {
    await registry.collect(generation)
  } catch (error) {
    // 释放失败不影响后续注册：定义已移除，重新注册会得到新代际
    console.error('[power-pack] 释放残留组合预设失败:', presetId, error)
  }
}

/**
 * 列出宿主里属于某个技能包的全部注册 id。
 * @param api 宿主的 Agent 预设服务
 * @param prefix 组合 id 前缀，形如 `<技能包 id>@`
 * @returns 命中的注册 id
 */
function hostPresetIds(api: AgentPresetApi, prefix: string): string[] {
  const ids: string[] = []

  for (const presetId of hostRegistry(api).definitions?.keys() ?? []) {
    if (presetId.startsWith(`${PRESET_ID_PREFIX}${prefix}`)) ids.push(presetId)
  }

  return ids
}

/** 等待若干毫秒。 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * 等待宿主注册某个模式预设。
 *
 * 插件可能先于内置模式完成加载，此时读不到该模式的组合行；合成前必须先等到
 * 它出现，否则组合会缺掉模式提供的全部工具行。
 * @param api 宿主的 Agent 预设服务
 * @param modeId 模式预设标识
 * @returns 是否在限定次数内读到组合行
 */
export async function waitPresetRows(api: AgentPresetApi, modeId: string): Promise<boolean> {
  for (let attempt = 0; attempt < PRESET_READ_ATTEMPTS; attempt += 1) {
    if (readPresetRows(api, modeId) !== undefined) return true
    await delay(PRESET_READ_INTERVAL_MS)
  }

  return false
}

/** 注销一个组合预设；注销失败只影响常驻资源，不阻断后续注册。 */
async function disposeOne(preset: ComposedPreset): Promise<void> {
  composed.delete(preset.key)

  try {
    await preset.dispose()
  } catch (error) {
    console.error('[power-pack] 注销组合预设失败:', preset.id, error)
  }
}

/**
 * 判断一个组合预设当前是否已注册。
 * @param presetId 组合预设 id
 * @returns 已注册时返回 true
 */
function hasComposedPreset(presetId: string): boolean {
  for (const preset of composed.values()) {
    if (preset.id === presetId) return true
  }

  return false
}

/**
 * 列出「记录里存在、但当前尚未注册」的组合预设元数据。
 *
 * 按需注册让这些组合不在宿主名单里，而会话标题旁的预设标签要从名单查名字，
 * 查不到就退回显示原始 id。这里只给出名称与描述供名单补齐，不触发任何挂载。
 * @returns 未注册组合的展示元数据，键为组合预设 id
 */
export async function pendingComposedMeta(): Promise<Map<string, { name: string; description: string }>> {
  const selections = await readComposeState()
  if (selections.length === 0) return new Map()

  const document = await readPacks()
  const byId = new Map(document.packs.map((pack) => [pack.id, pack]))
  const result = new Map<string, { name: string; description: string }>()

  for (const selection of selections) {
    const pack = byId.get(selection.pack)
    if (pack === undefined) continue

    const id = composedPresetId(selection.pack, selection.mode)
    // 已注册的组合由宿主名单自己给出，重复补会覆盖宿主的权威结果
    if (hasComposedPreset(id)) continue

    result.set(id, { name: pack.name, description: pack.description })
  }

  return result
}

/**
 * 确保「模式 + 技能包」的组合预设已注册。
 * @param api 宿主的 Agent 预设服务
 * @param modeId 模式预设标识
 * @param pack 技能包定义
 * @param groups 宿主枚举出的全局能力组，用于生成隔离行
 * @returns 组合预设 id
 */
export async function ensureComposedPreset(
  api: AgentPresetApi,
  modeId: string,
  pack: PowerPack,
  groups: GlobalToolGroup[],
): Promise<string> {
  const key = `${pack.id}@${modeId}`
  const modeRows = readPresetRows(api, modeId)
  if (modeRows === undefined) {
    throw new Error(`无法读取模式 ${modeId} 的组合行`)
  }

  const id = composedPresetId(pack.id, modeId)
  const rows = composePackRows(modeRows, pack, groups)

  // 宿主的注册表不随插件实例销毁：同名注册可能来自旧配置、热重载前的实例，
  // 或其它进程刚改过的技能包。只有技能包行完全一致才复用，否则先丢弃再按
  // 当前配置注册，避免新会话继续拿到旧提示词与旧隔离规则直到重启宿主。
  const registered = readPresetRows(api, id)
  if (registered !== undefined) {
    if (packRowSignature(registered) === packRowSignature(rows)) return id

    await dropHostPreset(api, id)
    // 表里可能还记着这条注册的注销函数；定义已丢弃，留着会让后续失效逻辑误判
    composed.delete(key)
  }

  try {
    const dispose = await api.register({
      id,
      name: pack.name,
      description: pack.description,
      order: PRESET_ORDER,
      plugins: rows as unknown as Record<string, unknown>[],
    })

    composed.set(key, { key, id, dispose })

    return id
  } catch (error) {
    // 注册与旧实例撤销并发时仍可能撞上重复 id；此时宿主已持有该预设，
    // 按已注册处理即可，否则一次热重载就会让该技能包的会话无法恢复。
    if (readPresetRows(api, id) !== undefined) return id

    throw error
  }
}

/**
 * 技能包被修改或删除后让它的组合失效，下次选择会按新定义重新合成。
 * @param api 宿主的 Agent 预设服务，用于清理表里没有记录的残留注册
 * @param packId 技能包标识
 */
export async function invalidateComposedPreset(api: AgentPresetApi, packId: string): Promise<void> {
  const prefix = `${packId}@`

  for (const preset of [...composed.values()]) {
    if (!preset.key.startsWith(prefix)) continue
    await disposeOne(preset)
  }

  // composed 表可能缺记录（注册早退、热重载竞态或历史遗留），宿主的定义表才是
  // 权威：按 id 前缀把它持有的同名注册一并丢弃，否则新会话会复用旧配置。
  for (const presetId of hostPresetIds(api, prefix)) {
    await dropHostPreset(api, presetId)
  }
}

/** 插件卸载时注销全部组合预设。 */
export async function disposePackPresets(): Promise<void> {
  for (const preset of [...composed.values()]) {
    await disposeOne(preset)
  }
}
