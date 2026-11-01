/**
 * 「对话加速」的宿主侧扩展。
 *
 * 三件事都只在宿主进程里成立：
 *   1. 提供设置页读写的本地路由，写入后立即应用；
 *   2. 按设置给只读工具补并发声明、注册 `edit_files`；
 *   3. 按设置改写宿主工具结果裁剪的字符预算，并注入工具使用指引。
 *
 * 全部改造都是运行期行为，不修改宿主安装目录里的任何文件。
 */
import type { HostPluginContext } from '../../types/host'

import { installChatAccelPrompt } from './host/prompt'
import { applyPruneForAgent } from './host/prune'
import { installChatAccelRoutes } from './host/routes'
import { readChatAccelSettings } from './host/settings'
import { applyConcurrencyForAgent, applyToolState, disposeToolState } from './host/tools'

/** 设置接口挂在 Web 服务器上，提示词与工具分别需要 systemPrompt 与 tools。 */
export const inject = ['webServer', 'systemPrompt', 'tools']

/**
 * 注册设置路由、提示词段、工具改造与裁剪预算。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[chat-accel] 未取得 webServer 服务，设置接口不会注册')
    return
  }

  // 提示词段：文本按每次装配求值，开关切换后下一次请求即生效
  installChatAccelPrompt(ctx)

  // 工具：启动时按已保存的设置应用一次，设置变更时由路由重新应用
  ctx.effect(() => {
    applyToolState(ctx)

    return () => disposeToolState()
  }, 'chat-accel: tools')

  // 内置工具与裁剪服务都在 agent 作用域：只能每步按 agent 解析一次
  ctx.effect(() => {
    return ctx.on('agent/pre-step', async ({ agent }, next) => {
      applyPruneForAgent(agent)
      applyConcurrencyForAgent(
        ctx,
        agent,
        readChatAccelSettings().enabledIds.includes('readonlyConcurrency'),
      )

      return next()
    })
  }, 'chat-accel: prune')

  ctx.effect(() => installChatAccelRoutes(ctx, webServer), 'chat-accel: routes')
}
