/**
 * 会话区图片点击的统一接管。
 *
 * 会话里的图片有两类来源：本功能插入的本地预览，以及宿主自己渲染的附件、
 * 工具输出截图与 Markdown 图片。宿主自带的放大层只能看、不能缩放，也没有
 * 明显的关闭入口；这里在文档捕获阶段截住图片点击，两类图片都改用同一个放大层。
 *
 * 之所以要捕获阶段：宿主的放大层挂在 React 的合成事件上（根容器监听），
 * 文档捕获先于它执行，阻止传播即可避免宿主再叠一层自己的浮层。
 */
import { LIGHTBOX_SELECTOR, openImagePreview, type ImageLightboxLabels } from './lightbox'
import { CONVERSATION_SELECTOR } from './conversation'

/** 可放大的最小尺寸：低于它的基本是图标（头像、状态标记、附件按钮里的叉号）。 */
const MIN_IMAGE_SIZE = 44

/**
 * 从点击目标里找出被点的图片。
 * @param target 点击事件的目标节点
 * @returns 图片元素；目标附近没有图片时返回 undefined
 */
function findImage(target: Element): HTMLImageElement | undefined {
  if (target instanceof HTMLImageElement) return target

  const nested = target.closest('img')
  if (nested !== null) return nested

  // 宿主的图片按钮有内边距，点在边缘时目标落在按钮而不是图片上；
  // 按钮内通常只有一张图，取它即可，图标按钮的体积会被后续尺寸判断过滤掉
  return target.closest('button')?.querySelector('img') ?? undefined
}

/**
 * 判断一次点击是否落在会话区的可放大图片上。
 * @param target 点击事件的目标节点
 * @returns 命中的图片元素；不处理时返回 undefined
 */
function resolveClickedImage(target: EventTarget | null): HTMLImageElement | undefined {
  if (!(target instanceof Element)) return undefined

  const image = findImage(target)
  if (image === undefined) return undefined

  // 放大层里的图片自己可拖动，不再递归打开
  if (image.closest(LIGHTBOX_SELECTOR) !== null) return undefined

  // 只接管会话正文里的图片：侧边栏头像、输入框附件缩略图保持宿主原有行为
  if (image.closest(CONVERSATION_SELECTOR) === null) return undefined

  const source = image.currentSrc || image.src
  if (source === '') return undefined

  // 按渲染尺寸与自然尺寸双重过滤：图标被放大显示时也不会被当成内容图片
  if (image.clientWidth < MIN_IMAGE_SIZE || image.clientHeight < MIN_IMAGE_SIZE) return undefined
  if (image.naturalWidth < MIN_IMAGE_SIZE || image.naturalHeight < MIN_IMAGE_SIZE) return undefined

  return image
}

/**
 * 安装会话区图片点击接管。
 * @param labels 放大层的界面文案
 * @returns 清理函数：撤销文档监听
 */
export function installImageClickZoom(labels: ImageLightboxLabels): () => void {
  /**
   * 拦截图片点击并打开统一放大层。
   * @param event 点击事件
   */
  function handleClick(event: MouseEvent): void {
    const image = resolveClickedImage(event.target)
    if (image === undefined) return

    // 宿主把图片包在按钮里，按钮自身的放大、下载等行为一并改用本层
    event.preventDefault()
    event.stopPropagation()
    openImagePreview(image.currentSrc || image.src, image.alt, labels)
  }

  document.addEventListener('click', handleClick, true)

  return () => {
    document.removeEventListener('click', handleClick, true)
  }
}
