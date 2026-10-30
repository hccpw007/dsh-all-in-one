/**
 * 轮次导航条的左侧化与轮次文本层。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成 `nav[aria-label="轮次导航"]`，绝对定位在
 * 会话右侧。本模块只做两件事：
 *   - 给导航条打标记，用插件样式把横向定位从右侧改到左侧，DOM 与点击逻辑不动；
 *   - 开关打开时，在导航条旁叠加一列文本，内容是该轮用户输入，单行省略。
 *
 * 文本层是插件自己的节点，挂在导航条内部、绝对定位；导航条随会话滚动更新标记
 * 位置时按属性变化重排，因此文本始终与对应标记对齐。
 */
import { requestTurnInputs } from './api'
import type { TurnInput } from './types'

/** 宿主轮次导航条的选择器：`aria-label` 是稳定语义，优先于构建期哈希类名。 */
const NAV_SELECTOR = 'nav[aria-label="轮次导航"]'

/** 导航条被移动到左侧后打的标记属性，插件样式据此生效。 */
const NAV_ATTRIBUTE = 'data-aio-turn-nav'

/** 文本层容器的标记属性；重排与跳过自身变更都靠它识别。 */
const INPUTS_ATTRIBUTE = 'data-aio-turn-inputs'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 导航条检测间隔；宿主重建会话视图时不发通知，只能轮询兜底。 */
const TICK_INTERVAL_MS = 1200

/** 文本层单行宽度上限，超出部分用省略号。 */
const INPUT_LINE_WIDTH = '200px'

/** 文本行高，用于让每行与对应标记垂直居中。 */
const INPUT_LINE_HEIGHT = 14

/**
 * 插件样式：把导航条挪到左侧，并排布文本列。
 *
 * 宿主的悬停预览卡用 `right: calc(100% + 10px)` 贴在导航条左侧，导航条挪到左边后
 * 会跑到屏幕外；这里把它反转到右侧，保持与右侧模式一致的「预览在横杠内侧」。
 * 类名按 `_preview` 子串匹配：宿主的类名带构建期哈希，只有语义后缀是稳定的。
 *
 * 只用主题令牌着色，跟随宿主明暗主题；样式随插件生命周期注入与移除。
 */
const STYLE_TEXT = `
[${NAV_ATTRIBUTE}] { right: auto !important; left: 12px !important; overflow: visible !important; }
[${NAV_ATTRIBUTE}] [class*="_preview"] {
  right: auto !important;
  left: calc(100% + 10px) !important;
}
[${INPUTS_ATTRIBUTE}] {
  position: absolute;
  top: 0;
  left: 30px;
  width: ${INPUT_LINE_WIDTH};
  pointer-events: none;
}
[${INPUTS_ATTRIBUTE}] > span {
  position: absolute;
  left: 0;
  max-width: ${INPUT_LINE_WIDTH};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-secondary);
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
 * 安装轮次导航的左侧化与文本层。
 * @param options 安装选项
 * @returns 清理函数：撤销样式、标记、文本层与监听
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
  /** 已按多少条标记排版过，标记数量变化时重排。 */
  let appliedMarkCount = 0
  /** 重排合并到每一帧，滚动时不会反复触发。 */
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
   * 按各标记的当前位置重排文本行。
   * @param nav 导航条
   */
  function repositionLines(nav: HTMLElement): void {
    const layer = nav.querySelector(`[${INPUTS_ATTRIBUTE}]`)
    if (!(layer instanceof HTMLElement)) return

    const navTop = nav.getBoundingClientRect().top
    const lines = Array.from(layer.children)
    const marks = Array.from(nav.querySelectorAll('[data-index]'))

    for (const [index, line] of lines.entries()) {
      const mark = marks[index]
      if (!(line instanceof HTMLElement) || !(mark instanceof HTMLElement)) continue

      const markRect = mark.getBoundingClientRect()
      // 标记只有 10px 高，文本行按中心对齐才不会看起来偏上
      const center = markRect.top - navTop + markRect.height / 2 - INPUT_LINE_HEIGHT / 2
      line.style.top = `${center}px`
    }
  }

  /**
   * 用已取到的轮次文本重建文本层。
   * @param nav 导航条
   */
  function renderLines(nav: HTMLElement): void {
    const marks = Array.from(nav.querySelectorAll('[data-index]'))
    if (marks.length === 0 || inputs.length === 0) return

    let layer = nav.querySelector(`[${INPUTS_ATTRIBUTE}]`)
    if (!(layer instanceof HTMLElement)) {
      layer = document.createElement('div')
      layer.setAttribute(INPUTS_ATTRIBUTE, '')
      nav.appendChild(layer)
    }

    layer.textContent = ''

    for (const [index, input] of inputs.entries()) {
      if (index >= marks.length) break

      const line = document.createElement('span')
      line.textContent = input.text
      layer.appendChild(line)
    }

    appliedMarkCount = marks.length
    repositionLines(nav)
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

    try {
      const next = await requestTurnInputs(sessionId)

      // 请求期间可能又切换了会话，过期结果直接丢弃
      if (disposed || options.resolveSessionId() !== sessionId) return

      loadedSessionId = sessionId
      inputs = next
      appliedMarkCount = 0
    } finally {
      loading = false
    }
  }

  /**
   * 每帧最多重排一次，避免滚动时反复布局。
   * @param nav 导航条
   */
  function scheduleReposition(nav: HTMLElement): void {
    if (disposed || frame !== 0) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      repositionLines(nav)
    })
  }

  /**
   * 跟踪标记位置：宿主滚动时会改写标记的 transform，靠属性变化实时重排。
   */
  const positionObserver = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target

      // 跳过自己写入的文本行，否则会与重排形成循环
      if (target instanceof Element && target.closest(`[${INPUTS_ATTRIBUTE}]`) !== null) continue

      const nav = findNav()
      if (nav !== undefined) scheduleReposition(nav)
      return
    }
  })

  /** 当前被观察的导航条；宿主重建会话视图后需要重新绑定。 */
  let observedNav: HTMLElement | undefined

  /**
   * 把位置监听绑定到当前导航条。
   * @param nav 导航条
   */
  function ensurePositionObserver(nav: HTMLElement): void {
    if (observedNav === nav) return

    positionObserver.disconnect()
    positionObserver.observe(nav, { attributes: true, subtree: true, attributeFilter: ['style'] })
    observedNav = nav
  }

  /**
   * 一轮检测：补标记、拉文本、必要时重画。
   */
  function tick(): void {
    const nav = findNav()
    if (nav === undefined || !options.showInputs) return

    ensurePositionObserver(nav)

    if (loading) return

    if (inputs.length === 0) {
      void refreshInputs().then(() => {
        const current = findNav()
        if (current !== undefined) renderLines(current)
      })
      return
    }

    const markCount = nav.querySelectorAll('[data-index]').length
    const hasLayer = nav.querySelector(`[${INPUTS_ATTRIBUTE}]`) !== null

    if (!hasLayer || markCount !== appliedMarkCount) renderLines(nav)
    else scheduleReposition(nav)
  }

  tick()
  const timer = window.setInterval(tick, TICK_INTERVAL_MS)

  return () => {
    disposed = true
    window.clearInterval(timer)
    if (frame !== 0) window.cancelAnimationFrame(frame)
    positionObserver.disconnect()

    for (const element of document.querySelectorAll(`[${INPUTS_ATTRIBUTE}]`)) element.remove()
    for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_ATTRIBUTE)
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
