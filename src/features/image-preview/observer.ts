/**
 * 会话区域的图片预览观察器。
 *
 * 宿主没有提供消息级渲染插槽，只能在会话正文渲染完成后扫描文本并追加预览。
 * 观察范围限定在会话正文容器内；回调只做入队，真正的扫描合并到每帧一次，
 * 并且每帧有节点数上限，长会话不会因为一次大变更卡住界面。
 */
import {
  PREVIEW_ATTRIBUTE,
  closestBlock,
  collectImagePaths,
  isOwnPreviewNode,
  syncBlockPreviews,
} from './preview'

/** 会话正文容器的候选选择器，从最精确到最宽泛；宿主改版时逐级回退。 */
const CONTAINER_SELECTORS = [
  '[data-conversation-region="chat"]',
  '[data-conversation-scroll]',
  '[data-slot="main.conversation"]',
]

/** 每帧最多处理的变更节点数；超出的部分留到下一帧，避免一次性扫描长会话。 */
const MAX_NODES_PER_FRAME = 40

/** 容器重建后的重定位间隔；缓存节点失联时才真正查询选择器。 */
const RELOCATE_INTERVAL_MS = 1500

/**
 * 按优先级定位会话正文容器。
 * @returns 容器；页面尚未渲染出会话区时返回 undefined
 */
function findContainer(): HTMLElement | undefined {
  for (const selector of CONTAINER_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector)
    if (element !== null) return element
  }

  return undefined
}

/**
 * 扫描一个子树中的文本并同步预览。
 * @param root 待扫描的元素
 */
function scanSubtree(root: Element): void {
  const grouped = new Map<Element, string[]>()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)

  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    // 跳过自己插入的节点：预览容器里没有文本，但宿主可能把它包进别的块
    if (isOwnPreviewNode(node)) continue

    const text = node as Text
    const paths = collectImagePaths(text.data)
    if (paths.length === 0) continue

    const block = closestBlock(text.parentElement)
    if (block === undefined) continue

    const known = grouped.get(block)
    if (known === undefined) {
      grouped.set(block, paths)
      continue
    }

    for (const path of paths) {
      if (!known.includes(path)) known.push(path)
    }
  }

  for (const [block, paths] of grouped) syncBlockPreviews(block, paths)
}

/**
 * 安装会话图片预览观察器。
 * @returns 清理函数：断开观察、撤销定时器并移除已插入的预览
 */
export function installImagePreviewObserver(): () => void {
  let container = findContainer()
  const pending = new Set<Node>()
  let frame = 0
  let disposed = false

  /**
   * 处理一帧内的积压变更。
   */
  function flush(): void {
    if (container === undefined || !container.isConnected) return

    const nodes = Array.from(pending).slice(0, MAX_NODES_PER_FRAME)
    for (const node of nodes) pending.delete(node)

    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement
        if (parent === null || !container.contains(parent) || isOwnPreviewNode(node)) continue

        // 文本变化时重扫整个块：同一块里可能还有别的文本节点各带一个路径，
        // 只按当前文本同步会丢掉别的路径的预览
        const block = closestBlock(parent)
        if (block !== undefined) scanSubtree(block)
        continue
      }

      if (!(node instanceof Element) || isOwnPreviewNode(node)) continue

      // 新增节点在会话区内：只扫这一棵子树；会话区外部的变化（侧边栏等）直接忽略
      if (container.contains(node)) {
        scanSubtree(node)
        continue
      }

      // 会话容器本身被重建：重新扫一遍容器内容
      if (node.contains(container)) scanSubtree(container)
    }
  }

  /**
   * 请求下一帧处理积压变更；同一帧内的多次 DOM 变化只安排一次。
   */
  function schedule(): void {
    if (disposed || frame !== 0) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      flush()
      if (pending.size > 0) schedule()
    })
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') {
        pending.add(record.target)
        continue
      }

      for (const node of record.addedNodes) pending.add(node)
    }

    schedule()
  })

  /**
   * 把容器整棵子树拆成节点入队，交给逐帧扫描分片处理。
   * @param element 容器
   */
  function enqueueTree(element: Element): void {
    if (element.children.length === 0) {
      pending.add(element)
      return
    }

    for (const child of element.children) pending.add(child)
  }

  /**
   * 开始观察当前容器。
   */
  function attach(): void {
    if (container === undefined) return
    observer.observe(container, { childList: true, characterData: true, subtree: true })
    enqueueTree(container)
    schedule()
  }

  if (container !== undefined) attach()

  // 会话容器会随界面重建（切换会话、返回列表），失联时重新定位并重挂观察器
  const relocateTimer = window.setInterval(() => {
    if (container !== undefined && container.isConnected) return

    observer.disconnect()
    container = findContainer()
    if (container === undefined) return

    attach()
  }, RELOCATE_INTERVAL_MS)

  return () => {
    disposed = true
    observer.disconnect()
    window.clearInterval(relocateTimer)
    if (frame !== 0) window.cancelAnimationFrame(frame)

    // 插件卸载或开关关闭时清掉已插入的预览，不给宿主留残留节点
    for (const element of document.querySelectorAll(`[${PREVIEW_ATTRIBUTE}]`)) element.remove()
  }
}
