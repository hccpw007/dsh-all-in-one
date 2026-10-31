/**
 * 会话图片的统一放大层。
 *
 * 会话里的缩略图（插件预览、宿主自带的历史图片）都收进同一层查看：右上角有
 * 常驻的关闭按钮，底部工具栏可以放大、缩小、看细节并一键还原成原始大小。
 *
 * 用原生 DOM 而不是 React：本层挂在 `document.body` 上，不进入宿主的渲染树，
 * 关闭或插件卸载时可以直接移除，不会与宿主的组件生命周期互相干扰。
 */
import {
  actualSizeView,
  fitView,
  MAX_ZOOM,
  MIN_ZOOM,
  panBy,
  zoomAt,
  zoomIn,
  zoomOut,
  zoomPercent,
  type FitMetrics,
  type ZoomView,
} from './lightbox-zoom'

/** 放大层需要的界面文案，由客户端扩展按当前语言传入。 */
export interface ImageLightboxLabels {
  /** 对话框的无障碍名称。 */
  dialog: string
  /** 关闭按钮的名称。 */
  close: string
  /** 放大按钮的名称。 */
  zoomIn: string
  /** 缩小按钮的名称。 */
  zoomOut: string
  /** 「适应窗口」按钮的名称。 */
  fit: string
  /** 「原始大小」按钮的名称。 */
  actual: string
  /** 图片读取失败时的提示。 */
  loadFailed: string
}

/** 放大层的标记属性；据此识别本功能的节点，并避免把层内的图片当成会话图片。 */
const LIGHTBOX_ATTRIBUTE = 'data-dsh-image-zoom'

/** 上述属性对应的选择器；点击接管据此排除放大层自身的图片。 */
export const LIGHTBOX_SELECTOR = `[${LIGHTBOX_ATTRIBUTE}]`

/** 铺满窗口的容器；滚动与点击都不再交给下层页面。 */
const OVERLAY_CLASS = 'fixed inset-0 z-[200] box-border outline-none'

/**
 * 遮罩单独一层：只有拆成两个节点才能做到「背景半透明、图片本身不透明」，
 * 直接把透明度加在容器上会让图片一起变淡。
 */
const BACKDROP_CLASS = 'absolute inset-0 box-border bg-overlay opacity-90'

/** 画布：图片以它为基准居中，滚轮与拖动的坐标也按它的尺寸换算。 */
const STAGE_CLASS = 'relative box-border flex h-full w-full items-center justify-center overflow-hidden'

/**
 * 放大图：按原图像素渲染，缩放与位移全部交给 transform，避免每一帧都触发布局。
 * `max-w-none` 必须显式写出，否则宿主对 img 的宽度限制会让 1:1 显示失效。
 */
const IMAGE_CLASS =
  'absolute left-1/2 top-1/2 max-w-none cursor-grab select-none rounded-lg border border-solid border-line4 bg-base shadow-xl transition-opacity duration-150'

/** 拖动过程中换成抓取手势，让「跟着鼠标移动」这件事有即时反馈。 */
const IMAGE_DRAGGING_CLASS = 'cursor-grabbing'

/**
 * 键盘焦点样式：鼠标点开时不出边框，用 Tab 切到按钮时才显示品牌色描边。
 * 浏览器默认的 focus 外框是系统蓝，与宿主主题不一致，打开层时也很抢眼。
 */
const FOCUS_CLASS =
  'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** 关闭按钮：常驻右上角、带描边与投影，任何背景色下都看得见。 */
const CLOSE_CLASS =
  `absolute right-5 top-5 z-20 box-border flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-solid border-line4 bg-layer1 text-primary shadow-xl transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`

/** 底部工具栏：缩放档位与还原入口都放在一根胶囊里，不遮挡图片中心。 */
const TOOLBAR_CLASS =
  'absolute bottom-5 left-1/2 z-20 box-border flex -translate-x-1/2 items-center gap-1 rounded-full border border-solid border-line4 bg-layer1 px-2 py-1.5 shadow-xl'

/** 工具栏按钮：尺寸固定，避免不同语言文案把胶囊撑得忽长忽短。 */
const TOOL_BUTTON_CLASS =
  `flex h-8 min-w-[32px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent px-2 text-[13px] leading-none text-primary transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`

