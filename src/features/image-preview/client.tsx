/**
 * 「会话图片预览」的客户端扩展。
 *
 * 开关打开时安装会话观察器；开关关闭时不安装任何监听，宿主界面与之前完全一致。
 * 扩展只在阅读侧追加预览节点，不修改会话内容，也不发起任何写入请求。
 */
import type { PluginContext } from '../../types/plugin'

import { installImagePreviewObserver } from './observer'
import { readImagePreviewEnabled } from './storage'

/**
 * 安装图片预览观察器。
 * @param ctx 客户端插件上下文
 */
export function apply(ctx: PluginContext): void {
  if (!readImagePreviewEnabled()) return

  ctx.effect(() => installImagePreviewObserver(), 'image-preview: observer')
}
