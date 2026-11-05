/**
 * 「桌面版 Cookie 清理」的宿主侧扩展。
 *
 * 两件事都在宿主侧成立：
 *   1. 启动阶段清理 `dsh-auth-*` 记录——主进程要等本进程发出 ready 才开始欢迎认证，
 *      清理必须抢在这次认证之前完成，所以放在 apply 里同步执行；
 *   2. 提供设置卡片读写开关、阈值与保留条数的本地路由。
 */
import { basename } from 'node:path'

import type { HostPluginContext } from '../../types/host'

import { cleanupAuthCookies } from './host/cleanup'
import { installDesktopCookieRoutes } from './host/routes'
import { readDesktopCookieSettings } from './host/settings'

/** 设置接口挂在 Web 服务器上；服务缺失时只跳过路由，启动清理照常执行。 */
/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'desktop-cookie'

export const inject = ['webServer']

/**
 * 判断本进程是否由桌面版主进程启动。
 *
 * 只有桌面版共享 Electron 的 cookie 库；dev 等 CLI 环境虽然也是同一台机器上的
 * Host，却在浏览器里用自己的 cookie 库，误清会破坏正在运行的桌面版。
 * @param ctx 宿主插件上下文
 * @returns 当前进程属于桌面版时返回 true
 */
function isDesktopProfile(ctx: HostPluginContext): boolean {
  const name = ctx.profileContext?.name
  if (typeof name === 'string' && name !== '') return name === 'desktop'

  const dir = ctx.profileContext?.dir
  if (typeof dir === 'string' && dir !== '') return basename(dir) === 'desktop'

  // 宿主未报告 profile 时按入口脚本兜底：桌面版由 dsh-desktop-host 启动，CLI 环境走 cli.js
  const entry = process.argv[1] ?? ''

  return entry.includes('dsh-desktop-host')
}

/**
 * 注册启动清理与设置路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  if (isDesktopProfile(ctx)) {
    // 启动清理只是「尽量修好认证」的辅助步骤：任何失败都不能拖垮插件装配，
    // 因此这里整体兜底，把原因留给日志
    try {
      const report = cleanupAuthCookies(readDesktopCookieSettings())

      // 只在真删了记录时留一行日志，未达阈值的跳过属正常情况
      if (report.status === 'cleaned') {
        console.log(
          `[desktop-cookie] 已清理 ${report.before - report.after} 条过期认证 cookie，保留 ${report.after} 条`,
        )
      }
    } catch (error) {
      console.error('[desktop-cookie] 启动清理失败，跳过本次清理:', error)
    }
  }

  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[desktop-cookie] 未取得 webServer 服务，设置接口不会注册')
    return
  }

  ctx.effect(() => installDesktopCookieRoutes(webServer), 'desktop-cookie: routes')
}
