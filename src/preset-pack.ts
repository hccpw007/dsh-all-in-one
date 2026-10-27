/**
 * 「技能包」在预设内部挂载的提示词行。
 *
 * 预设本身不能把文本拼到部署人设后面；这里注册一个独立的系统提示词段落，
 * 排在部署人设后缀之后。插件作为 preset 的一行加载，只在该预设作用域生效。
 */
import type { PresetPromptContext } from './types/host'

/** 段落名保持唯一，避免覆盖部署人设或工具说明。 */
const SECTION_NAME = 'power-pack:custom-prompt'

/** 部署人设后缀的排序是 10200，这里排在其后，确保是最后一段。 */
const SECTION_ORDER = 10250

/** 本行依赖系统提示词服务。 */
export const inject = ['systemPrompt']

/** 预设行配置。 */
interface PromptRowConfig {
  /** 技能包自定义提示词。 */
  text?: string
}

/**
 * 注册技能包提示词段落。
 * @param ctx 预设作用域内的宿主上下文
 * @param config 预设行配置
 */
export function apply(ctx: PresetPromptContext, config: PromptRowConfig = {}): void {
  const text = typeof config.text === 'string' ? config.text.trim() : ''
  if (text === '') return

  ctx.effect(
    () => ctx.systemPrompt.section({ name: SECTION_NAME, order: SECTION_ORDER, text }),
    'power-pack: prompt section',
  )
}
