/**
 * 「技能包」的宿主侧扩展。
 *
 * 技能包不预注册成预设——它要叠加在用户选择的模式之上，只在新建会话选定组合时
 * 才合成并注册。这里负责登记路由，并在插件卸载时撤销组合预设。
 */
import type { HostPluginContext } from '../../types/host'

import { disposePackPresets } from './host/presets'
import { installPowerPackRoutes } from './host/routes'

/** 预设注册依赖宿主的 Agent 预设服务。 */
export const inject = ['agentPresets']

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

  ctx.effect(() => () => {
    void disposePackPresets()
  }, 'power-pack: presets')

  ctx.inject(['webServer'], (host) => {
    host.effect(() => installPowerPackRoutes(resolveWebServer(host), api), 'power-pack: routes')
  })
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
