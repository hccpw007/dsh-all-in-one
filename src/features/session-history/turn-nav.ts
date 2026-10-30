/**
 * 轮次导航条的左侧化与轮次文本。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成 `nav[aria-label="轮次导航"]`，绝对定位在
 * 会话右侧。本模块做三件事：
 *   - 给导航条打标记，把横向定位从右侧改到左侧，DOM 与点击逻辑不动；
 *   - 第二个开关打开时，把标记重排成有间距的行，并按可用高度均分行高；
 *   - 在每行横杠右侧叠一列文本（该轮用户输入，单行省略）。
 *
 * 文本必须放在插件自己的节点里：宿主滚动时会重建标记元素，写在元素上的属性会随
 * 旧元素丢失；浮层按标记的实时位置对齐，重建后重新对齐即可，不会闪。
 */
import { requestTurnInputs } from './api'
import type { TurnInput } from './types'

/** 宿主轮次导航条的选择器：`aria-label` 是稳定语义，优先于构建期哈希类名。 */
const NAV_SELECTOR = 'nav[aria-label="轮次导航"]'

/** 导航条被移动到左侧后打的标记属性，插件样式据此生效。 */
const NAV_ATTRIBUTE = 'data-aio-turn-nav'

/** 第二个开关打开时追加的标记；行距与文本层只在这个属性存在时生效。 */
const NAV_INPUTS_ATTRIBUTE = 'data-aio-turn-nav-inputs'

/** 文本层容器的标记属性；重排与跳过自身变更都靠它识别。 */
const INPUTS_ATTRIBUTE = 'data-aio-turn-inputs'

/** 行高变量名：由脚本按可用高度与轮次数量算出后写到导航条上。 */
const ROW_HEIGHT_VARIABLE = '--aio-turn-row'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 导航条检测间隔；宿主重建会话视图时不发通知，只能轮询兜底。 */
const TICK_INTERVAL_MS = 1200

/** 单行文本宽度；横杠占 26px，其余留给文字。 */
const INPUT_LINE_WIDTH = 174

/** 行高的上下限：太矮读不清，太高会让轮次早早超出面板。 */
const ROW_HEIGHT_MIN = 16
const ROW_HEIGHT_MAX = 30

/** 导航条可用的行高上限（宿主把面板限制在 420px）。 */
const NAV_FALLBACK_HEIGHT = 420

/**
 * 插件样式：把导航条挪到左侧，并在横杠右侧排布文本列。
 *
 * 宿主的悬停预览卡用 `right: calc(100% + 10px)` 贴在导航条左侧，导航条挪到左边后
 * 会跑到屏幕外；这里把它反转到右侧，保持与右侧模式一致的「预览在横杠内侧」。
 * 类名按 `_preview` / `_marks` 子串匹配：宿主类名带构建期哈希，只有语义后缀稳定。
 *
 * 只用主题令牌着色，跟随宿主明暗主题；样式随插件生命周期注入与移除。
 */
const STYLE_TEXT = `
[${NAV_ATTRIBUTE}] { right: auto !important; left: 12px !important; overflow: visible !important; }
[${NAV_ATTRIBUTE}] [class*="_preview"] {
  right: auto !important;
  left: calc(100% + 10px) !important;
}
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] { width: 200px !important; }
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [class*="_marks"] { height: auto !important; }
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [data-index] {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  transform: none !important;
  display: block !important;
  width: 100% !important;
  height: var(${ROW_HEIGHT_VARIABLE}, 22px) !important;
}
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [data-index]::before {
  top: 50% !important;
  right: auto !important;
  left: 0 !important;
  transform-origin: 0 center !important;
}
[${INPUTS_ATTRIBUTE}] {
  position: absolute;
  top: 0;
  left: 26px;
  width: ${INPUT_LINE_WIDTH}px;
  pointer-events: none;
}
[${INPUTS_ATTRIBUTE}] > span {
  position: absolute;
  left: 0;
  width: ${INPUT_LINE_WIDTH}px;
  height: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-tertiary);
}
[${INPUTS_ATTRIBUTE}] > span[data-aio-turn-active="true"] {
  color: var(--dsw-alias-label-primary);
}
`

/** 轮次导航的安装选项。 */
export interface TurnNavOptions {
  /** 是否在每轮旁显示用户输入。 */
  showInputs: boolean
  /** 取当前会话 id；宿主服务未就绪时返回 undefined。 */
  resolveSessionId: () => string | undefined
}

/**
 * 安装轮次导航的左侧化与轮次文本。
 * @param options 安装选项
 * @returns 清理函数：撤销样式、标记与文本层
 */
