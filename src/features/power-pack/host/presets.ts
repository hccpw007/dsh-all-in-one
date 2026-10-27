/**
 * 组合预设的注册、失效与启动重建。
 *
 * 「模式 × 技能包」由插件合成一个预设后交给宿主挂载：宿主一次只认一个预设，
 * 组合是让两个维度同时生效的唯一途径。
 *
 * 宿主只把预设保存在内存里，插件重启后注册表为空；而会话记录的是创建时选中的
 * 组合预设 id，恢复这样的会话会因找不到预设而失败。因此每次合成都会记进
 * `compose-state`，插件启动时按记录重建全部组合——历史会话各自绑定的组合都能
 * 重新出现。代价是每个组合都会被宿主动挂载一棵预设行树，故记录只保留近期用过的
 * 一批，数量由 `compose-state` 的上限控制。
 *
 * 预设的全部行都挂在该预设的作用域下，因此仅对绑定它的会话生效；全局组合里
 * 的插件与 MCP 由隔离行负责屏蔽，不需要也不允许在这里重复挂载。
 */
import type { AgentPresetApi, ToolsApi } from '../../../types/host'
import type { GlobalToolGroup, PowerPack } from '../types'

import { composePackRows } from './compose'
import { readComposeState, writeComposeState } from './compose-state'
import { listGlobalToolGroups } from './global-catalog'
import { readPresetRows } from './preset-source'
import { readPacks } from './store'

/** 组合预设 id 的前缀，与宿主内置预设区分。 */
const PRESET_ID_PREFIX = 'power-pack-'

/** 组合预设的排序，排在标准、PTC、极简等内置模式之后。 */
const PRESET_ORDER = 200

/** 启动重建时等待宿主内置模式就绪的次数与间隔。 */
const RESTORE_ATTEMPTS = 12
const RESTORE_INTERVAL_MS = 250

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
async function waitPresetRows(api: AgentPresetApi, modeId: string): Promise<boolean> {
  for (let attempt = 0; attempt < RESTORE_ATTEMPTS; attempt += 1) {
    if (readPresetRows(api, modeId) !== undefined) return true
    await delay(RESTORE_INTERVAL_MS)
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

/**
 * 按记录重建组合预设，让重启前的历史会话重新可恢复。
 *
 * 技能包已被删除或模式已不存在的组合会从记录里剔除，避免每次启动重复尝试。
 * @param api 宿主的 Agent 预设服务
 * @param tools 宿主工具注册表，用于生成隔离行
 * @param profileDir 当前 profile 目录；缺省时扫描全部 profile
 */
export async function restoreComposedPresets(
  api: AgentPresetApi,
  tools: ToolsApi | undefined,
  profileDir: string | undefined,
): Promise<void> {
  const selections = await readComposeState()
  if (selections.length === 0) return

  const document = await readPacks()
  const packs = new Map(document.packs.map((pack) => [pack.id, pack]))
  const known = selections.filter((selection) => packs.has(selection.pack))

  // 技能包已删除的组合无从重建，先从记录里清掉
  if (known.length !== selections.length) await writeComposeState(known)
  if (known.length === 0) return

  const groups = await listGlobalToolGroups(tools, profileDir)
  const failed = new Set<string>()

  for (const selection of known) {
    const pack = packs.get(selection.pack)
    if (pack === undefined) continue

    const ready = await waitPresetRows(api, selection.mode)
    if (!ready) {
      // 模式在这次运行里始终没出现，保留记录等下次启动再试
      console.warn('[power-pack] 启动重建组合预设时模式不可用:', selection.mode)
      continue
    }

    try {
      await ensureComposedPreset(api, selection.mode, pack, groups)
    } catch (error) {
      console.error('[power-pack] 启动重建组合预设失败:', selection.pack, selection.mode, error)
      failed.add(`${selection.pack}@${selection.mode}`)
    }
  }

  // 失败项保留在记录里，用户下次启动或重新选择时还会尝试
  if (failed.size > 0) {
    console.warn('[power-pack] 未重建的组合预设:', [...failed].join(', '))
  }
}
