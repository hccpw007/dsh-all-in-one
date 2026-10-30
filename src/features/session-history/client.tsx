/**
 * 「会话历史左侧」的客户端扩展。
 *
 * 开关打开时安装布局搬运：把会话右侧的轮次导航条挪到左侧，点击跳转仍是宿主的实现。
 * 开关关闭时不安装任何监听，页面保持宿主原样。
 */
import type { PluginContext } from '../../types/plugin'
import { readSessionHistoryEnabled } from './storage'
import { installTurnNav } from './turn-nav'

/**
 * 安装轮次导航的左侧化。
 * @param ctx 客户端插件上下文
 */
export function apply(ctx: PluginContext): void {
  if (!readSessionHistoryEnabled()) return

  ctx.effect(() => installTurnNav(), 'session-history: turn-nav')
}
