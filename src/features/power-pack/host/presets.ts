/**
 * 组合预设的注册与失效。
 *
 * 「模式 × 技能包」由插件合成一个预设后交给宿主挂载：宿主一次只认一个预设，
 * 组合是让两个维度同时生效的唯一途径。同一时间只保留一个组合，避免每换一次
 * 选择就多出一套常驻工具树。
 */
import type { AgentPresetApi } from '../../../types/host'
import type { PowerPack } from '../types'

import { listPluginCatalog } from './catalog'
import { composePackRows } from './compose'
import { readPresetRows } from './preset-source'

/** 组合预设 id 的前缀，与宿主内置预设区分。 */
const PRESET_ID_PREFIX = 'power-pack-'

/** 组合预设的排序，排在标准、PTC、极简等内置模式之后。 */
const PRESET_ORDER = 200

/** 当前存在的组合预设。 */
interface ComposedPreset {
  /** 技能包 id 与模式 id 拼成的键，用于判断能否复用。 */
  key: string
  id: string
  dispose: () => Promise<void>
}

let composed: ComposedPreset | undefined

/**
 * 生成组合预设 id；技能包与模式都参与，界面可以据此反解两个维度的选择。
 * @param packId 技能包标识
 * @param modeId 模式预设标识
 * @returns 组合预设 id
 */
function composedPresetId(packId: string, modeId: string): string {
  return `${PRESET_ID_PREFIX}${packId}@${modeId}`
}

/** 注销当前组合预设。 */
async function disposeComposed(): Promise<void> {
  const current = composed
  if (current === undefined) return

  composed = undefined

  try {
    await current.dispose()
  } catch (error) {
    console.error('[power-pack] 注销组合预设失败:', current.id, error)
  }
}

/**
 * 确保「模式 + 技能包」的组合预设已注册。
 * @param api 宿主的 Agent 预设服务
 * @param modeId 模式预设标识
 * @param pack 技能包定义
 * @param profileDir 当前 profile 目录，用于解析已启用插件
 * @returns 组合预设 id
 */
export async function ensureComposedPreset(
  api: AgentPresetApi,
  modeId: string,
  pack: PowerPack,
  profileDir?: string,
): Promise<string> {
  const key = `${pack.id}@${modeId}`
  if (composed?.key === key) return composed.id

  const modeRows = readPresetRows(api, modeId)
  if (modeRows === undefined) {
    throw new Error(`无法读取模式 ${modeId} 的组合行`)
  }

  const { installed } = await listPluginCatalog(profileDir)
  const rows = composePackRows(modeRows, pack, installed)

  await disposeComposed()

  const id = composedPresetId(pack.id, modeId)
  const dispose = await api.register({
    id,
    name: pack.name,
    description: pack.description,
    order: PRESET_ORDER,
    plugins: rows as unknown as Record<string, unknown>[],
  })

  composed = { key, id, dispose }
  return id
}

/**
 * 技能包被修改或删除后让组合失效，下次选择会按新定义重新合成。
 * @param packId 技能包标识
 */
export async function invalidateComposedPreset(packId: string): Promise<void> {
  if (composed === undefined) return
  if (!composed.key.startsWith(`${packId}@`)) return

  await disposeComposed()
}

/** 插件卸载时注销组合预设。 */
export async function disposePackPresets(): Promise<void> {
  await disposeComposed()
}
