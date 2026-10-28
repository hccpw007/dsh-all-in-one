/**
 * 「项目记忆」的宿主侧扩展。
 *
 * 三件事都只在宿主侧成立：
 *   1. 把项目记忆注入系统提示词（会话开始后自动带上）；
 *   2. 注册 `memory` 工具，让模型能把「请帮我记住…」写进记忆文件；
 *   3. 提供设置页读写开关与记忆根目录的本地路由。
 *
 * 记忆文件与 Claude Code 同构，根目录指向 `~/.claude/projects` 时两边共用一套。
 */
import type { HostPluginContext } from '../../types/host'

import { installMemoryPrompt } from './host/prompt'
import { installMemoryRoutes } from './host/routes'
import { installMemoryTool } from './host/tool'

/**
 * 记忆需要提示词、工具与 Web 服务器三类服务。
 *
 * 宿主的 inject 是全有或全无：任一服务缺失时本扩展整体不执行。三者在 web profile
 * 里同时存在；单独缺失时由宿主报告启动错误，比静默降级更容易排查。
 */
export const inject = ['systemPrompt', 'tools', 'webServer']

/**
 * 注册宿主能力。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  installMemoryPrompt(ctx)
  installMemoryTool(ctx)

  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[project-memory] 未取得 webServer 服务，设置接口不会注册')
    return
  }

  ctx.effect(() => installMemoryRoutes(webServer), 'project-memory: routes')
}
