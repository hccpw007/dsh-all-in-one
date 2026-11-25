/**
 * 「提示词优化」的客户端扩展。
 *
 * 在输入框右侧注册一枚图标按钮：点它就用当前会话选中的模型把草稿补成完整需求，
 * 结果整段写回输入框，用户在此基础上自行增删后再发送。
 *
 * 设置页的开关决定是否安装这个按钮：关闭时不注册插槽，输入框保持宿主原样。
 */
import React from 'react'

import type { PluginContext, Translate } from '../../types/plugin'
import { PromptOptimizeDock, type PromptOptimizeDockProps } from './PromptOptimizeDock'
import { readPromptOptimizeEnabled } from './storage'

/** 输入框右侧控件行的插槽名。 */
const INPUT_RIGHT_SLOT = 'conversation.input.right'

/** 在输入框上方给出提示的函数：会话标识、级别与正文。 */
type Notify = (sessionId: string, level: 'info' | 'error', text: string) => void

/**
 * 安装输入框右侧的提示词优化按钮。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 设置页开关关闭时不注册插槽（与其它 feature「关闭即不安装」的契约一致）
  if (!readPromptOptimizeEnabled()) return

  /**
   * 失败提示的落点。
   *
   * 失败原因只靠悬停提示容易被忽略（用户点完就去看输入框），因此同时写一条
   * 输入框提示，位置就在草稿正上方。宿主服务就绪前保持 undefined，此时只记日志。
   */
  let notify: Notify | undefined

  // 会话与对话服务按需注入：客户端上下文的属性只有在 inject 之后才可读取
  ctx.inject(['sessions', 'conversation'], (scoped) => {
    const sessions = scoped.sessions
    const conversation = scoped.conversation
    if (sessions === undefined || conversation === undefined) return

    notify = (sessionId, level, text) => {
      const binding = sessions.binding?.(sessionId)
      if (binding === undefined) return

      try {
        conversation.input.for(binding.ctx).notify(level, text)
      } catch (error) {
        console.error('[prompt-optimize] 写入输入框提示失败:', error)
      }
    }
  })

  // 引用稳定：插槽组件每次渲染拿到同一个函数，不会因它反复重注册
  const notifyOf = (sessionId: string): ((level: 'info' | 'error', text: string) => void) => {
    return (level, text) => notify?.(sessionId, level, text)
  }

  ctx.slots.inject(INPUT_RIGHT_SLOT, () =>
    ctx.slots.register(
      {
        name: INPUT_RIGHT_SLOT,
        id: 'prompt-optimize',
        // 这一层只借插槽拿会话与输入框能力，可见按钮由它自己插到发送按钮之后，
        // 因此 order 只影响这个零宽挂载占位，排在整排最后即可
        order: 100,
      },
      // sessionId、useInput 与 inputActions 都由宿主的 standardProps 逐次渲染传入：
      // 切换对话时插槽会重新渲染，组件随之读到新会话的草稿与输入框操作面
      (props: Record<string, unknown>) => {
        const scoped = props as unknown as Omit<PromptOptimizeDockProps, 't' | 'notify'>
        const sessionId = scoped.sessionId

        return (
          <PromptOptimizeDock
            {...scoped}
            t={t}
            notify={sessionId === undefined ? undefined : notifyOf(sessionId)}
          />
        )
      },
    ),
  )
}
