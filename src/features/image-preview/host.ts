/**
 * 「会话图片预览」的宿主侧扩展。
 *
 * 浏览器拿不到本地文件，预览图必须由宿主侧读取：这里注册一条只读路由，
 * 把会话中出现的图片路径转成同源可见的图片响应。
 */
import type { HostPluginContext } from '../../types/host'

import { installImagePreviewRoutes } from './host/routes'

/** 图片路由挂在宿主 Web 服务器上；服务缺失时本扩展不生效。 */
export const inject = ['webServer']

/**
 * 注册图片读取路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[image-preview] 未取得 webServer 服务，图片预览路由不会注册')
    return
  }

  ctx.effect(() => installImagePreviewRoutes(webServer), 'image-preview: routes')
}
