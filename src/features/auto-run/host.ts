/**
 * 「全自动执行」的宿主侧扩展。
 *
 * 三件事都只在宿主侧成立：
 *   1. 把自动模式的行为约定注入系统提示词（按会话求值，开关关闭时为空）；
 *   2. 在 Agent 作用域上安装询问应答器，让模型提问时立刻拿到答复而不是等你；
 *   3. 提供会话级开关的本地路由，供输入框按钮读写。
 */
import type { HostPluginContext } from '../../types/host'

import { installAutoRunAnswerer } from './host/answer'
import { installAutoRunPrompt } from './host/prompt'
import { installAutoRunRoutes } from './host/routes'

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
  installAutoRunAnswerer(ctx)

  const webServer = ctx.webServer
  if (webServer === undefined) {
    console.error('[auto-run] 未取得 webServer 服务，开关接口不会注册')

    return
  }

  ctx.effect(() => installAutoRunRoutes(webServer), 'auto-run: routes')
}
