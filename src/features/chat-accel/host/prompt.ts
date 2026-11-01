/**
 * 「对话加速」的提示词段。
 *
 * 这里只放「模型该怎么用工具」的运行时指引：
 *   - 同一步并发：让模型把互不依赖的调用一起发出，宿主本来就支持一次多调用；
 *   - 批量读写：告诉模型两个批量工具存在，否则模型不会主动用它们。
 *
 * 段落文本按每次装配重新求值，页面上开关一切换，下一次请求即生效。
 */
import type { HostPluginContext, PromptAssemblyContext } from '../../../types/host'
import { isEnabled, readChatAccelSettings } from './settings'

/** 段落名，出现在装配结果里，也用于技能包按前缀隐藏。 */
const SECTION_NAME = 'chat-accel:guidance'

/** 段落在提示词里的位置：排在工具说明（100 附近）之后，属于工具使用指引。 */
const SECTION_ORDER = 150

/** 同一步并发指引：只在启用 parallelPrompt 时注入。 */
const PARALLEL_GUIDANCE = [
  'When a turn needs several independent tool calls, emit them together in the same assistant message instead of one call per step.',
  'Reads, searches, and other read-only calls may run concurrently; keep dependent calls sequential and wait for the result a later call needs.',
].join('\n')

/** 批量编辑指引：只在启用 batchEdit 且工具已注册时注入。 */
const BATCH_EDIT_GUIDANCE =
  'Use edit_files to apply several independent edits in one call; each entry keeps the same literal-match rules as edit.'

/**
 * 按当前设置拼出本轮要注入的指引；没有启用任何条目时返回空串。
 * @param context 装配上下文，本段不依赖具体会话
 * @returns 指引文本
 */
function guidanceText(context: PromptAssemblyContext): string {
  try {
    void context
    const settings = readChatAccelSettings()
    const blocks: string[] = []

    // 顺序固定：先并发，再批量编辑
    if (isEnabled(settings, 'parallelPrompt')) blocks.push(PARALLEL_GUIDANCE)
    if (isEnabled(settings, 'batchEdit')) blocks.push(BATCH_EDIT_GUIDANCE)

    return blocks.join('\n\n')
  } catch (error) {
    // 读设置失败不应拖垮整次装配：留日志，本轮当作没有指引
    console.error('[chat-accel] 生成提示词指引失败:', error)

    return ''
  }
}

/**
 * 注册「对话加速」的提示词段。
 * @param ctx 宿主上下文，需要 systemPrompt 服务
 */
export function installChatAccelPrompt(ctx: HostPluginContext): void {
  const prompt = ctx.systemPrompt
  if (prompt === undefined) {
    console.error('[chat-accel] 未取得 systemPrompt 服务，提示词指引不会生效')
    return
  }

  ctx.effect(
    () =>
      prompt.section({
        name: SECTION_NAME,
        order: SECTION_ORDER,
        // 指引是固定文本，不含变量占位符
        interpolate: false,
        text: guidanceText,
      }),
    'chat-accel: prompt',
  )
}
