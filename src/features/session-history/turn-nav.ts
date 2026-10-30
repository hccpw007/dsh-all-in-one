/**
 * 轮次导航条的左侧化与轮次文本。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成 `nav[aria-label="轮次导航"]`，绝对定位在
 * 会话右侧。本模块只做两件事：
 *   - 给导航条打标记，用插件样式把横向定位从右侧改到左侧，DOM 与点击逻辑不动；
 *   - 第二个开关打开时，把每轮用户输入写进对应标记的属性，由 CSS 渲染在横杠下方，
 *     单行省略；当前轮用主色、其余用灰色。
 *
 * 文本走标记上的属性而不是另建节点：宿主的标记会随滚动改写位置，只有跟着标记
 * 自身的样式才能一直对齐；DOM 结构不变也不会与宿主的渲染树冲突。
 */
import { requestTurnInputs } from './api'
import type { TurnInput } from './types'

/** 宿主轮次导航条的选择器：`aria-label` 是稳定语义，优先于构建期哈希类名。 */
const NAV_SELECTOR = 'nav[aria-label="轮次导航"]'

/** 导航条被移动到左侧后打的标记属性，插件样式据此生效。 */
const NAV_ATTRIBUTE = 'data-aio-turn-nav'

/** 第二个开关打开时追加的标记；布局改写只在这个属性存在时生效。 */
const NAV_INPUTS_ATTRIBUTE = 'data-aio-turn-nav-inputs'

/** 标记上承载该轮用户输入的属性，供 CSS `attr()` 渲染。 */
const MARK_TEXT_ATTRIBUTE = 'data-aio-turn-text'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 导航条检测间隔；宿主重建会话视图时不发通知，只能轮询兜底。 */
const TICK_INTERVAL_MS = 1200

/**
 * 插件样式：把导航条挪到左侧；第二个开关打开时改成「横杠 + 下方文字」的列表。
 *
 * 宿主的悬停预览卡用 `right: calc(100% + 10px)` 贴在导航条左侧，导航条挪到左边后
 * 会跑到屏幕外；这里把它反转到右侧，保持与右侧模式一致的「预览在横杠内侧」。
 * 类名按 `_preview` / `_markActive` / `_marks` 子串匹配：宿主类名带构建期哈希，
 * 只有语义后缀是稳定的。
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
  display: block !important;
  width: 100% !important;
  height: 26px !important;
}
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [data-index]::before {
  top: 50% !important;
  right: auto !important;
  left: 0 !important;
  transform-origin: 0 center !important;
}
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [data-index]::after {
  content: attr(data-aio-turn-text);
  position: absolute;
  top: 5px;
  left: 26px;
  width: calc(100% - 26px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
}
[${NAV_ATTRIBUTE}][${NAV_INPUTS_ATTRIBUTE}] [data-index][class*="_markActive"]::after {
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
 * @returns 清理函数：撤销样式、标记属性与轮询
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
   * 把每轮输入写到对应标记上，供 CSS 渲染；值没变时不做写入。
   * @param nav 导航条
   */
  function applyInputs(nav: HTMLElement): void {
    if (inputs.length === 0) return

    const marks = Array.from(nav.querySelectorAll('[data-index]'))
    if (marks.length === 0) return

    if (!nav.hasAttribute(NAV_INPUTS_ATTRIBUTE)) nav.setAttribute(NAV_INPUTS_ATTRIBUTE, '')

    for (const [index, mark] of marks.entries()) {
      if (!(mark instanceof HTMLElement)) continue

      const text = inputs[index]?.text ?? ''
      if (mark.getAttribute(MARK_TEXT_ATTRIBUTE) === text) continue

      mark.setAttribute(MARK_TEXT_ATTRIBUTE, text)
    }
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
    } finally {
      loading = false
    }
  }

  /**
   * 一轮检测：补标记、拉文本、写属性。
   */
  function tick(): void {
    const nav = findNav()
    if (nav === undefined || !options.showInputs || loading) return

    if (inputs.length === 0) {
      void refreshInputs().then(() => {
        const current = findNav()
        if (current !== undefined) applyInputs(current)
      })
      return
    }

    applyInputs(nav)
  }

  tick()
  const timer = window.setInterval(tick, TICK_INTERVAL_MS)

  return () => {
    disposed = true
    window.clearInterval(timer)

    for (const mark of document.querySelectorAll(`[${MARK_TEXT_ATTRIBUTE}]`)) {
      mark.removeAttribute(MARK_TEXT_ATTRIBUTE)
    }

    for (const nav of document.querySelectorAll(`[${NAV_INPUTS_ATTRIBUTE}]`)) {
      nav.removeAttribute(NAV_INPUTS_ATTRIBUTE)
    }

    for (const nav of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      nav.removeAttribute(NAV_ATTRIBUTE)
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
