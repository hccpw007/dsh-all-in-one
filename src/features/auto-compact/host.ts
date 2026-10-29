/**
 * 「自动压缩会话」的宿主侧扩展。
 *
 * 两件事都只在宿主侧成立：
 *   1. 提供设置页读写开关与两个百分比的本地路由；
 *   2. 在每步派发模型请求前检查上下文占用，达到阈值就压缩较早的历史。
 *
 * 压缩与计价服务随 agent preset 挂载并被 isolate 隔离，插件根作用域读不到，
 * 因此监听器注册在根作用域，所需服务在每次检查时按 agent 的作用域解析。
 */
import type { HostPluginContext } from '../../types/host'

import { installAutoCompactRoutes } from './host/routes'
import { installAutoCompactWatcher } from './host/watcher'

/** 设置接口挂在 Web 服务器上；服务缺失时本扩展不生效。 */
export const inject = ['webServer']

/**
 * 注册设置路由与自动压缩检查。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[auto-compact] 未取得 webServer 服务，设置接口不会注册')
    return
  }

  ctx.effect(() => installAutoCompactRoutes(webServer), 'auto-compact: routes')
  ctx.effect(() => installAutoCompactWatcher(ctx), 'auto-compact: watcher')
}
