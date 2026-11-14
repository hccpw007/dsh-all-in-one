/**
 * 清空按钮的悬停提示。
 *
 * 按钮是注入到宿主 DOM 里原生元素，拿不到宿主的 React `Tooltip`，用原生 `title`
 * 又是浏览器默认的浅色气泡，和输入框里其它按钮的黑底提示并排看很突兀。
 * 这里按宿主提示的视觉与时机（悬停 500ms、黑底圆角、贴顶居中）自己实现一份。
 */
/** 提示气泡的类名，样式与节点都用它定位。 */
const TOOLTIP_CLASS = 'aio-clear-session-tooltip'

/** 提示样式节点 id；与按钮样式分开管理，重复安装时复用。 */
const STYLE_ID = 'aio-clear-session-tooltip-style'

/** 悬停多久后显示，与宿主输入框按钮的 500ms 一致。 */
const SHOW_DELAY_MS = 500

/** 提示与按钮之间的间距。 */
const GAP_PX = 8

/** 提示贴到视口边缘时保留的空白。 */
const EDGE_PX = 12

/**
 * 提示样式：数值与宿主 `Tooltip` 的气泡一致（13px 字、3px 7px 内边距、
 * 圆角与配色取自宿主变量），只是选择器换成插件自己的类名。
 */
const STYLE_TEXT = `
.${TOOLTIP_CLASS} {
  display: none;
  position: fixed;
  z-index: 1100;
  width: max-content;
  max-width: min(50vw, calc(100vw - 24px));
  box-sizing: border-box;
  padding: 3px 7px;
  border-radius: var(--dsw-radius-sm, 6px);
  background: var(--dsw-alias-tooltip-bg, #1f2329);
  color: var(--dsw-alias-tooltip-label, #ffffff);
  font-size: 13px;
  line-height: 20px;
  white-space: pre-line;
  overflow-wrap: break-word;
  pointer-events: none;
  animation: aio-clear-session-tooltip-in 150ms ease;
}
@keyframes aio-clear-session-tooltip-in {
  from { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .${TOOLTIP_CLASS} { animation: none; }
}
`

/** 全局共用的气泡节点：同一时刻只会显示一个提示。 */
let bubble: HTMLSpanElement | null = null

/** 注入提示样式；重复安装时复用同一节点。 */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_TEXT
  document.head.appendChild(style)
}

/**
 * 取得气泡节点，没有就建一个挂在 body 上。
 *
 * 必须挂在 body：输入框容器带裁剪与自己的层叠上下文，气泡留在里面会被切掉。
 * @returns 气泡节点
 */
function ensureBubble(): HTMLSpanElement {
  if (bubble !== null && bubble.isConnected) return bubble

  const created = document.createElement('span')
  created.className = TOOLTIP_CLASS
  created.setAttribute('role', 'tooltip')
  document.body.appendChild(created)
  bubble = created

  return created
}

/**
 * 把气泡摆到按钮正上方，上方放不下时翻到下方。
 * @param element 气泡节点
 * @param anchor 按钮
 */
function place(element: HTMLSpanElement, anchor: HTMLElement): void {
  const rect = anchor.getBoundingClientRect()
  const width = element.offsetWidth
  const half = width / 2

  // 贴近视口左右边缘时把气泡拉回可见范围，避免被裁掉
  const center = Math.min(
    Math.max(rect.left + rect.width / 2, EDGE_PX + half),
    window.innerWidth - EDGE_PX - half,
  )

  // 上方空间不足（例如输入框贴着窗口顶部）时翻到按钮下方
  const above = rect.top - GAP_PX >= element.offsetHeight

  element.style.left = `${center}px`
  element.style.top = `${above ? rect.top - GAP_PX : rect.bottom + GAP_PX}px`
  element.style.transform = above ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
}

/**
 * 给按钮装上悬停提示。
 *
 * 无障碍标签同时写入 `aria-label`，因此不再使用原生 `title`，否则系统提示
 * 会和这份气泡叠在一起出现两次。
 * @param anchor 触发的按钮
 * @param readLabel 读取提示文案；显示时才求值，文案随状态变化时也拿得到最新值
 * @returns 卸载函数：解绑事件并收起气泡
 */
export function attachTooltip(anchor: HTMLElement, readLabel: () => string): () => void {
  ensureStyle()

  let timer: number | null = null

  const hide = (): void => {
    // 悬停计时器还在等时离开，必须一并取消，否则离开后才冒出气泡
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }

    if (bubble !== null) bubble.style.display = 'none'
  }

  const reveal = (): void => {
    timer = null
    const label = readLabel()
    // 没有文案时不出空气泡
    if (label.length === 0) return

    const element = ensureBubble()
    element.textContent = label
    // 先显示再量尺寸：display:none 的元素量不出宽高
    element.style.display = 'block'
    place(element, anchor)
  }

  const schedule = (): void => {
    hide()
    timer = window.setTimeout(reveal, SHOW_DELAY_MS)
  }

  anchor.addEventListener('pointerenter', schedule)
  anchor.addEventListener('pointerleave', hide)
  anchor.addEventListener('focus', schedule)
  anchor.addEventListener('blur', hide)
  // 点击后立即收起：按钮会打开弹窗，提示留着会盖在弹窗上
  anchor.addEventListener('pointerdown', hide)

  return () => {
    hide()
    anchor.removeEventListener('pointerenter', schedule)
    anchor.removeEventListener('pointerleave', hide)
    anchor.removeEventListener('focus', schedule)
    anchor.removeEventListener('blur', hide)
    anchor.removeEventListener('pointerdown', hide)

    // 回收气泡，避免功能卸载后 body 上还留一个空节点
    if (bubble !== null) {
      bubble.remove()
      bubble = null
    }
  }
}
