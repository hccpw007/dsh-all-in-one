/**
 * 轮次导航条的左侧化。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成会话右侧的一条 `nav`，绝对定位。本模块只做
 * 布局搬运：给导航条打标记，用插件样式把横向定位从右侧改到左侧，DOM 结构与点击
 * 跳转完全不动。
 */

/**
 * 找到宿主的轮次导航条。
 *
 * 不能用 `aria-label` 匹配：那是随界面语言变化的文案（宿主内置 8 种语言），
 * 非中文界面下会完全匹配不到，功能整体失效且不报错。改用结构特征——导航条里
 * 每个轮次标记都带 `data-index`，而界面中其它导航（侧边栏等）没有这个属性。
 * @returns 导航条元素；会话视图还没渲染或结构变化时返回 null
 */
function findNav(): HTMLElement | null {
  for (const nav of document.querySelectorAll('nav')) {
    if (!(nav instanceof HTMLElement)) continue
    if (nav.querySelector('[data-index]') === null) continue

    return nav
  }

  return null
}

/** 导航条被移动到左侧后打的标记属性，插件样式据此生效。 */
const NAV_ATTRIBUTE = 'data-aio-turn-nav'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 会话区左侧的宽度拖拽手柄：正文从这里开始，导航条贴在它左边。 */
const WIDTH_HANDLE_SELECTOR = '[data-width-handle="left"]'

/** 导航条与手柄之间留的空隙，避免贴死。 */
const NAV_EDGE_GAP = 10

/**
 * 插件样式：把导航条挪到左侧。
 *
 * 横向位置由脚本按左侧宽度手柄算出来（贴在手柄左边），不写死像素或百分比；
 * 侧边栏展开、窗口缩放、正文宽度调整都会让手柄移动，下次轮询时自动跟上。
 *
 * 宿主的悬停预览卡用 `right: calc(100% + 10px)` 贴在导航条左侧，导航条挪到左边后
 * 会跑到屏幕外；这里把它反转到右侧，保持与右侧模式一致的「预览在横杠内侧」。
 * 类名按 `_preview` 子串匹配：宿主的类名带构建期哈希，只有语义后缀是稳定的。
 *
 * 宿主在容器宽度不足 900px 时用 `@container` 把导航条整条隐藏；窗口变窄或侧边栏
 * 展开都会触发，所以这里用 `display: block` 把显示权要回来。
 *
 * 只用主题令牌着色，跟随宿主明暗主题；样式随插件生命周期注入与移除。
 */
const STYLE_TEXT = `
[${NAV_ATTRIBUTE}] {
  right: auto !important;
  display: block !important;
  overflow: visible !important;
}
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
  let nav: HTMLElement | null = null
  let slot: HTMLElement | null = null
  let handle: HTMLElement | null = null
  let frame = 0
  let resizeObserver: ResizeObserver | undefined
  /** 曾经成功认领导航条：用来区分「会话还没渲染」与「宿主结构变了」。 */
  let navSeen = false
  /** 是否已经提示过导航条消失，避免兜底轮询每 2 秒刷一条日志。 */
  let warnedMissingNav = false

  /**
   * 把导航条贴到左侧宽度手柄的左边。
   *
   * 手柄是正文区域的左边界，位置随窗口与侧边栏变化；直接用它的实时坐标换算成相对
   * 导航条定位容器的偏移，宽度、留白怎么变都能贴住。
   */
  const positionNav = (): void => {
    if (nav === null || slot === null || handle === null) return

    const left = Math.round(
      handle.getBoundingClientRect().left - slot.getBoundingClientRect().left - nav.offsetWidth - NAV_EDGE_GAP,
    )
    const target = `${Math.max(0, left)}px`

    // 值没变时不写样式：重复写会触发样式重算，下一次读取又强制布局，形成抖动
    if (nav.style.getPropertyValue('left') === target) return

    nav.style.setProperty('left', target, 'important')
  }

  /** 把同一帧内的多次尺寸变化合并成一次定位。 */
  const schedule = (): void => {
    if (disposed || frame !== 0) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      positionNav()
    })
  }

  /**
   * 重新认领导航条与定位参照物。
   *
   * 只在节点被宿主重建时重新查询；尺寸变化交给 ResizeObserver，不再按固定间隔
   * 做全文档查询与强制布局。
   */
  const track = (): void => {
    if (disposed) return

    const nextNav = findNav()

    // 认得过的导航条现在找不到了：多半是宿主改了结构，留一条日志便于排查
    if (nextNav === null && navSeen && !warnedMissingNav) {
      warnedMissingNav = true
      console.warn('[session-history] 轮次导航条已不可见，宿主结构可能发生变化')
    }
    if (nextNav !== null) navSeen = true

    const nextSlot = nextNav === null ? null : nextNav.parentElement
    const nextHandle = document.querySelector(WIDTH_HANDLE_SELECTOR)

    if (nextNav !== nav || nextSlot !== slot || nextHandle !== handle) {
      nav = nextNav
      slot = nextSlot
      handle = nextHandle instanceof HTMLElement ? nextHandle : null

      if (resizeObserver !== undefined) {
        resizeObserver.disconnect()
        if (slot !== null) resizeObserver.observe(slot)
        if (handle !== null && handle !== slot) resizeObserver.observe(handle)
      }
    }

    if (nav === null) return

    if (!nav.hasAttribute(NAV_ATTRIBUTE)) nav.setAttribute(NAV_ATTRIBUTE, '')
    positionNav()
  }

  if (typeof ResizeObserver === 'function') {
    // 侧边栏展开、窗口缩放、正文宽度调整都会改变容器尺寸；回调里只做一次定位
    resizeObserver = new ResizeObserver(schedule)
  }

  track()
  window.addEventListener('resize', schedule)

  // 宿主重建会话视图时不发通知：低频兜底重新认领导航条，正常路径由 ResizeObserver 驱动
  const timer = window.setInterval(track, 2000)

  return () => {
    disposed = true
    window.clearInterval(timer)
    window.removeEventListener('resize', schedule)
    resizeObserver?.disconnect()
    if (frame !== 0) window.cancelAnimationFrame(frame)

    for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_ATTRIBUTE)
      // 只撤掉插件写的 left，宿主自己的 top 等内联样式要保持原样
      if (element instanceof HTMLElement) element.style.removeProperty('left')
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
