/**
 * 「全自动执行」的客户端扩展。
 *
 * 两个挂载点：输入框右侧的开关（`conversation.input.right`），以及侧边栏会话行
 * 标题前的闪电标识（`sidebar.session.row.leading`）。开关按会话读写宿主路由，
 * 标识只读共享集合，未开启的会话不渲染任何内容。
 *
 * 设置页的开关决定是否安装这两处入口：关闭时都不注册，页面保持宿主原样。
 */
import React from 'react'

import type { PluginContext, Translate } from '../../types/plugin'
import { AutoRunToggle, type AutoRunToggleProps } from './AutoRunToggle'
import { SessionAutoRunMark } from './SessionAutoRunMark'
import { readAutoRunButtonEnabled } from './storage'

/** 输入框右侧控件行的插槽名。 */
const INPUT_RIGHT_SLOT = 'conversation.input.right'

/** 侧边栏会话行的前置插槽名。 */
const SIDEBAR_ROW_SLOT = 'sidebar.session.row.leading'

/**
 * 安装输入框右侧的全自动开关与侧边栏标识。
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

  // 会话行标识与会话同生命周期：宿主按行渲染该插槽，未开启全自动的行自行返回 null
  ctx.slots.inject(SIDEBAR_ROW_SLOT, () =>
    ctx.slots.register(
      {
        name: SIDEBAR_ROW_SLOT,
        id: 'auto-run-mark',
        // 排在行内最前，紧挨会话标题
        order: -100,
      },
      (props: Record<string, unknown>) => (
        <SessionAutoRunMark {...(props as unknown as { sessionId?: string })} />
      ),
    ),
  )
}
