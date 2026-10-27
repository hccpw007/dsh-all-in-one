/**
 * 读取宿主既有预设的组合行。
 *
 * 「对话风格」叠加在所选模式之上，必须先拿到该模式实际挂载的行。宿主的预设
 * 注册服务只暴露注册接口，行保存在实例内部的定义表里；这里按字段读取并校验
 * 形状，读不到时返回 undefined，由调用方报错，而不是静默拼出空组合。
 */
import type { AgentPresetApi } from '../../../types/host'
import type { PresetRow } from './standard-rows'

/** 定义记录中本模块用到的部分。 */
interface PresetDefinitionRecord {
  config?: { plugins?: unknown }
}

/** 注册服务实例上保存全部定义的字段。 */
interface PresetRegistryInternals {
  definitions?: Map<string, PresetDefinitionRecord>
}

/**
 * 读取一个预设的组合行。
 * @param api 宿主的 Agent 预设服务
 * @param presetId 预设标识，如内置的 `standard`
 * @returns 组合行；服务内部结构变化读不到时返回 undefined
 */
export function readPresetRows(api: AgentPresetApi, presetId: string): PresetRow[] | undefined {
  const internals = api as unknown as PresetRegistryInternals
  const rows = internals.definitions?.get(presetId)?.config?.plugins
  if (!Array.isArray(rows)) return undefined

  return rows as PresetRow[]
}
