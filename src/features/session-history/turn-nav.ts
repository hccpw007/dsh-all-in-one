/**
 * 轮次导航条的左侧化。
 *
 * 宿主把「跳转到第 N 轮」的标记渲染成会话右侧的一条 `nav`，绝对定位。本模块只做
 * 布局搬运：给导航条打标记，用插件样式把横向定位从右侧改到左侧，DOM 结构与点击
 * 跳转完全不动。
 *
 * 会话只有一轮时宿主不渲染导航条（`TurnNavigator` 在条目不足两条时直接返回 null），
 * 插件在同样的位置补一条外观相同的横杠：「回到顶部」。第二轮出现后宿主接管，自建条
 * 随即撤掉，两者的点击与定位规则保持一致。
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

/** 自建单轮导航条的标记属性：只在宿主没有渲染导航条时出现。 */
const SINGLE_NAV_ATTRIBUTE = 'data-aio-turn-nav-single'

/**
 * 数出会话里已经渲染出来的轮次数。
 *
 * `data-chat-turn` 标在每一轮的每个节点上，同一轮会出现多次，按值去重才是轮数。
 * 宿主只在两轮及以上渲染导航条，所以「已渲染两轮却没有导航条」说明结构变了。
 * @returns 已渲染的轮次数量；会话视图还没渲染时返回 0
 */
function countTurns(): number {
  const turns = new Set<string>()

  for (const row of document.querySelectorAll('[data-chat-turn]')) {
    const turn = row.getAttribute('data-chat-turn')
    if (turn !== null) turns.add(turn)
  }

  return turns.size
}

/**
 * 找到会话正文的父容器（宿主 ChatView 的 frame），自建导航条插在它的第一个子节点位置。
 *
 * frame 是宿主导航条的定位容器，结构为 `[data-chat-flow]` 列 → 滚动列表 → 根容器 → frame。
 * 宿主改版导致层级变化时返回 null：自建条不出现，宿主本身不受影响。
 * @returns frame 元素；会话视图还没渲染时返回 null
 */
function findChatFrame(): HTMLElement | null {
  const column = document.querySelector('[data-chat-flow]')
  if (!(column instanceof HTMLElement)) return null

  const frame = column.parentElement?.parentElement?.parentElement

  return frame instanceof HTMLElement ? frame : null
}

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-session-history'

/** 会话区左侧的宽度拖拽手柄：正文从这里开始，导航条贴在它左边。 */
const WIDTH_HANDLE_SELECTOR = '[data-width-handle="left"]'

/** 导航条与手柄之间留的空隙，避免贴死。 */
const NAV_EDGE_GAP = 10

/**
 * 自建横杠的无障碍文案。
 *
 * 宿主内置 8 种语言，插件只维护中英文，其余语言回退英文，避免出现半截翻译。
 * @returns 导航条与按钮的文案
 */