export function installTurnNav(options: TurnNavOptions): () => void {
  if (document.getElementById(STYLE_ID) === null) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = STYLE_TEXT
    document.head.appendChild(style)
  }

  /** 已取到文本的会话 id；切换会话时据此重新拉取。 */
  let loadedSessionId: string | undefined
  /** 当前会话的每轮输入，按轮次升序。 */
  let inputs: TurnInput[] = []
  /** 文本拉取进行中，避免轮询重复发起请求。 */
  let loading = false
  /** 已排版的标记数量，数量变化时重建文本行。 */
  let renderedMarkCount = 0
  /** 重排合并到每一帧，滚动时不会反复触发布局。 */
  let frame = 0
  let disposed = false

  /**
   * 找到导航条并补上标记。
   * @returns 导航条；会话视图尚未渲染时返回 undefined
   */
  function findNav(): HTMLElement | undefined {
    const nav = document.querySelector(NAV_SELECTOR)
    if (!(nav instanceof HTMLElement)) return undefined

    if (!nav.hasAttribute(NAV_ATTRIBUTE)) nav.setAttribute(NAV_ATTRIBUTE, '')
    return nav
  }

  /**
   * 判断标记是否是当前轮；宿主类名带哈希，只能按语义后缀匹配。
   * @param mark 轮次标记
   * @returns 当前轮返回 true
   */
  function isActiveMark(mark: Element): boolean {
    return (mark.getAttribute('class') ?? '').includes('_markActive')
  }

  /**
   * 按可用高度与轮次数量算出每行高度，让所有轮次尽量一屏放下。
   * @param nav 导航条
   * @param markCount 轮次数量
   * @returns 行高像素值
   */
  function resolveRowHeight(nav: HTMLElement, markCount: number): number {
    const maxHeight = Number.parseFloat(getComputedStyle(nav).maxHeight) || NAV_FALLBACK_HEIGHT
    const raw = Math.floor(maxHeight / Math.max(markCount, 1))

    return Math.min(ROW_HEIGHT_MAX, Math.max(ROW_HEIGHT_MIN, raw))
  }

  /**
   * 取得或创建文本层。
   * @param nav 导航条
   * @returns 文本层容器
   */
  function ensureLayer(nav: HTMLElement): HTMLElement {
    const existing = nav.querySelector(`[${INPUTS_ATTRIBUTE}]`)
    if (existing instanceof HTMLElement) return existing

    const layer = document.createElement('div')
    layer.setAttribute(INPUTS_ATTRIBUTE, '')
    nav.appendChild(layer)
    return layer
  }

  /**
   * 按标记的实时位置重排文本行，并更新当前轮配色。
   * @param nav 导航条
   */
  function syncLines(nav: HTMLElement): void {
    if (inputs.length === 0) return

    const marks = Array.from(nav.querySelectorAll('[data-index]'))
    if (marks.length === 0) return

    if (!nav.hasAttribute(NAV_INPUTS_ATTRIBUTE)) nav.setAttribute(NAV_INPUTS_ATTRIBUTE, '')

    const rowHeight = resolveRowHeight(nav, marks.length)
    nav.style.setProperty(ROW_HEIGHT_VARIABLE, `${rowHeight}px`)

    const layer = ensureLayer(nav)

    // 标记数量变化（切换会话、新增轮次）时重建行，否则只调整位置与配色
    if (marks.length !== renderedMarkCount) {
      layer.textContent = ''

      for (const [index] of marks.entries()) {
        const line = document.createElement('span')
        line.textContent = inputs[index]?.text ?? ''
        layer.appendChild(line)
      }

      renderedMarkCount = marks.length
    }

    const layerTop = layer.getBoundingClientRect().top
    const lines = Array.from(layer.children)

    for (const [index, mark] of marks.entries()) {
      const line = lines[index]
      if (!(line instanceof HTMLElement) || !(mark instanceof HTMLElement)) continue

      const markRect = mark.getBoundingClientRect()
      const center = markRect.top - layerTop + markRect.height / 2 - 7
      line.style.top = `${center}px`
      line.setAttribute('data-aio-turn-active', isActiveMark(mark) ? 'true' : 'false')
    }
  }

  /**
   * 每帧最多重排一次，避免滚动时反复布局。
   * @param nav 导航条
   */
  function scheduleSync(nav: HTMLElement): void {
    if (disposed || frame !== 0) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      syncLines(nav)
    })
  }

  /**
   * 拉取当前会话的轮次文本；同一会话只请求一次。
   */
  async function refreshInputs(): Promise<void> {
    if (loading) return

    const sessionId = options.resolveSessionId()
    if (sessionId === undefined || sessionId === loadedSessionId) return

    loading = true
    inputs = []
    renderedMarkCount = 0

    try {
      const next = await requestTurnInputs(sessionId)

      // 请求期间可能又切换了会话，过期结果直接丢弃
      if (disposed || options.resolveSessionId() !== sessionId) return

      loadedSessionId = sessionId
      inputs = next
    } finally {
      loading = false
    }
  }

  /**
   * 跟踪标记变化：宿主滚动或重建标记时立即重排。
   */
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target

      // 跳过自己写入的文本行，否则会与重排形成循环
      if (target instanceof Element && target.closest(`[${INPUTS_ATTRIBUTE}]`) !== null) continue

      const nav = findNav()
      if (nav !== undefined) scheduleSync(nav)
      return
    }
  })

  /** 当前被观察的导航条；宿主重建会话视图后需要重新绑定。 */
  let observedNav: HTMLElement | undefined

  /**
   * 把监听绑定到当前导航条。
   * @param nav 导航条
   */
  function ensureObserver(nav: HTMLElement): void {
    if (observedNav === nav && !disposed) return

    observer.disconnect()
    observer.observe(nav, { attributes: true, childList: true, subtree: true })
    observedNav = nav
  }

  /**
   * 一轮检测：补标记、拉文本、必要时排版。
   */
  function tick(): void {
    const nav = findNav()
    if (nav === undefined || !options.showInputs || loading) return

    ensureObserver(nav)

    if (inputs.length === 0) {
      void refreshInputs().then(() => {
        const current = findNav()
        if (current !== undefined) syncLines(current)
      })
      return
    }

    syncLines(nav)
  }

  tick()
  const timer = window.setInterval(tick, TICK_INTERVAL_MS)

  return () => {
    disposed = true
    window.clearInterval(timer)
    if (frame !== 0) window.cancelAnimationFrame(frame)
    observer.disconnect()

    for (const element of document.querySelectorAll(`[${INPUTS_ATTRIBUTE}]`)) element.remove()

    for (const element of document.querySelectorAll(`[${NAV_INPUTS_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_INPUTS_ATTRIBUTE)
      element.removeAttribute(ROW_HEIGHT_VARIABLE)
    }

    for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_ATTRIBUTE)
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
