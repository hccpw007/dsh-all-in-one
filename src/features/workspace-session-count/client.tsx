/**
 * 「项目会话数」的客户端扩展。
 *
 * 开关打开时安装项目名后的计数显示；开关关闭时不安装任何监听，
 * 宿主侧边栏保持原样。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { readWorkspaceSessionCountEnabled } from './storage'
import { installWorkspaceSessionCount } from './workspace-count'

/**
 * 安装侧边栏项目名后的会话数量显示。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature key 前缀的翻译函数
 */
export function apply(ctx: PluginContext, _t: Translate): void {
  if (!readWorkspaceSessionCountEnabled()) return

  // 缺少会话或工作区服务时只跳过计数显示，设置页的开关仍可正常使用
  ctx.inject(['sessions', 'uiWorkspace'], (scoped) => {
    const sessions = scoped.sessions
    const uiWorkspace = scoped.uiWorkspace
    if (sessions === undefined || uiWorkspace === undefined) return

    ctx.effect(
      () => installWorkspaceSessionCount(sessions, uiWorkspace),
      'workspace-session-count: sidebar rows',
    )
  })
}
