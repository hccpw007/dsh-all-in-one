/**
 * 会话中本地图片与附件 ID 的识别与预览插入。
 *
 * 会话正文由宿主渲染成普通 DOM，本功能只在旁边追加预览节点：
 *   - 不修改宿主节点、不拦截事件、不读写会话数据；
 *   - 图片内容走宿主侧路由 `/dsh-all-in-one/image` 读取，浏览器端不接触文件系统。
 *   - 点击放大统一由 `image-click-zoom.ts` 接管，预览图不再各自绑定点击。
 *
 * 采用原生 DOM 而非 React：预览要插进宿主渲染的任意消息块之间，宿主不提供
 * 消息级插槽，用 React 会与宿主的渲染树互相覆盖。
 */
import { hostRenderedAnchor, isContinuous, registerHostRenderedImage } from './continuity'
import { closeImagePreview } from './lightbox'

/** 预览容器的标记属性，扫描时据此跳过自己插入的节点，避免回调自激。 */
const PREVIEW_ATTRIBUTE = 'data-dsh-image-preview'

/** 预览容器的 Tailwind 类名；类名必须出现在源码里，构建期才会生成对应样式。 */
const WRAPPER_CLASS = 'mt-2 flex flex-col items-start gap-2'

/** 预览图的 Tailwind 类名；preflight 已关闭，描边必须显式写出 border-solid。 */
const IMAGE_CLASS =
  'block max-h-[320px] max-w-full cursor-zoom-in rounded-lg border border-solid border-line4 bg-base object-contain'

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

/** 已告警过「不是合法 URI 编码」的 token：流式输出下同一段文本会被反复扫描。 */
const warnedDecodeFailures = new Set<string>()

/** 编码告警的上限，防止异常输入让集合无限增长。 */
const MAX_DECODE_WARNINGS = 100

/**
 * 宿主的消息行标记。
 *
 * 同一条工具调用里，路径会分别出现在标题块与结果块上，而宿主渲染的原图只在
 * 其中一块里；按行判断「这条消息是不是已经有图」才能把两处预览一起让位。
 */
const HOST_MESSAGE_ROW_SELECTOR = '[data-chat-anchor-key]'

/**
 * 工具调用的根容器标记。
 *
 * 截图类工具会把结果图片渲染在调用容器内；能取到该容器时按它判断，
 * 同一调用里标题与结果上的路径就一起让位。取不到时退回消息行。
 */
const TOOL_CALL_SELECTOR = '[data-tool]'

/**
 * macOS 把 `/tmp`、`/var`、`/etc` 挂在 `/private` 下的符号链接，
 * 同一文件因此常以 `/tmp/x.png` 与 `/private/tmp/x.png` 两种写法出现在会话里。
 * 只用于判断「是不是同一张图」，实际请求仍用原文路径：
 * Linux 上这些目录是真实目录，按别名改写会让读取地址失效。
 */
const PRIVATE_ALIASES = ['/tmp', '/var', '/etc']

/**
 * 求一条路径的归一化键，用来识别同一文件的不同写法。
 * @param path 本地图片绝对路径或宿主附件 ID
 * @returns 归一到 `/private/...` 形式的键；非别名路径原样返回
 */
function canonicalPathKey(path: string): string {
  for (const alias of PRIVATE_ALIASES) {
    if (path === alias || path.startsWith(`${alias}/`)) return `/private${path}`
  }

  return path
}

/**
 * 预览的判断范围：工具调用容器 → 消息行 → 挂载点本身，逐级回退。
 * @param anchor 预览挂载点
 * @returns 判断「是否已有宿主图片」的范围元素
 */
function previewScope(anchor: Element): Element {
  return anchor.closest(TOOL_CALL_SELECTOR) ?? anchor.closest(HOST_MESSAGE_ROW_SELECTOR) ?? anchor
}

/**
 * 判断范围内是否已有宿主渲染的图片。
 *
 * 宿主已经显示原图时再插一张预览就是同一张图出现两次，预览应当让位。
 * 本功能自己的预览图不算：它们挂在挂载点之后，不在判断范围内。
 * @param anchor 预览挂载点
 * @returns 已有宿主图片时返回 true
 */
function hasHostImage(anchor: Element): boolean {
  for (const image of previewScope(anchor).querySelectorAll('img')) {
    if (!isOwnPreviewNode(image)) return true
  }

  return false
}

/**
 * 按归一化键去重，同一文件只保留最先出现的写法。
 * @param paths 路径列表
 * @returns 去重后的路径列表
 */
