/**
 * 「编辑排队消息」的客户端扩展。
 *
 * 开关打开时接管排队条上的编辑按钮：点击不再进入行内编辑，而是撤回那条排队，
 * 把文字与图片放回输入框重新编辑。开关关闭时不安装任何观察器，排队条保持宿主原样。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { installQueueEdit } from './queue-edit'
import { recallQueuedMessage, type RecallOutcome } from './recall'
import { readQueueEditEnabled } from './storage'

/** 撤回结果到提示文案的映射；成功时不打扰用户。 */
function noticeKeyOf(outcome: RecallOutcome): { level: 'info' | 'error'; key: string } | undefined {
  switch (outcome) {
    case 'applied':
      return undefined
    case 'unsupported':
      return { level: 'info', key: 'unsupported' }
    case 'busy':
      return { level: 'error', key: 'unavailable' }
    case 'imageFailed':
      return { level: 'error', key: 'imageFailed' }
    case 'failed':
      return { level: 'error', key: 'failed' }
  }
}

/**
 * 安装排队条的编辑接管。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  if (!readQueueEditEnabled()) return

  // 会话列表与对话服务缺一不可：没有它们读不到队列内容，也就无从回填
  ctx.inject(['sessions', 'conversation'], (scoped) => {
    const sessions = scoped.sessions
    const conversation = scoped.conversation
    if (sessions === undefined || conversation === undefined) return

    /**
     * 在会话自己的输入框上方给出结果提示。
     * @param sessionId 会话标识
     * @param level 提示级别
     * @param text 提示正文
     */
    const notify = (sessionId: string, level: 'info' | 'error', text: string): void => {
      const binding = sessions.binding?.(sessionId)
      if (binding === undefined) return

      try {
        conversation.input.for(binding.ctx).notify(level, text)
      } catch (error) {
        console.error('[queue-edit] 写入输入框提示失败:', error)
      }
    }

    ctx.effect(
      () => installQueueEdit({
        label: t('recall'),
        run: async (sessionId, index) => {
          const outcome = await recallQueuedMessage({ sessions, conversation }, sessionId, index)
          const notice = noticeKeyOf(outcome)
          if (notice === undefined) return

          notify(sessionId, notice.level, t(notice.key))
        },
      }),
      'queue-edit: dock buttons',
    )
  })
}
