/**
 * 「内存守护」的宿主侧扩展。
 *
 * 只提供一条只读路由：浏览器拿不到渲染进程的真实常驻内存，桌面版要靠宿主
 * 读进程表补上这个数。这里不做任何回收动作——重建由页面自己完成，宿主进程
 * 的回收会杀掉正在跑的会话，不能由插件代劳。
 */
import type { HostPluginContext } from '../../types/host'

import { installMemoryGuardRoutes } from './host/routes'

/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'memory-guard'

export const inject = ['webServer']

/**
 * 注册内存读数路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[memory-guard] 未取得 webServer 服务，内存读数接口不会注册')

    return
  }

  ctx.effect(() => installMemoryGuardRoutes(webServer), 'memory-guard: routes')
}
