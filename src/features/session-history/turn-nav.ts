/**
 * 轮次导航条的左侧化。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成 `nav[aria-label="轮次导航"]`，绝对定位在
 * 会话右侧。本模块只做布局搬运：给导航条打标记，用插件样式把横向定位从右侧改到
 * 左侧，DOM 结构与点击跳转完全不动。
 */
/** 宿主轮次导航条的选择器：`aria-label` 是稳定语义，优先于构建期哈希类名。 */
const NAV_SELECTOR = 'nav[aria-label="轮次导航"]'

/** 导航条被移动到左侧后打的标记属性，插件样式据此生效。 */
const NAV_ATTRIBUTE = 'data-aio-turn-nav'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 导航条检测间隔；宿主重建会话视图时不发通知，只能轮询兜底。 */
const TICK_INTERVAL_MS = 1200

/**
 * 插件样式：把导航条挪到左侧。
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
`

/**
 * 安装轮次导航的左侧化。
 * @returns 清理函数：撤销样式与标记
 */
export function installTurnNav(): () => void {
  if (document.getElementById(STYLE_ID) === null) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = STYLE_TEXT
    document.head.appendChild(style)
  }

  let disposed = false

  /**
   * 补上导航条标记；宿主重建会话视图后会生成新的导航条。
   */
  function tick(): void {
    if (disposed) return

    const nav = document.querySelector(NAV_SELECTOR)
    if (nav instanceof HTMLElement && !nav.hasAttribute(NAV_ATTRIBUTE)) {
      nav.setAttribute(NAV_ATTRIBUTE, '')
    }
  }

  tick()
  const timer = window.setInterval(tick, TICK_INTERVAL_MS)

  return () => {
    disposed = true
    window.clearInterval(timer)

    for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_ATTRIBUTE)
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
