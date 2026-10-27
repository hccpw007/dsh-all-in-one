/**
 * 「技能包」的宿主侧扩展。
 *
 * 技能包不预注册成预设——它要叠加在用户选择的模式之上，只在新建会话选定组合时
 * 才合成并注册。这里负责登记路由，并在插件卸载时撤销组合预设。
 */
import type { HostPluginContext } from '../../types/host'

import { disposePackPresets } from './host/presets'
import { installPowerPackRoutes } from './host/routes'

/**
 * 预设注册依赖宿主的 Agent 预设服务；工具注册表用于枚举全局能力，
 * 技能包要靠它把「排除的全局插件 / 全局 MCP」落到会话级的工具掩码上。
 */
export const inject = ['agentPresets', 'tools']

/**
 * 注册宿主能力。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const api = ctx.agentPresets
  if (!api) {
    console.error('[power-pack] 未取得 agentPresets 服务，技能包组合不会注册')
    return
  }

  const profileDir = currentProfileDir(ctx)

  ctx.effect(() => () => {
    void disposePackPresets()
  }, 'power-pack: presets')

  ctx.inject(['webServer'], (host) => {
    host.effect(
      () => installPowerPackRoutes(resolveWebServer(host), api, { profileDir, tools: host.tools }),
      'power-pack: routes',
    )
  })
}

/**
 * 取宿主报告的当前 profile 目录，用于把插件清单限定在本 profile。
 * @param ctx 宿主插件上下文
 * @returns profile 目录；宿主未报告时返回 undefined
 */
function currentProfileDir(ctx: HostPluginContext): string | undefined {
  const dir = ctx.profileContext?.dir
  return typeof dir === 'string' && dir !== '' ? dir : undefined
}

/**
 * 收窄 webServer 服务；inject 回调保证它存在，缺失时抛错而不是静默跳过。
 * @param ctx 已注入 webServer 的宿主上下文
 * @returns Web 服务器服务
 */
function resolveWebServer(ctx: HostPluginContext) {
  if (!ctx.webServer) throw new Error('power-pack: webServer 服务不可用')

  return ctx.webServer
}
