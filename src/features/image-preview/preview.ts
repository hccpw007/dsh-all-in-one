/**
 * 会话中本地图片与附件 ID 的识别与预览插入。
 *
 * 会话正文由宿主渲染成普通 DOM，本功能只在旁边追加预览节点：
 *   - 不修改宿主节点、不拦截事件、不读写会话数据；
 *   - 图片内容走宿主侧路由 `/dsh-all-in-one/image` 读取，浏览器端不接触文件系统。
 *
 * 采用原生 DOM 而非 React：预览要插进宿主渲染的任意消息块之间，宿主不提供
 * 消息级插槽，用 React 会与宿主的渲染树互相覆盖。
 */

/** 预览容器的标记属性，扫描时据此跳过自己插入的节点，避免回调自激。 */
export const PREVIEW_ATTRIBUTE = 'data-dsh-image-preview'

/** 预览容器的 Tailwind 类名；类名必须出现在源码里，构建期才会生成对应样式。 */
const WRAPPER_CLASS = 'mt-2 flex flex-col items-start gap-2'

/** 预览图的 Tailwind 类名；preflight 已关闭，描边必须显式写出 border-solid。 */
const IMAGE_CLASS =
  'block max-h-[320px] max-w-full rounded-lg border border-solid border-line4 bg-base object-contain'

/** 图片内容由宿主侧路由返回给浏览器，这里只拼请求地址。 */
const IMAGE_ROUTE = '/dsh-all-in-one/image'

/** 渲染为块级的标签；命中的元素直接作为「地址所在的块」，避免调用 getComputedStyle。 */
const BLOCK_TAGS = new Set([
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'DD',
  'DETAILS',
  'DIV',
  'DL',
  'DT',
  'FIELDSET',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'FORM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'LI',
  'MAIN',
  'NAV',
  'OL',
  'P',
  'PRE',
  'SECTION',
  'SUMMARY',
  'UL',
])

/** 表格结构标签：在它们之后插入 div 会破坏表格布局，继续向上找普通块。 */
const TABLE_TAGS = new Set(['TABLE', 'TBODY', 'THEAD', 'TFOOT', 'TR', 'TD', 'TH'])

/** 图片扩展名；与宿主侧路由的允许清单保持一致，避免浏览器请求必然被拒的地址。 */
const IMAGE_EXTENSION_PATTERN = /\.(?:png|jpe?g|gif|webp|bmp|avif|svg|ico)$/i

/**
 * 宿主附件 ID 形态：`sha256:<64 位内容哈希>`。
 *
 * MCP 截图等工具的输出里只有这个 ID，没有文件路径；浏览器端不知道 DSH 主目录在哪，
 * 只把 ID 原样交给宿主侧路由换算成附件库对象。
 */
const ATTACHMENT_ID_PATTERN = /^sha256:[0-9a-f]{64}$/

/**
 * 宿主附件对象路径：`<DSH_HOME>/attachments/v1/objects/<两位>/<64 位哈希>`。
 *
 * 这类文件按内容哈希命名、没有扩展名，但它们是宿主持久化的附件（不会自动清理），
 * 正好是会话里最需要长期预览的来源，因此单独按目录形状识别。
 * 客户端不展开 `~`，展开成绝对路径的活交给宿主侧路由。
 */
const ATTACHMENT_OBJECT_PATTERN = /(?:^|[\\/])attachments[\\/]v1[\\/]objects[\\/][0-9a-f]{2}[\\/][0-9a-f]{64}$/

/** 路径切分用的分隔符：空白、引号与中英文标点，路径里出现它们时本就不会是一个合法地址。 */
const PATH_SPLIT_PATTERN = /[\s"'`<>|，。；：、！？（）【】《》,;]+/

/** 路径尾部可能粘上的标点，属于句子而非路径本身。 */
const TRAILING_PUNCTUATION_PATTERN = /[.,;:!?)\]}>]+$/

/** 单个块已渲染的路径组合，避免重复插入；值为空串表示该块无需预览。 */
const renderedBlockKeys = new WeakMap<Element, string>()

/** 已知读取失败的图片路径：失败后不再重复插入，否则会与观察器形成反复重建的循环。 */
const failedPaths = new Set<string>()

/** 正在等待用户刷新页面的失败记录上限，防止长会话里无限增长。 */
const MAX_FAILED_PATHS = 200

/**
 * 从一段文本中提取本地图片路径。
 * @param text 消息中的文本节点内容
 * @returns 去重后的绝对路径（已去掉 file:// 前缀与尾部标点）
 */
export function collectImagePaths(text: string): string[] {
  const paths: string[] = []

  for (const raw of text.split(PATH_SPLIT_PATTERN)) {
    const candidate = normalizeCandidate(raw)
    if (candidate === undefined) continue
    if (!paths.includes(candidate)) paths.push(candidate)
  }

  return paths
}

/**
 * 把 token 收敛成可请求的来源。
 * @param raw 文本切分出的原始 token
 * @returns 本地图片绝对路径或宿主附件 ID；两者都不是时返回 undefined
 */
