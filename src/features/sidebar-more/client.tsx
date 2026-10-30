/**
 * 「菜单收进更多」的客户端扩展。
 *
 * 开关打开时安装菜单搬运；开关关闭时不安装任何监听，宿主界面保持原样。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { installSidebarMore } from './sidebar-more'
import { readSidebarMoreEnabled } from './storage'

/**
 * 安装顶部入口到底部「更多」菜单的搬运。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature key 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  if (!readSidebarMoreEnabled()) return

  ctx.effect(() => installSidebarMore(t), 'sidebar-more: footer menu')
}
