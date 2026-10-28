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
import { readPacks } from './store'

/** 组合预设 id 的前缀，与宿主内置预设区分。 */
const PRESET_ID_PREFIX = 'power-pack-'

/** 组合预设的排序，排在标准、PTC、极简等内置模式之后。 */
const PRESET_ORDER = 200

/** 等待宿主注册某个模式预设的次数与间隔。 */
const PRESET_READ_ATTEMPTS = 12
const PRESET_READ_INTERVAL_MS = 250

/** 一个已注册的组合预设。 */
interface ComposedPreset {
  /** 技能包 id 与模式 id 拼成的键，用于判断能否复用。 */
  key: string
  id: string
  dispose: () => Promise<void>
}

/** 当前已注册的组合预设，键为 `技能包@模式`。 */
const composed = new Map<string, ComposedPreset>()

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
  const existing = composed.get(key)
  if (existing !== undefined) return existing.id

  const modeRows = readPresetRows(api, modeId)
  if (modeRows === undefined) {
    throw new Error(`无法读取模式 ${modeId} 的组合行`)
  }

  const rows = composePackRows(modeRows, pack, groups)

  const id = composedPresetId(pack.id, modeId)
  const dispose = await api.register({
    id,
    name: pack.name,
    description: pack.description,
    order: PRESET_ORDER,
    plugins: rows as unknown as Record<string, unknown>[],
  })

  composed.set(key, { key, id, dispose })
  return id
}

/**
 * 技能包被修改或删除后让它的组合失效，下次选择会按新定义重新合成。
 * @param packId 技能包标识
 */
export async function invalidateComposedPreset(packId: string): Promise<void> {
  const prefix = `${packId}@`

  for (const preset of [...composed.values()]) {
    if (!preset.key.startsWith(prefix)) continue
    await disposeOne(preset)
  }
}

/** 插件卸载时注销全部组合预设。 */
export async function disposePackPresets(): Promise<void> {
  for (const preset of [...composed.values()]) {
    await disposeOne(preset)
  }
}
