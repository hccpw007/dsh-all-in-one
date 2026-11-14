/**
 * 「全自动执行」的客户端扩展。
 *
 * 唯一挂载点是输入框右侧的控件行（`conversation.input.right`）：宿主在这里
 * 按列表插槽渲染，按钮排在模型选择器与「回退」之前。会话级开关由组件自己
 * 读写宿主路由，扩展只负责注册入口。
 *
 * 设置页的开关决定是否安装该入口：关闭时不注册任何插槽，页面保持宿主原样。
 */
import React from 'react'

import type { PluginContext, Translate } from '../../types/plugin'
import { AutoRunToggle, type AutoRunToggleProps } from './AutoRunToggle'
import { readAutoRunButtonEnabled } from './storage'

/** 输入框右侧控件行的插槽名。 */
const INPUT_RIGHT_SLOT = 'conversation.input.right'

/**
 * 安装输入框右侧的全自动开关。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 设置页开关关闭时不注册插槽（与其它 feature「关闭即不安装」的契约一致）
  if (!readAutoRunButtonEnabled()) return

  ctx.slots.inject(INPUT_RIGHT_SLOT, () =>
    ctx.slots.register(
      {
        name: INPUT_RIGHT_SLOT,
        id: 'auto-run-toggle',
        // 较小的 order 让它排在模型选择器与「回退」左侧，成为这一排的第一个控件
        order: -100,
      },
      // sessionId 取宿主每次渲染传入的 standardProps：切换对话时插槽会重新渲染，
      // 组件随之读到新会话；若在注册时用 inject 固化，切换对话后按钮会继续改旧会话的开关
      (props: Record<string, unknown>) => (
        <AutoRunToggle {...(props as unknown as Omit<AutoRunToggleProps, 't'>)} t={t} />
      ),
    ),
  )
}
