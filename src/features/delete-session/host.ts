/**
 * 「删除会话」的宿主侧扩展。
 *
 * 浏览器无法删除宿主磁盘上的会话目录，这里注册一条本地路由代为删除；
 * 是否显示删除按钮由客户端开关决定，宿主侧不持有该状态。
 */
import type { HostPluginContext } from '../../types/host'

import { installDeleteSessionRoutes } from './host/routes'

/** 删除接口挂在 Web 服务器上；服务缺失时本扩展不生效。 */
export const inject = ['webServer']

/**
 * 注册删除会话的路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[delete-session] 未取得 webServer 服务，删除会话接口不会注册')
    return
  }

  ctx.effect(() => installDeleteSessionRoutes(webServer), 'delete-session: routes')
}