function dedupeByCanonicalPath(paths: string[]): string[] {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const path of paths) {
    const key = canonicalPathKey(path)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(path)
  }

  return unique
}

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
    // 不是合法 URI 编码时按原样使用：路径里的 `%` 是字符本身，不是转义。
    // 流式输出会让同一段文本每帧重扫一次，同一 token 只告警一次
    if (!warnedDecodeFailures.has(withoutPunctuation)) {
      if (warnedDecodeFailures.size >= MAX_DECODE_WARNINGS) warnedDecodeFailures.clear()
      warnedDecodeFailures.add(withoutPunctuation)
      console.warn('[image-preview] 路径不是合法 URI 编码，按原样使用:', withoutPunctuation, error)
    }
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
 * 求一条路径的预览挂载点。
 *
 * 工具调用内部是宿主的横向标题行，预览插进标题区就会与标题并排；统一挂到
 * 调用容器之后，预览才和正文段落一样独占一行。
 * @param block 路径所在的块级容器
 * @returns 预览应插入其后的元素
 */
export function previewAnchor(block: Element): Element {
  return block.closest(TOOL_CALL_SELECTOR) ?? block
}

/**
 * 已插入预览的归一化路径 → 拥有它的预览容器。
 *
 * 同一张图常在一段工具调用里出现两次：调用标题写着 `/tmp/x.png`，结果里写着
 * `/private/tmp/x.png`。两者落在不同的块上，只按块内去重仍会各插一张，
 * 因此再按归一化路径占位：同一张图只由最先插入的块预览。
 */
const previewOwners = new Map<string, HTMLElement>()

/**
 * 释放某个容器占用的路径，供它被重建或移除时调用。
 * @param wrapper 预览容器
 */
function releasePreviewOwnership(wrapper: Element): void {
  for (const [key, owner] of previewOwners) {
    if (owner === wrapper) previewOwners.delete(key)
  }
}

/**
 * 撤掉与宿主渲染位置连续重复的预览。
 * @param key 归一化后的路径
 * @param hostAnchor 宿主渲染图片的位置
 */
function dropContinuousPreview(key: string, hostAnchor: Element): void {
  const wrapper = previewOwners.get(key)
  if (wrapper === undefined) return

  // 容器已随虚拟滚动卸载：顺手释放映射，避免历史图片一直持有旧节点
  if (!wrapper.isConnected) {
    previewOwners.delete(key)

    return
  }

  if (!isContinuous(wrapper, hostAnchor)) return

  releasePreviewOwnership(wrapper)
  wrapper.remove()
}

/**
 * 把一个挂载点内识别到的路径同步成预览节点。
 *
 * 同一个挂载点只保留一个预览容器：路径集合变化时整体重建，未变化时不做任何 DOM 写入。
 * @param anchor 预览挂载点（正文块或工具调用容器）
 * @param paths 该挂载点内的本地图片路径
 */
export function syncBlockPreviews(anchor: Element, paths: string[]): void {
  // 宿主重渲染可能已经移除了预览容器，这里先以 DOM 实际状态为准
  const existing = anchor.nextElementSibling
  const wrapper = existing instanceof HTMLElement && existing.hasAttribute(PREVIEW_ATTRIBUTE)
    ? existing
    : undefined

  const hostImage = hasHostImage(anchor)

  // 宿主已经把原图渲染出来时登记这些路径：相邻工具调用里的同一文件不再重复插预览。
  // 只登记工具调用内的宿主图片——正文消息行里的图不一定对应这段文字里的路径
  const hostImageAnchor = anchor.closest(TOOL_CALL_SELECTOR)
  if (hostImage && hostImageAnchor !== null) {
    for (const path of paths) {
      const key = canonicalPathKey(path)
      registerHostRenderedImage(key, hostImageAnchor)
      dropContinuousPreview(key, hostImageAnchor)
    }
  }

  // 宿主已经把原图渲染出来时不插预览，否则同一张图会显示两次；
  // 同一文件还可能以 `/tmp/...` 与 `/private/tmp/...` 两种写法出现，先去重
  const candidates = hostImage
    ? []
    : dedupeByCanonicalPath(paths.filter((path) => !failedPaths.has(canonicalPathKey(path))))

  // 已被别的挂载点占用的同一张图也不再重复插入（容器断开即视为释放，跟随虚拟滚动）。
  // 容器断开时顺手删掉映射：否则虚拟滚动过的历史图片会一直持有已卸载的节点
  const usablePaths = candidates.filter((path) => {
    const key = canonicalPathKey(path)

    // 宿主在同一次连续引用里已经渲染过这张图：预览让位，避免连续两次展示同一文件
    const hostAnchor = hostRenderedAnchor(key)
    if (hostAnchor !== undefined && isContinuous(anchor, hostAnchor)) return false

    const owner = previewOwners.get(key)
    if (owner === undefined || owner === wrapper) return true
    if (owner.isConnected) return false

    previewOwners.delete(key)

    return true
  })
  // key 与顺序无关：同一组路径因扫描顺序不同被当成变化时，会反复删除重建预览
  const key = usablePaths.map(canonicalPathKey).sort().join('\n')

  if (wrapper !== undefined) {
    if (wrapper.dataset.previewKey === key) return
    releasePreviewOwnership(wrapper)
    wrapper.remove()
  } else if (usablePaths.length === 0 && renderedBlockKeys.get(anchor) === key) {
    // 该挂载点此前已判定为无需预览（路径全部读取失败、被别处占用或宿主已渲染），
    // 不必每次扫描都重试；反之有可用路径却没有容器，只可能是被宿主重渲染移除了，必须重建
    return
  }

  const parent = anchor.parentElement
  if (usablePaths.length === 0 || parent === null) {
    renderedBlockKeys.set(anchor, key)
    return
  }

  const container = document.createElement('div')
  container.setAttribute(PREVIEW_ATTRIBUTE, '')
  container.dataset.previewKey = key
  container.className = WRAPPER_CLASS

  for (const path of usablePaths) {
    container.appendChild(createPreviewImage(path, container))
    previewOwners.set(canonicalPathKey(path), container)
  }

  applyDisclosureState(anchor, container)
  anchor.insertAdjacentElement('afterend', container)
}

