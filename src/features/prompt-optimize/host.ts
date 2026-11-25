/**
 * 「提示词优化」的宿主侧扩展。
 *
 * 只注册一条优化路由：模型调用、凭据与计量都在宿主侧，浏览器点按钮时把原文
 * 交给这里，拿回改写结果回写输入框。
 */
import type { HostPluginContext } from '../../types/host'

import { installPromptOptimizeRoutes } from './host/routes'

/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'prompt-optimize'

/**
 * 只硬依赖 Web 服务器。
 *
 * 模型、会话与投影在 `optimizePrompt` 里按需读取：壳子会把各 feature 的 inject
 * 合并成插件级依赖，任一服务名在某个 profile 里不存在，整个插件（含设置页）
 * 都不会装配。因此这里只要求注册路由必需的那一个，其余缺失时降级成可读的错误提示。
 */
export const inject = ['webServer']

/**
 * 注册优化路由。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[prompt-optimize] 未取得 webServer 服务，优化接口不会注册')

    return
  }

  ctx.effect(() => installPromptOptimizeRoutes(ctx, webServer), 'prompt-optimize: routes')
}
