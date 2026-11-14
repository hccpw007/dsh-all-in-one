/**
 * 「清空会话」的宿主侧扩展。
 *
 * 清空前若当前对话仍在执行任务，宿主侧要先中断这一轮再加入新对话。
 * 中断入口是会话控制器的 cancel：它只存在于宿主进程，浏览器侧拿不到；
 * 服务缺失时路由不注册，运行中的对话会因停止请求无处可发而提示任务未能停止。
 */
import type { HostPluginContext } from '../../types/host'

import { installClearSessionRoutes } from './host/routes'

/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'clear-session'

export const inject = ['webServer', 'sessionController']

/**
 * 注册停止路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  const controller = ctx.sessionController

  // 缺任一服务都无法中断执行中的任务，此时不注册路由
  if (webServer === undefined || controller === undefined) {
    console.error('[clear-session] 未取得 webServer 或 sessionController，停止路由不会注册')

    return
  }

  ctx.effect(() => installClearSessionRoutes(webServer, controller), 'clear-session: routes')
}
