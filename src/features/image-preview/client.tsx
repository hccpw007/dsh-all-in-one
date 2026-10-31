/**
 * 「会话图片预览」的客户端扩展。
 *
 * 开关打开时安装两件事：会话观察器（插本地图片预览）与图片点击接管（会话里的
 * 图片统一用本功能的放大层查看）。开关关闭时不安装任何监听，宿主界面与之前完全一致。
 * 扩展只在阅读侧追加预览节点，不修改会话内容，也不发起任何写入请求。
 */
import type { PluginContext, Translate } from '../../types/plugin'

import { installImageClickZoom } from './image-click-zoom'
import type { ImageLightboxLabels } from './lightbox'
import { installImagePreviewObserver } from './observer'
import { readImagePreviewEnabled } from './storage'

/**
 * 安装图片预览与统一放大层。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  if (!readImagePreviewEnabled()) return

  const labels: ImageLightboxLabels = {
    dialog: t('lightboxDialog'),
    close: t('lightboxClose'),
    zoomIn: t('zoomIn'),
    zoomOut: t('zoomOut'),
    fit: t('fitWindow'),
    actual: t('actualSize'),
    loadFailed: t('loadFailed'),
  }

  ctx.effect(() => installImagePreviewObserver(), 'image-preview: observer')
  ctx.effect(() => installImageClickZoom(labels), 'image-preview: zoom')
}