/** 已到缩放上限/下限时的按钮样式：只做提示，点击仍可继续（会被收敛到边界）。 */
const TOOL_BUTTON_MUTED_CLASS = 'opacity-40'

/** 缩放百分比：点击即回到适应窗口，是最直接的「还原」入口。 */
const PERCENT_CLASS =
  `min-w-[56px] cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-center text-[13px] leading-none text-primary transition-colors duration-150 hover:bg-layer2 ${FOCUS_CLASS}`

/** 工具栏分隔线。 */
const SEPARATOR_CLASS = 'mx-1 h-5 w-px bg-line4'

/** 加载失败提示：图片撤下后占住同一位置，避免层里空无一物。 */
const STATUS_CLASS = 'absolute max-w-[70%] text-center text-[13px] text-secondary'

/** 拖动距离小于该阈值时算点击，不移动画面。 */
const DRAG_THRESHOLD = 3

/** 当前打开的放大层；同一时刻只允许一个，重复打开先关旧的。 */
let activeDispose: (() => void) | undefined

/**
 * 关闭当前放大层。
 */
export function closeImagePreview(): void {
  if (activeDispose === undefined) return

  const dispose = activeDispose
  activeDispose = undefined
  dispose()
}

/**
 * 创建一个按钮元素。
 * @param className 按钮类名
 * @param label 无障碍名称，同时作为悬停提示
 * @returns 按钮元素
 */
function createButton(className: string, label: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = className
  button.setAttribute('aria-label', label)
  button.title = label

  return button
}

/**
 * 创建关闭按钮里的叉形图标。
 * @returns SVG 元素
 */