/**
 * 求预览挂载点所属的折叠行根节点。
 * @param anchor 预览挂载点
 * @returns 折叠行根节点；不在折叠行里时返回 undefined
 */
function disclosureRoot(anchor: Element): Element | undefined {
  // 工具调用作为挂载点时，折叠标记在它内部的标题行上，先往上找再往里找
  const header =
    anchor.closest('[data-disclosure-header]') ?? anchor.querySelector('[data-disclosure-header]')

  return header?.parentElement ?? undefined
}

/**
 * 按折叠状态设置预览容器是否可见。
 * @param anchor 预览挂载点
 * @param container 预览容器
 */
function applyDisclosureState(anchor: Element, container: HTMLElement): void {
  const root = disclosureRoot(anchor)
  // 收起时用内联 display：预览容器自身带 flex 类名，[hidden] 会被它覆盖
  container.style.display = root !== undefined && !root.hasAttribute('data-open') ? 'none' : ''
}

/**
 * 同步一条折叠行对应的预览可见性。
 *
 * 用户展开或收起折叠行时，行内的预览要跟着一起显示或隐藏。预览可能挂在工具调用
 * 之外，因此除了折叠行内部，还要检查工具调用的下一个兄弟节点。
 * @param root 折叠行根节点
 */
export function syncDisclosurePreviews(root: Element): void {
  const collapsed = !root.hasAttribute('data-open')
  const toolCall =
    root.parentElement?.closest(TOOL_CALL_SELECTOR) ?? root.querySelector(TOOL_CALL_SELECTOR)

  const wrappers = new Set<HTMLElement>()
  const anchored = toolCall?.nextElementSibling
  if (anchored instanceof HTMLElement && anchored.hasAttribute(PREVIEW_ATTRIBUTE)) {
    wrappers.add(anchored)
  }

  // 正文折叠区里的预览仍可能落在折叠行内部
  for (const wrapper of root.querySelectorAll<HTMLElement>(`[${PREVIEW_ATTRIBUTE}]`)) {
    wrappers.add(wrapper)
  }

  for (const wrapper of wrappers) {
    if (collapsed) wrapper.style.display = 'none'
    // 图片加载失败后容器可能已经空了，展开时不要露出一个空壳
    else wrapper.style.display = wrapper.childElementCount === 0 ? 'none' : ''
  }
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
  // 按归一化键记录：同一文件的另一种写法读不到，再试一次也只会失败
  const key = canonicalPathKey(path)
  if (failedPaths.has(key)) return
  if (failedPaths.size >= MAX_FAILED_PATHS) failedPaths.clear()

  failedPaths.add(key)
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

/**
 * 清掉本功能插入的所有节点。
 *
 * 开关关闭或插件卸载时调用：预览容器与放大层都要移除，不给宿主留残留节点。
 */
export function disposePreviews(): void {
  closeImagePreview()
  previewOwners.clear()

  for (const element of document.querySelectorAll(`[${PREVIEW_ATTRIBUTE}]`)) element.remove()
}
