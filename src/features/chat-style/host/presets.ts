/**
 * 把对话风格注册为宿主的 Agent 预设。
 *
 * 宿主新建会话时读取预设列表，因此风格注册后会自动出现在新建任务的
 * 预设选择器里；选择后宿主按该预设挂载工具、技能与 MCP，实现按会话隔离。
 */
import type { AgentPresetApi } from '../../../types/host'
import type { ChatStyle } from '../types'

import { buildPresetRows } from './composition'

/** 风格预设 id 的前缀，避免与内置预设或用户自建预设重名。 */
const PRESET_ID_PREFIX = 'style-'

/** 风格预设的排序起点，排在标准、PTC、极简等内置预设之后。 */
const PRESET_ORDER_BASE = 200

/** 已注册风格的注销函数；保存或删除风格时先撤销旧定义。 */
const disposers = new Map<string, () => Promise<void>>()

/**
 * 注销一个风格的预设。
 * @param styleId 风格标识
 */
export async function unregisterStylePreset(styleId: string): Promise<void> {
  const dispose = disposers.get(styleId)
  if (!dispose) return

  disposers.delete(styleId)

  try {
    await dispose()
  } catch (error) {
    console.error('[chat-style] 注销预设失败:', styleId, error)
  }
}

/**
 * 注册或更新一个风格的预设。
 *
 * 组合里的包名解析失败、行配置非法时，宿主会把该预设标记为 broken；
 * 这里只记录日志，保留其它风格可用。
 * @param api 宿主的 Agent 预设服务
 * @param style 风格定义
 * @param order 该风格在预设列表中的排序
 */
export async function registerStylePreset(
  api: AgentPresetApi,
  style: ChatStyle,
  order: number,
): Promise<void> {
  await unregisterStylePreset(style.id)

  try {
    const plugins = await buildPresetRows(style)
    const dispose = await api.register({
      id: `${PRESET_ID_PREFIX}${style.id}`,
      name: style.name,
      description: style.description,
      order: PRESET_ORDER_BASE + order,
      plugins: plugins as unknown as Record<string, unknown>[],
    })

    disposers.set(style.id, dispose)
  } catch (error) {
    console.error('[chat-style] 注册预设失败:', style.id, error)
  }
}

/**
 * 按当前风格列表重建全部预设：先撤销所有旧定义，再按顺序注册。
 * @param api 宿主的 Agent 预设服务
 * @param styles 全部风格
 */
export async function registerAllStylePresets(
  api: AgentPresetApi,
  styles: ChatStyle[],
): Promise<void> {
  for (const styleId of [...disposers.keys()]) await unregisterStylePreset(styleId)

  for (const [index, style] of styles.entries()) {
    await registerStylePreset(api, style, index)
  }
}

/**
 * 插件卸载时撤销本插件注册的全部预设。
 */
export async function disposeStylePresets(): Promise<void> {
  for (const styleId of [...disposers.keys()]) await unregisterStylePreset(styleId)
}
