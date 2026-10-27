/**
 * 「技能包」的宿主侧扩展。
 *
 * 技能包不预注册成预设——它要叠加在用户选择的模式之上，只在新建会话选定组合时
 * 才合成并注册。这里负责登记路由，并在插件卸载时撤销组合预设。
 */
import type { HostPluginContext } from '../../types/host'

import { disposePackPresets, restoreComposedPresets } from './host/presets'
import { installPromptOverlay } from './host/prompt-overlay'
import { installPowerPackRoutes } from './host/routes'

/**
 * 预设注册依赖宿主的 Agent 预设服务；工具注册表用于枚举全局能力，
 * 技能包要靠它把「排除的全局插件 / 全局 MCP」落到会话级的工具掩码上。
 * 系统提示词服务用于安装最外层包装，挡住绕过 waterfall 的提示词改写。
 */
export const inject = ['agentPresets', 'tools', 'systemPrompt']

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

  // 最外层包装要在全局插件（如 dsh-purge）包装 assemble 之后仍保持生效
  installPromptOverlay(ctx)

  ctx.effect(() => () => {
    void disposePackPresets()
  }, 'power-pack: presets')

  // 组合预设只活在宿主内存里：启动时按记录重建，旧会话的预设 id 才不会失效。
  // 重建出的预设同样由上面那条 effect 统一注销，这里不需要额外的清理动作。
  ctx.effect(() => {
    void restoreComposedPresets(api, ctx.tools, profileDir).catch((error: unknown) => {
      console.error('[power-pack] 启动重建组合预设失败:', error)
    })

    return () => undefined
  }, 'power-pack: restore')

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
