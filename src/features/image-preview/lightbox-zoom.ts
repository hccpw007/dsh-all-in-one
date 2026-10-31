/**
 * 放大层的缩放与位移计算。
 *
 * 只做纯数值运算、不接触 DOM：按钮、滚轮、双击三个入口都换算到同一份状态上，
 * 各入口各自记一份比例时，反复切换就会出现"按钮说 100%、画面其实不是 100%"的情况。
 */

/** 放大层的视图状态：缩放倍数以原图像素为基准，位移以视口中心为原点。 */
export interface ZoomView {
  /** 缩放倍数；1 表示原图 1:1 像素。 */
  zoom: number
  /** 水平位移，单位像素。 */
  offsetX: number
  /** 垂直位移，单位像素。 */
  offsetY: number
}

/** 计算「适应窗口」所需的比例：图片自然尺寸与画布尺寸。 */
export interface FitMetrics {
  naturalWidth: number
  naturalHeight: number
  stageWidth: number
  stageHeight: number
}

/** 视口中心以外的基准点，用于滚轮以光标为中心缩放。 */
export interface ZoomAnchor {
  /** 相对画布中心的水平坐标。 */
  x: number
  /** 相对画布中心的垂直坐标。 */
  y: number
}

/** 最小缩放倍数：允许把超大图缩到极小以看全貌。 */
export const MIN_ZOOM = 0.02

/** 最大缩放倍数：允许放大到看清像素边缘。 */
export const MAX_ZOOM = 16

/** 每次点击放大/缩小按钮的步进倍数。 */
const STEP_FACTOR = 1.25

/** 画布四周留白：图片贴边时看不出边界，也没法继续拖动。 */
const STAGE_PADDING = 32

/**
 * 计算缩放倍数的合法区间。
 * @param zoom 目标倍数
 * @returns 收敛到区间内的倍数；非有限数按 1 处理
 */
export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1

  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

/**
 * 计算「适应窗口」的视图：整图完整落在画布内并居中。
 * @param metrics 图片自然尺寸与画布尺寸
 * @returns 适应窗口后的视图状态
 */
export function fitView(metrics: FitMetrics): ZoomView {
  if (metrics.naturalWidth <= 0 || metrics.naturalHeight <= 0) {
    return { zoom: 1, offsetX: 0, offsetY: 0 }
  }

  const availableWidth = Math.max(1, metrics.stageWidth - STAGE_PADDING * 2)
  const availableHeight = Math.max(1, metrics.stageHeight - STAGE_PADDING * 2)
  const scale = Math.min(availableWidth / metrics.naturalWidth, availableHeight / metrics.naturalHeight)

  // 比画布小的图片不放大：适应窗口只用于收进超出视口的大图，小图放大只会变糊
  return { zoom: clampZoom(Math.min(1, scale)), offsetX: 0, offsetY: 0 }
}

/**
 * 以某个基准点缩放到目标倍数，并让基准点下方的图像内容停在原处。
 * @param view 当前视图
 * @param anchor 缩放基准点，相对画布中心
 * @param targetZoom 目标倍数
 * @returns 缩放后的视图
 */
export function zoomAt(view: ZoomView, anchor: ZoomAnchor, targetZoom: number): ZoomView {
  const zoom = clampZoom(targetZoom)
  const ratio = zoom / view.zoom

  return {
    zoom,
    offsetX: anchor.x + (view.offsetX - anchor.x) * ratio,
    offsetY: anchor.y + (view.offsetY - anchor.y) * ratio,
  }
}

/**
 * 以画布中心为基准按倍数缩放。
 * @param view 当前视图
 * @param factor 倍数；大于 1 放大，小于 1 缩小
 * @returns 缩放后的视图
 */
export function zoomBy(view: ZoomView, factor: number): ZoomView {
  return zoomAt(view, { x: 0, y: 0 }, view.zoom * factor)
}

/**
 * 放大一档。
 * @param view 当前视图
 * @returns 放大后的视图
 */
export function zoomIn(view: ZoomView): ZoomView {
  return zoomBy(view, STEP_FACTOR)
}

/**
 * 缩小一档。
 * @param view 当前视图
 * @returns 缩小后的视图
 */
export function zoomOut(view: ZoomView): ZoomView {
  return zoomBy(view, 1 / STEP_FACTOR)
}

/**
 * 按拖动距离平移画面。
 * @param view 当前视图
 * @param deltaX 水平拖动距离
 * @param deltaY 垂直拖动距离
 * @returns 平移后的视图
 */
export function panBy(view: ZoomView, deltaX: number, deltaY: number): ZoomView {
  return { zoom: view.zoom, offsetX: view.offsetX + deltaX, offsetY: view.offsetY + deltaY }
}

/**
 * 切换到原图 1:1 像素显示。
 * @returns 1:1 且居中的视图
 */
export function actualSizeView(): ZoomView {
  return { zoom: 1, offsetX: 0, offsetY: 0 }
}

/**
 * 当前缩放相对原图的百分比，用于工具栏显示。
 * @param view 当前视图
 * @returns 四舍五入后的百分比
 */
export function zoomPercent(view: ZoomView): number {
  return Math.round(view.zoom * 100)
}