function createCloseIcon(): SVGSVGElement {
  const namespace = 'http://www.w3.org/2000/svg'
  const icon = document.createElementNS(namespace, 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('width', '22')
  icon.setAttribute('height', '22')
  icon.setAttribute('fill', 'none')
  icon.setAttribute('stroke', 'currentColor')
  icon.setAttribute('stroke-width', '2')
  icon.setAttribute('stroke-linecap', 'round')
  icon.setAttribute('aria-hidden', 'true')

  for (const [x1, y1, x2, y2] of [
    ['6', '6', '18', '18'],
    ['18', '6', '6', '18'],
  ]) {
    const line = document.createElementNS(namespace, 'line')
    line.setAttribute('x1', x1)
    line.setAttribute('y1', y1)
    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
    icon.appendChild(line)
  }

  return icon
}

/**
 * 打开放大层。
 * @param source 图片读取地址
 * @param alt 图片的无障碍说明
 * @param labels 界面文案
 */
export function openImagePreview(source: string, alt: string, labels: ImageLightboxLabels): void {
  closeImagePreview()

  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  /** 缩放状态：随图片尺寸与用户操作变化，所有入口共用这一份。 */
  let view: ZoomView = { zoom: 1, offsetX: 0, offsetY: 0 }
  /** 图片自然尺寸与画布尺寸；图片加载完成后才可用。 */
  let metrics: FitMetrics = { naturalWidth: 0, naturalHeight: 0, stageWidth: 0, stageHeight: 0 }

  const overlay = document.createElement('div')
  overlay.setAttribute(LIGHTBOX_ATTRIBUTE, '')
  overlay.className = OVERLAY_CLASS
  // 焦点先落在对话框本身：直接聚焦关闭按钮会让鼠标打开时也带一圈键盘焦点外框
  overlay.tabIndex = -1
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', labels.dialog)

  const backdrop = document.createElement('div')
  backdrop.className = BACKDROP_CLASS
  backdrop.setAttribute('aria-hidden', 'true')
  overlay.appendChild(backdrop)

  const stage = document.createElement('div')
  stage.className = STAGE_CLASS
  overlay.appendChild(stage)

  const image = document.createElement('img')
  image.className = IMAGE_CLASS
  image.alt = alt
  image.draggable = false
  // 加载完成前不占据视觉焦点：此时还不知道自然尺寸，先按 100% 渲染会闪一下
  image.style.opacity = '0'
  stage.appendChild(image)

  const status = document.createElement('span')
  status.className = STATUS_CLASS
  status.textContent = labels.loadFailed
  status.style.display = 'none'
  stage.appendChild(status)

  const closeButton = createButton(CLOSE_CLASS, labels.close)
  closeButton.appendChild(createCloseIcon())
  stage.appendChild(closeButton)

  const toolbar = document.createElement('div')
  toolbar.className = TOOLBAR_CLASS
  stage.appendChild(toolbar)

  const zoomOutButton = createButton(TOOL_BUTTON_CLASS, labels.zoomOut)
  zoomOutButton.textContent = '−'
  toolbar.appendChild(zoomOutButton)

  const percentButton = createButton(PERCENT_CLASS, labels.fit)
  percentButton.textContent = '100%'
  toolbar.appendChild(percentButton)

  const zoomInButton = createButton(TOOL_BUTTON_CLASS, labels.zoomIn)
  zoomInButton.textContent = '+'
  toolbar.appendChild(zoomInButton)

  const separator = document.createElement('span')
  separator.className = SEPARATOR_CLASS
  separator.setAttribute('aria-hidden', 'true')
  toolbar.appendChild(separator)

  const actualButton = createButton(TOOL_BUTTON_CLASS, labels.actual)
  actualButton.textContent = '1:1'
  toolbar.appendChild(actualButton)

  const fitButton = createButton(TOOL_BUTTON_CLASS, labels.fit)
  fitButton.textContent = labels.fit
  toolbar.appendChild(fitButton)

  /**
   * 把当前缩放状态写回 DOM。
   */
  function applyView(): void {
    image.style.transform =
      `translate(-50%, -50%) translate(${String(view.offsetX)}px, ${String(view.offsetY)}px) scale(${String(view.zoom)})`
    percentButton.textContent = `${String(zoomPercent(view))}%`

    // 到达边界时让按钮变淡：继续点不会再有变化，视觉上要能看出来
    zoomOutButton.classList.toggle(TOOL_BUTTON_MUTED_CLASS, view.zoom <= MIN_ZOOM * 1.001)
    zoomInButton.classList.toggle(TOOL_BUTTON_MUTED_CLASS, view.zoom >= MAX_ZOOM * 0.999)
  }

  /**
   * 重新读取画布尺寸并回到适应窗口；窗口缩放后同样调用。
   */
  function resetToFit(): void {
    if (metrics.naturalWidth <= 0) return

    view = fitView(metrics)
    applyView()
  }

  /**
   * 读取当前的图片与画布尺寸。
   */
  function measure(): void {
    metrics = {
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      stageWidth: stage.clientWidth,
      stageHeight: stage.clientHeight,
    }
  }

  /**
   * 按当前视图渲染，并更新工具栏状态。
   */
  function render(next: ZoomView): void {
    view = next
    applyView()
  }

  /**
   * 记录一次图片点击的位置，用于区分「点一下」与「拖动」。
   */
  const drag = {
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  }

  /**
   * 结束拖动并恢复默认光标。
   */
  function endDrag(): void {
    if (!drag.active) return

    drag.active = false
    image.classList.remove(IMAGE_DRAGGING_CLASS)
  }

  /**
   * 拖动图片平移画面。
   * @param event 指针移动事件
   */
  function handlePointerMove(event: PointerEvent): void {
    if (!drag.active || event.pointerId !== drag.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!drag.moved && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) return

    drag.moved = true
    // 位移以按下时的画面为基准累加，避免逐帧累加带来的浮点漂移
    render(panBy({ zoom: view.zoom, offsetX: drag.originX, offsetY: drag.originY }, deltaX, deltaY))
  }

  /**
   * 按下图片开始拖动。
   * @param event 指针按下事件
   */
  function handleImagePointerDown(event: PointerEvent): void {
    // 只响应主键：右键与中键留给浏览器的默认菜单与滚动
    if (event.button !== 0) return
    // 空白处的按下留给「点击遮罩关闭」，不参与拖动
    if (!(event.target instanceof HTMLImageElement)) return

    event.preventDefault()
    event.stopPropagation()
    drag.active = true
    drag.pointerId = event.pointerId
    drag.startX = event.clientX
    drag.startY = event.clientY
    drag.originX = view.offsetX
    drag.originY = view.offsetY
    drag.moved = false
    image.classList.add(IMAGE_DRAGGING_CLASS)
  }

  /**
   * 滚轮以光标为中心缩放，保证指针下的细节停在原处。
   * @param event 滚轮事件
   */
  function handleWheel(event: WheelEvent): void {
    if (metrics.naturalWidth <= 0) return

    event.preventDefault()
    event.stopPropagation()

    const rect = stage.getBoundingClientRect()
    const anchor = {
      x: event.clientX - (rect.left + rect.width / 2),
      y: event.clientY - (rect.top + rect.height / 2),
    }
    // 指数换算是为了让「每格滚轮放大的比例」保持一致，不会在放大后越滚越猛
    const factor = Math.exp(-event.deltaY * 0.0015)

    render(zoomAt(view, anchor, view.zoom * factor))
  }

  /**
   * 双击在「适应窗口」与「原始大小」之间切换，是最常用的两档。
   */
  function handleDoubleClick(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    if (metrics.naturalWidth <= 0) return

    const fit = fitView(metrics)
    const atFit = Math.abs(view.zoom - fit.zoom) < 0.001 && Math.abs(view.offsetX) < 1 && Math.abs(view.offsetY) < 1

    render(atFit ? actualSizeView() : fit)
  }

  /**
   * 键盘操作：Esc 关闭，± 缩放，0 适应窗口，1 原始大小。
   * @param event 键盘事件
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // 放大层是模态的，按键不应同时触发宿主界面的快捷键
      event.preventDefault()
      event.stopPropagation()
      closeImagePreview()
      return
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      render(zoomIn(view))
      return
    }

    if (event.key === '-' || event.key === '_') {
      event.preventDefault()
      render(zoomOut(view))
      return
    }

    if (event.key === '0') {
      event.preventDefault()
      resetToFit()
      return
    }

    if (event.key === '1') {
      event.preventDefault()
      render(actualSizeView())
    }
  }

  /**
   * 窗口尺寸变化后重新读取画布尺寸：仍处于「适应窗口」时跟着重新贴合，
   * 已经放大到看细节时保持用户的定位不动。
   */
  function handleResize(): void {
    const atFit =
      Math.abs(view.zoom - fitView(metrics).zoom) < 0.001 && Math.abs(view.offsetX) < 1 && Math.abs(view.offsetY) < 1
    measure()
    if (atFit) resetToFit()
  }

  /**
   * 图片加载完成：按适应窗口初始化，并显示出来。
   */
  function handleLoad(): void {
    image.style.opacity = '1'
    measure()
    resetToFit()
  }

  /**
   * 图片读取失败：换成文字提示，工具栏与关闭按钮保持可用。
   */
  function handleError(): void {
    image.style.display = 'none'
    status.style.display = 'block'
    toolbar.style.display = 'none'
    console.warn('[image-preview] 放大图读取失败:', source)
  }

  // 点击空白遮罩关闭；图片与工具栏上的点击各自阻止冒泡，不会误关
  overlay.addEventListener('click', () => closeImagePreview())
  toolbar.addEventListener('click', (event) => event.stopPropagation())
  stage.addEventListener('pointerdown', handleImagePointerDown)
  stage.addEventListener('dblclick', handleDoubleClick)
  stage.addEventListener('wheel', handleWheel, { passive: false })
  image.addEventListener('click', (event) => event.stopPropagation())
  image.addEventListener('load', handleLoad)
  image.addEventListener('error', handleError)
  closeButton.addEventListener('click', () => closeImagePreview())
  closeButton.addEventListener('pointerdown', (event) => event.stopPropagation())

  zoomInButton.addEventListener('click', () => render(zoomIn(view)))
  zoomOutButton.addEventListener('click', () => render(zoomOut(view)))
  percentButton.addEventListener('click', resetToFit)
  fitButton.addEventListener('click', resetToFit)
  actualButton.addEventListener('click', () => render(actualSizeView()))

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
  window.addEventListener('keydown', handleKeydown, true)
  window.addEventListener('resize', handleResize)

  document.body.appendChild(overlay)
  image.src = source
  // 图片可能已在缓存里：此时不会再触发 load，必须自己补一次初始化
  if (image.complete && image.naturalWidth > 0) handleLoad()
  overlay.focus()
  applyView()

  /**
   * 关闭并清理：移除节点、撤销所有监听，把焦点还给触发前的元素。
   */
  activeDispose = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
    window.removeEventListener('keydown', handleKeydown, true)
    window.removeEventListener('resize', handleResize)
    overlay.remove()
    previouslyFocused?.focus()
  }
}
