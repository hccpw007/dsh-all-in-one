/**
 * 「上下文详情」的宿主侧扩展。
 *
 * 浏览器读不到会话日志，系统提示词与工具定义只能由宿主侧取出：这里注册一条
 * 只读路由，按会话 id 从 append-only 事件日志里读出当前发给模型的两份内容。
 */
import type { HostPluginContext } from '../../types/host'

import { installContextInspectRoutes } from './host/routes'

/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'context-inspect'

export const inject = ['webServer', 'sessionPersistence']

/**
 * 注册详情读取路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  const persistence = ctx.sessionPersistence

  if (webServer === undefined || persistence === undefined) {
    console.error('[context-inspect] 未取得 webServer 或 sessionPersistence 服务，详情接口不会注册')
    return
  }

  ctx.effect(() => installContextInspectRoutes(webServer, persistence), 'context-inspect: routes')
}
