/**
 * 「对话风格」的宿主侧扩展。
 *
 * 启动时读取风格配置并注册为 Agent 预设，同时暴露读写风格的同源 HTTP 路由。
 * 预设注册与路由都挂在 effect 上，插件卸载时一并撤销。
 */
import type { HostPluginContext } from '../../types/host'

import { disposeStylePresets, registerAllStylePresets } from './host/presets'
import { installChatStyleRoutes } from './host/routes'
import { readStyles } from './host/store'

/** 预设注册依赖宿主的 Agent 预设服务。 */
export const inject = ['agentPresets']

/**
 * 注册宿主能力。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const api = ctx.agentPresets
  if (!api) {
    console.error('[chat-style] 未取得 agentPresets 服务，风格预设不会注册')
    return
  }

  ctx.effect(() => {
    let disposed = false

    void (async () => {
      const document = await readStyles()
      // 异步读取期间插件可能已被卸载，此时不再注册
      if (disposed) return

      await registerAllStylePresets(api, document.styles)
    })()

    return () => {
      disposed = true
      void disposeStylePresets()
    }
  }, 'chat-style: presets')

  ctx.inject(['webServer'], (host) => {
    host.effect(() => installChatStyleRoutes(resolveWebServer(host), api), 'chat-style: routes')
  })
}

/**
 * 收窄 webServer 服务；inject 回调保证它存在，缺失时抛错而不是静默跳过。
 * @param ctx 已注入 webServer 的宿主上下文
 * @returns Web 服务器服务
 */
function resolveWebServer(ctx: HostPluginContext) {
  if (!ctx.webServer) throw new Error('chat-style: webServer 服务不可用')

  return ctx.webServer
}
