/**
 * 「全自动执行」的客户端扩展。
 *
 * 两个挂载点：输入框右侧的开关（`conversation.input.right` 插槽），以及侧边栏
 * 会话标题前的闪电标识（宿主没有对应插槽，由 DOM 装饰器插在标题前，避免顶掉
 * 状态点）。开关按会话读写宿主路由，标识只读共享集合，未开启的会话不渲染。
 *
 * 设置页的开关决定是否安装这两处入口：关闭时都不注册，页面保持宿主原样。
 */
import React from 'react'

import type { PluginContext, Translate, UiWorkspaceApi } from '../../types/plugin'
import { AutoRunToggle, type AutoRunToggleProps } from './AutoRunToggle'
import { startSessionMarkDecorator } from './session-mark'
import { readAutoRunButtonEnabled } from './storage'

/** 输入框右侧控件行的插槽名。 */
const INPUT_RIGHT_SLOT = 'conversation.input.right'

/**
 * 查询会话所属工作空间。
 *
 * 「工作空间」默认值靠它定位：会话与工作空间的归属只在浏览器侧的工作区快照里，
 * 拿不到快照（宿主版本差异或会话尚未分组）时返回 undefined，由宿主按未分组处理。
 * @param uiWorkspace 宿主工作区服务
 * @param sessionId 会话标识
 * @returns 工作空间标识；不属于任何工作空间时返回 undefined
 */
function findWorkspaceId(uiWorkspace: UiWorkspaceApi, sessionId: string): string | undefined {
  try {
    const items = uiWorkspace.workspaces?.list.getSnapshot().items ?? []

    for (const item of items) {
      if (item.sessionIds.includes(sessionId)) return item.workspaceId
    }

    return undefined
  } catch (error) {
    console.error('[auto-run] 读取会话所属工作空间失败:', error)

    return undefined
  }
}

/**
 * 安装输入框右侧的全自动开关与侧边栏标识。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 设置页开关关闭时不注册插槽（与其它 feature「关闭即不安装」的契约一致）
  if (!readAutoRunButtonEnabled()) return

  // 工作空间服务就绪后才可查询归属；未就绪时查询返回 undefined，按钮照常可用
  let workspaceLookup: (sessionId: string) => string | undefined = () => undefined
  ctx.inject(['uiWorkspace'], (scoped) => {
    const uiWorkspace = scoped.uiWorkspace
    if (uiWorkspace === undefined) return

    workspaceLookup = (sessionId) => findWorkspaceId(uiWorkspace, sessionId)
  })

  // 引用稳定：插槽组件每次渲染都拿到同一个函数，读取 effect 不会因它反复重跑
  const workspaceIdOf = (sessionId: string): string | undefined => workspaceLookup(sessionId)

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
        <AutoRunToggle
          {...(props as unknown as Omit<AutoRunToggleProps, 't' | 'workspaceIdOf'>)}
          t={t}
          workspaceIdOf={workspaceIdOf}
        />
      ),
    ),
  )

  // 侧边栏标识：宿主没有「标题前」插槽，用装饰器插入，因此与状态点并存
  ctx.effect(() => startSessionMarkDecorator(), 'auto-run: session mark')
}
