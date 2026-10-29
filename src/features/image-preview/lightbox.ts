/**
 * 预览图的放大查看层。
 *
 * 会话里的缩略图受消息宽度限制（最高 320px），细节看不清；点击后在本层按原图显示。
 * 用原生 DOM 而不是 React：本层挂在 `document.body` 上，不进入宿主的渲染树，
 * 关闭或插件卸载时可以直接移除，不会与宿主的组件生命周期互相干扰。
 */

/** 放大层的标记属性；卸载时据此识别是否还挂着本功能的节点。 */
export const LIGHTBOX_ATTRIBUTE = 'data-dsh-image-preview-lightbox'

/** 放大层容器：铺满窗口、居中，并让点击事件从整层起算。 */
const LIGHTBOX_CLASS = 'fixed inset-0 z-[100] flex items-center justify-center p-6'

/**
 * 遮罩单独一层：只有拆成两个节点才能做到「背景半透明、图片本身不透明」，
 * 直接把透明度加在容器上会让图片一起变淡。
 */
const BACKDROP_CLASS = 'absolute inset-0 bg-overlay opacity-80'

/** 放大图：按原图比例缩放到窗口内，不放大到模糊。 */
const LIGHTBOX_IMAGE_CLASS =
  'relative max-h-full max-w-full rounded-lg border border-solid border-line4 bg-base object-contain'

/** 当前打开的放大层；同一时刻只允许一个，重复点击先关旧的。 */
let activeLayer: HTMLElement | undefined

/**
 * 关闭当前放大层。
 */
export function closeImagePreview(): void {
  if (activeLayer === undefined) return

  document.removeEventListener('keydown', handleKeydown)
  activeLayer.remove()
  activeLayer = undefined
}

/**
 * Esc 关闭：放大层没有焦点陷阱，用一个文档级监听保证随时可退出。
 * @param event 键盘事件
 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return

  closeImagePreview()
}

/**
 * 打开放大层。
 * @param source 与原缩略图相同的图片读取地址
 * @param alt 图片的无障碍说明
 */
export function openImagePreview(source: string, alt: string): void {
  closeImagePreview()

  const layer = document.createElement('div')
  layer.setAttribute(LIGHTBOX_ATTRIBUTE, '')
  layer.className = LIGHTBOX_CLASS
  // 点击遮罩关闭；点在图片上不关闭，方便对照细节
  layer.addEventListener('click', closeImagePreview)

  const backdrop = document.createElement('div')
  backdrop.className = BACKDROP_CLASS
  layer.appendChild(backdrop)

  const image = document.createElement('img')
  image.src = source
  image.alt = alt
  image.className = LIGHTBOX_IMAGE_CLASS
  image.addEventListener('click', (event) => event.stopPropagation())
  layer.appendChild(image)

  document.addEventListener('keydown', handleKeydown)
  document.body.appendChild(layer)
  activeLayer = layer
}
