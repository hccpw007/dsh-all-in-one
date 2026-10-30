/**
 * 「会话历史左侧」的宿主侧扩展。
 *
 * 客户端需要每轮用户输入的文本，而会话记录在磁盘上：这里注册一条只读路由，
 * 把会话 id 转成单行化的用户输入列表。
 */
import type { HostPluginContext } from '../../types/host'

import { installSessionHistoryRoutes } from './host/routes'

/** 轮次文本路由挂在宿主 Web 服务器上；服务缺失时本扩展不生效。 */
export const inject = ['webServer']

/**
 * 注册轮次文本路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[session-history] 未取得 webServer 服务，轮次文本路由不会注册')
    return
  }

  ctx.effect(() => installSessionHistoryRoutes(webServer), 'session-history: routes')
}