function singleNavLabels(): { nav: string; button: string } {
  return document.documentElement.lang.toLowerCase().startsWith('zh')
    ? { nav: '轮次导航', button: '回到顶部' }
    : { nav: 'Turn navigation', button: 'Back to top' }
}

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
 *
 * 自建横杠（单轮时）复刻宿主的几何：同样贴在 frame 顶部、同样以正文可视带的中线
 * 定位、同样靠右 12px；`nav` 也带左置标记，横向位置由同一段脚本换算。
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
[${SINGLE_NAV_ATTRIBUTE}] {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 7;
  height: 0;
  pointer-events: none;
}
[data-conversation-scroll] [${SINGLE_NAV_ATTRIBUTE}] {
  position: sticky;
}
[${SINGLE_NAV_ATTRIBUTE}] > nav {
  --aio-turn-band: calc(var(--dsh-conversation-viewport-height, 100dvh) - var(--dsh-composer-height, 152px));
  position: absolute;
  top: calc(var(--aio-turn-band) / 2);
  right: 12px;
  width: 28px;
  height: 10px;
  pointer-events: auto;
  transform: translateY(-50%);
}
[${SINGLE_NAV_ATTRIBUTE}] button {
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}
[${SINGLE_NAV_ATTRIBUTE}] button::before {
  position: absolute;
  top: 50%;
  right: 0;
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--dsw-alias-label-primary);
  content: '';
  transform: translateY(-50%);
}
[${SINGLE_NAV_ATTRIBUTE}] button:focus-visible {
  outline: 1px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: -1px;
}
[${SINGLE_NAV_ATTRIBUTE}] button::after {
  position: absolute;
  top: 50%;
  left: calc(100% + 10px);
  padding: 4px 8px;
  border-radius: var(--dsw-radius-md, 8px);
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: var(--dsw-elevation-panel);
  font: var(--dsw-font-xxs-12, 12px/1.4 sans-serif);
  white-space: nowrap;
  content: attr(data-aio-tip);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity 120ms ease;
}
[${SINGLE_NAV_ATTRIBUTE}] button:hover::after,
[${SINGLE_NAV_ATTRIBUTE}] button:focus-visible::after {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  [${SINGLE_NAV_ATTRIBUTE}] button::after {
    transition: none;
  }
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
  /** 自建单轮导航条的定位容器与导航条本体。 */
  let singleSlot: HTMLElement | null = null
  let singleNav: HTMLElement | null = null
  let frame = 0
  let resizeObserver: ResizeObserver | undefined
  /** 是否已经提示过导航条消失，避免兜底轮询每 2 秒刷一条日志。 */
  let warnedMissingNav = false

  /**
   * 把一条导航条贴到左侧宽度手柄的左边。
   *
   * 手柄是正文区域的左边界，位置随窗口与侧边栏变化；直接用它的实时坐标换算成相对
   * 导航条的定位容器的偏移，宽度、留白怎么变都能贴住。
   * @param target 导航条元素
   * @param container 导航条的定位容器
   * @param anchor 左侧宽度手柄
   */
  const placeLeft = (target: HTMLElement, container: HTMLElement, anchor: HTMLElement): void => {
    const left = Math.round(
      anchor.getBoundingClientRect().left - container.getBoundingClientRect().left - target.offsetWidth - NAV_EDGE_GAP,
    )
    const next = `${Math.max(0, left)}px`

    // 值没变时不写样式：重复写会触发样式重算，下一次读取又强制布局，形成抖动
    if (target.style.getPropertyValue('left') === next) return

    target.style.setProperty('left', next, 'important')
  }

  /** 宿主导航条与自建条共用同一套左侧定位。 */
  const positionNav = (): void => {
    if (handle === null) return
    if (nav !== null && slot !== null) placeLeft(nav, slot, handle)
    if (singleNav !== null && singleSlot !== null) placeLeft(singleNav, singleSlot, handle)
  }

  /**
   * 点击自建横杠回到会话顶部。
   *
   * 宿主有两种布局：有外层滚动容器时由它滚，没有时正文列表自己就是滚动容器。
   */
  const scrollToTop = (): void => {
    const column = document.querySelector('[data-chat-flow]')
    const list = column?.parentElement ?? null
    const scroller = list?.closest('[data-conversation-scroll]') ?? list

    if (!(scroller instanceof HTMLElement)) {
      console.warn('[session-history] 找不到会话滚动容器，无法回到顶部')
      return
    }

    const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  /**
   * 在会话 frame 顶部挂一条自建导航条。
   * @param target 会话 frame，宿主导航条同样以它为定位容器
   */
  const mountSingleNav = (target: HTMLElement): void => {
    const labels = singleNavLabels()
    const container = document.createElement('div')
    container.setAttribute(SINGLE_NAV_ATTRIBUTE, '')

    const element = document.createElement('nav')
    // 打上宿主导航条的同一标记：插件样式与左侧定位对两者一视同仁
    element.setAttribute(NAV_ATTRIBUTE, '')
    element.setAttribute('aria-label', labels.nav)

    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-label', labels.button)
    // 悬停提示由样式表的伪元素渲染，文案走同一个属性，不必额外建节点
    button.setAttribute('data-aio-tip', labels.button)
    button.addEventListener('click', scrollToTop)

    element.append(button)
    container.append(element)
    target.prepend(container)

    singleSlot = container
    singleNav = element
  }

  /** 撤掉自建导航条：宿主渲染出真正的导航条，或会话视图重建时调用。 */
  const unmountSingleNav = (): void => {
    singleSlot?.remove()
    singleSlot = null
    singleNav = null
  }

  /**
   * 让自建导航条跟随会话状态。
   *
   * 宿主导航条存在时一切交给宿主；不存在时，只有会话里已经有轮次内容才补自建条
   * （空白新会话没有可回的顶部，不显示）。
   */
  const syncSingleNav = (): void => {
    // 宿主渲染了导航条：交还给它，自建条立即撤掉
    if (nav !== null) {
      unmountSingleNav()
      return
    }

    const turns = countTurns()
    // 已渲染两轮却没有导航条：宿主结构多半变了，留一条日志便于排查
    if (turns >= 2 && !warnedMissingNav) {
      warnedMissingNav = true
      console.warn('[session-history] 轮次导航条已不可见，宿主结构可能发生变化')
    }

    const target = turns > 0 ? findChatFrame() : null
    if (target === null) {
      unmountSingleNav()
      return
    }

    // 切换会话时宿主会重建 frame：旧自建条随节点一起卸载，这里在新 frame 上重挂
    if (singleSlot !== null && singleSlot.parentElement === target) return

    unmountSingleNav()
    mountSingleNav(target)
  }

  /**
   * 重新认领导航条、定位参照物与自建条。
   *
   * 只在节点被宿主重建时重新查询；尺寸变化交给 ResizeObserver，不再按固定间隔
   * 做全文档查询与强制布局。
   */
  const track = (): void => {
    if (disposed) return

    const nextNav = findNav()
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

    if (nav !== null && !nav.hasAttribute(NAV_ATTRIBUTE)) nav.setAttribute(NAV_ATTRIBUTE, '')
    syncSingleNav()
    positionNav()
  }

  /** 把同一帧内的多次变化合并成一次重新认领与定位。 */
  const schedule = (): void => {
    if (disposed || frame !== 0) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      track()
    })
  }

  if (typeof ResizeObserver === 'function') {
    // 侧边栏展开、窗口缩放、正文宽度调整都会改变容器尺寸；回调里只做一次重新认领
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

    unmountSingleNav()

    // 撤掉所有标记（含宿主与自建条）：先移除节点，再清残留属性
    for (const element of document.querySelectorAll(`[${NAV_ATTRIBUTE}]`)) {
      element.removeAttribute(NAV_ATTRIBUTE)
      // 只撤掉插件写的 left，宿主自己的 top 等内联样式要保持原样
      if (element instanceof HTMLElement) element.style.removeProperty('left')
    }

    document.getElementById(STYLE_ID)?.remove()
  }
}