function normalizeCandidate(raw: string): string | undefined {
  if (raw === '') return undefined

  // file:// 前缀只支持本机形式（file:///path），网络共享路径浏览器同样取不到
  const withoutScheme = raw.startsWith('file://') ? raw.slice('file://'.length) : raw
  const withoutPunctuation = withoutScheme.replace(TRAILING_PUNCTUATION_PATTERN, '')

  let decoded = withoutPunctuation
  try {
    decoded = decodeURI(withoutPunctuation)
  } catch (error) {
    // 不是合法 URI 编码时按原样使用：路径里的 `%` 是字符本身，不是转义
    console.warn('[image-preview] 路径不是合法 URI 编码，按原样使用:', withoutPunctuation, error)
  }

  // 浏览器端无法把相对路径还原成文件系统位置，只处理绝对路径；
  // `~/` 交给宿主侧展开，浏览器本身不知道用户主目录
  const isAbsolute =
    decoded.startsWith('/') || decoded.startsWith('~/') || /^[A-Za-z]:[\\/]/.test(decoded)
  // 工具输出（MCP 截图等）只有附件 ID，没有文件路径，按 ID 原样保留
  if (!isAbsolute) return ATTACHMENT_ID_PATTERN.test(decoded) ? decoded : undefined

  // 常规图片按扩展名识别；宿主附件对象没有扩展名，按目录形状识别
  if (IMAGE_EXTENSION_PATTERN.test(decoded)) return decoded
  return ATTACHMENT_OBJECT_PATTERN.test(decoded) ? decoded : undefined
}

/**
 * 找到一个文本节点所在的块级容器，预览插在该容器之后。
 * @param element 文本节点的父元素
 * @returns 块级容器；找不到时返回 undefined
 */
export function closestBlock(element: Element | null): Element | undefined {
  let current = element

  while (current !== null) {
    if (current === document.body) return undefined

    const tag = current.tagName
    if (TABLE_TAGS.has(tag)) {
      // 表格内部插入块级预览会破坏列结构，继续向上找表格外的普通块
      current = current.parentElement
      continue
    }

    if (BLOCK_TAGS.has(tag)) return current
    current = current.parentElement
  }

  return undefined
}

/**
 * 把一个块内识别到的路径同步成预览节点。
 *
 * 同一个块只保留一个预览容器：路径集合变化时整体重建，未变化时不做任何 DOM 写入。
 * @param block 消息中的块级容器
 * @param paths 该块内的本地图片路径
 */
export function syncBlockPreviews(block: Element, paths: string[]): void {
  const usablePaths = paths.filter((path) => !failedPaths.has(path))
  const key = usablePaths.join('\n')

  // 宿主重渲染可能已经移除了预览容器，这里先以 DOM 实际状态为准
  const existing = block.nextElementSibling
  const wrapper = existing instanceof HTMLElement && existing.hasAttribute(PREVIEW_ATTRIBUTE)
    ? existing
    : undefined

  if (wrapper !== undefined) {
    if (wrapper.dataset.previewKey === key) return
    wrapper.remove()
  } else if (usablePaths.length === 0 && renderedBlockKeys.get(block) === key) {
    // 该块此前已判定为无需预览（路径全部读取失败），不必每次扫描都重试；
    // 反之有可用路径却没有容器，只可能是被宿主重渲染移除了，必须重建
    return
  }

  const parent = block.parentElement
  if (usablePaths.length === 0 || parent === null) {
    renderedBlockKeys.set(block, key)
    return
  }

  const container = document.createElement('div')
  container.setAttribute(PREVIEW_ATTRIBUTE, '')
  container.dataset.previewKey = key
  container.className = WRAPPER_CLASS

  for (const path of usablePaths) container.appendChild(createPreviewImage(path, container))

  block.insertAdjacentElement('afterend', container)
}

/**
 * 把识别到的来源拼成图片读取地址。
 * @param source 本地图片绝对路径或宿主附件 ID
 * @returns 同源的读取地址
 */
function toImageUrl(source: string): string {
  // 附件 ID 不是文件路径，交给宿主侧按 DSH 主目录换算成附件库对象
  if (source.startsWith('sha256:')) {
    return `${IMAGE_ROUTE}?attachment=${encodeURIComponent(source)}`
  }

  return `${IMAGE_ROUTE}?path=${encodeURIComponent(source)}`
}

/**
 * 创建一个预览图节点。
 * @param path 本地图片路径或宿主附件 ID
 * @param container 预览容器；图片失败后容器为空时一并隐藏
 * @returns img 元素
 */
function createPreviewImage(path: string, container: HTMLElement): HTMLImageElement {
  const image = document.createElement('img')
  image.src = toImageUrl(path)
  // 用路径作无障碍说明，避免空 alt 让读屏软件跳过预览图
  image.alt = path
  image.loading = 'lazy'
  image.decoding = 'async'
  image.className = IMAGE_CLASS
  image.addEventListener('error', () => {
    // 文件可能已被删除或不是真正的图片；记录后不再重试，避免和观察器反复重建
    rememberFailedPath(path)
    image.remove()
    if (container.childElementCount === 0) container.style.display = 'none'
  })

  return image
}

/**
 * 记录一条读取失败的路径。
 * @param path 本地图片路径
 */
function rememberFailedPath(path: string): void {
  if (failedPaths.has(path)) return
  if (failedPaths.size >= MAX_FAILED_PATHS) failedPaths.clear()

  failedPaths.add(path)
  console.warn('[image-preview] 图片读取失败，已停止预览:', path)
}

/**
 * 判断节点是否位于本功能插入的预览容器内。
 * @param node 待判断节点
 * @returns 属于预览容器时返回 true
 */
export function isOwnPreviewNode(node: Node): boolean {
  const element = node instanceof HTMLElement ? node : node.parentElement
  return element?.closest(`[${PREVIEW_ATTRIBUTE}]`) != null
}
