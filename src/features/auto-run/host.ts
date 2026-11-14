/**
 * 「全自动执行」的宿主侧扩展。
 *
 * 五件事都只在宿主侧成立：
 *   1. 把自动模式的行为约定注入系统提示词（按会话求值，开关关闭时为空）；
 *   2. 在工具调用前闸门拦下询问工具，自动模式下不产生任何提问对话框；
 *   3. 在 Agent 作用域上保留一个应答器兜底，万一询问仍走到服务层也立刻作答；
 *   4. 提供会话级开关的本地路由，供输入框按钮读写；
 *   5. 启动后清理配置里已不存在的会话与工作空间记录（距上次清理不足 7 天则跳过）。
 */
import type { HostPluginContext } from '../../types/host'

import { installAutoRunAnswerer } from './host/answer'
import { installAutoRunPrompt } from './host/prompt'
import { installAutoRunPrune } from './host/prune'
import { installAutoRunRoutes } from './host/routes'
import { installAutoRunToolGuard } from './host/tool-guard'

/** 功能标识，与 feature 目录名一致；装配失败时用于定位。 */
export const id = 'auto-run'

/**
 * 自动模式依赖提示词与 Web 服务器两类服务。
 *
 * 宿主的 inject 是全有或全无：任一服务缺失时本扩展整体不执行，避免只生效一半
 * （例如按钮能点、提示词却没注入）而造成难以排查的“开着但没用”。
 */
export const inject = ['systemPrompt', 'webServer']

/**
 * 注册宿主能力。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  installAutoRunPrompt(ctx)
  installAutoRunToolGuard(ctx)
  installAutoRunAnswerer(ctx)
  ctx.effect(() => installAutoRunPrune(), 'auto-run: prune')

  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[auto-run] 未取得 webServer 服务，开关接口不会注册')

    return
  }

  ctx.effect(() => installAutoRunRoutes(webServer), 'auto-run: routes')
}
