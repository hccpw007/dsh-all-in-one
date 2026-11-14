/**
 * 侧边栏会话行标题前的「全自动」闪电标识。
 *
 * 宿主的 `sidebar.session.row.leading` 插槽与状态点是**互斥**的：会话执行中、
 * 有待处理的询问或刚结束时，那个位置只画状态点（转圈 / 黄点 / 绿点），插槽内容
 * 不渲染。因此标识不能走插槽——会把状态点顶掉。这里改为装饰器：把标识插到标题
 * 元素之前，状态点仍在左侧槽位里正常显示，两者并存、互不影响布局。
 *
 * 标识按会话标识幂等插入：宿主重渲染行或开关切换后，同一行只会有一个标识。
 */
import { ensureEnabledSessionsLoaded, isEnabled, subscribe } from './session-state'

/** 宿主给会话行根元素标注了 `data-row-key="session:<id>"`。 */
const ROW_SELECTOR = '[data-row-key^="session:"]'

/**
 * 行内标题元素的选择器。
 *
 * 宿主用 CSS Module 生成类名（形如 `JoiKIa_title`），`_title` 这段在所有构建里
 * 都保留；不用 `children[1]` 定位，是因为标识插入后下标会整体后移。
 */
const TITLE_SELECTOR = ':scope > [class*="_title"]'

/** 标识节点的标记属性，用来幂等地找出或清除已插入的标识。 */
const MARK_ATTRIBUTE = 'data-dsh-auto-run-mark'

/** 标识宽度：窄长条，宽度约为高度的一半。 */
const MARK_WIDTH = 9

/** 标识高度：略高于 13px 的标题文字，远看也不糊成一条线。 */
const MARK_HEIGHT = 16

/**
 * 标识与标题之间的额外间距。
 *
 * 会话行本身是 flex 布局并带 gap，标识与标题已经隔开约 6px；这里不再叠加间距，
 * 否则闪电会离标题太远，看起来像另一列的图标。
 */
const MARK_GAP = 0

/** 侧边栏树重建后的重定位间隔；容器失联时才真正重新查询选择器。 */
const RELOCATE_INTERVAL_MS = 1500

/** 构造标识节点：内联样式与图形，不依赖宿主的 Tailwind 是否收录本插件的任意值类。 */
function createMark(): HTMLSpanElement {
  const mark = document.createElement('span')
  mark.setAttribute(MARK_ATTRIBUTE, '')
  mark.setAttribute('aria-hidden', 'true')
  mark.style.cssText = [
    'display:inline-flex',
    'flex:0 0 auto',
    'align-items:center',
    'justify-content:center',
    `width:${MARK_WIDTH}px`,
    `height:${MARK_HEIGHT}px`,
    `margin-right:${MARK_GAP}px`,
    // 与标题文字基线对齐：标识比文字高，向下压一点点即可贴着文字中线
    'vertical-align:-4px',
  ].join(';')
  mark.innerHTML = `<svg viewBox="0 0 10 18" width="${MARK_WIDTH}" height="${MARK_HEIGHT}" fill="#f0a020">`
    + '<path d="M5.4 0 L1.6 10.6 H4 L2.8 18 L8.4 7.2 H5.6 Z"/></svg>'

  return mark
}

/**
 * 同步一行的标识：开启时插到标题前，关闭时移除。
 *
 * 标题是状态槽之后的那个元素，标识插在它与状态槽之间，因此仍在标题左侧、
 * 紧贴文字，而不是占用状态槽本身（状态点仍由宿主画在槽里）。
 * @param row 会话行根元素
 */
function decorateRow(row: Element): void {
  const sessionId = (row.getAttribute('data-row-key') ?? '').slice('session:'.length)
  if (sessionId === '') return

  const title = row.querySelector(TITLE_SELECTOR)
  if (!(title instanceof HTMLElement)) return

  const existing = row.querySelector(`[${MARK_ATTRIBUTE}]`)

  if (!isEnabled(sessionId)) {
    existing?.remove()

    return
  }

  if (existing instanceof HTMLElement) {
    // 宿主重排后标识可能离标题远了，挪回去；仍在原位则保持节点，避免每帧重建
    if (existing.nextElementSibling !== title) row.insertBefore(existing, title)

    return
  }

  row.insertBefore(createMark(), title)
}

/** 扫描当前可见的全部会话行。 */
function decorateAll(): void {
  for (const row of document.querySelectorAll(ROW_SELECTOR)) decorateRow(row)
}

/**
 * 安装标识装饰器。
 *
 * 宿主没有「标题前」的插槽，只能观察列表变动后补齐；变更合并到每帧一次扫描，
 * 流式输出期间也不会逐条重扫。
 * @returns 卸载时断开观察、移除已插入的标识
 */
export function startSessionMarkDecorator(): () => void {
  ensureEnabledSessionsLoaded()

  let frame = 0
  let disposed = false

  const schedule = (): void => {
    if (disposed || frame !== 0) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      decorateAll()
    })
  }

  // 状态集合变化（开关切换、首次读取完成）不触发 DOM 变更，需要自己重扫一次
  const unsubscribe = subscribe(schedule)

  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })

  // 侧边栏整棵树被重建时旧行已移除，主观察器仍能看到新节点；这里只兜底补扫一次
  const relocateTimer = window.setInterval(schedule, RELOCATE_INTERVAL_MS)

  schedule()

  return () => {
    disposed = true
    observer.disconnect()
    unsubscribe()
    window.clearInterval(relocateTimer)
    if (frame !== 0) window.cancelAnimationFrame(frame)

    // 插件卸载或设置页关掉入口时清掉残留标识，不给宿主留节点
    for (const mark of document.querySelectorAll(`[${MARK_ATTRIBUTE}]`)) mark.remove()
  }
}
