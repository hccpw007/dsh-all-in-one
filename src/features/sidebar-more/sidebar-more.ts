/**
 * 「菜单收进更多」的客户端实现。
 *
 * 宿主把面板入口（插件、Skill / MCP、自动化任务）渲染在侧边栏顶部，把账户类入口
 * （设置、意见反馈、登录）渲染在左下角的「更多」菜单里。本模块只做搬运：
 * 顶部面板列表整块隐藏，其中的入口按宿主菜单项结构克隆进底部菜单，点击时仍调用
 * 原按钮，面板与弹层的行为完全不动。
 *
 * 顶部「更多」的两个子项（浏览更多插件、创建你的插件）没有常驻 DOM，按索引在
 * 打开顶部子菜单后再点，期间的弹层整体隐藏，避免它闪现在左上角。
 */

import type { Translate } from '../../types/plugin'

/** 顶部面板列表：宿主用构建期哈希类名渲染，只有 `_panelList` 后缀是稳定语义。 */
const PANEL_LIST_SELECTOR = 'nav[class*="_panelList"]'

/** 顶部面板行按钮；带 aria-expanded 的那一行是「更多」，展开后是它的子菜单项。 */
const PANEL_ROW_SELECTOR = 'button[class*="_panelRow"]'

/** 左下角「更多」触发器：位于底部工具条，展开时 aria-expanded 为 true。 */
const FOOTER_TRIGGER_SELECTOR = '[class*="_triggerRow"] button[aria-haspopup="menu"]'

/** 宿主菜单项容器，克隆它得到与宿主一致的排版。 */
const MENU_TEMPLATE_SELECTOR = '[class*="_itemWrap"]'

/** 菜单项内部的文案、图标与快捷键节点。 */
const MENU_LABEL_SELECTOR = '[class*="_itemLabel"]'
const MENU_ICON_SELECTOR = '[class*="_itemIcon"]'
const MENU_SHORTCUT_SELECTOR = '[class*="_shortcut"], [class*="_keys"]'

/** 插件样式节点 id，卸载时据此整体移除。 */
const STYLE_ID = 'dsh-all-in-one-sidebar-more'

/** 注入菜单项的标记属性，用于判断宿主菜单是否已经搬运过。 */
const INJECTED_ATTRIBUTE = 'data-aio-sidebar-more-item'

/** 读取顶部子菜单期间挂在 <html> 上的标记：期间不显示弹层，避免闪现。 */
const SUPPRESS_ATTRIBUTE = 'data-aio-sidebar-more-suppress'

/** 顶部「更多」子项的点击重试次数：宿主在点击后的下一帧渲染弹层。 */
const SUBITEM_MAX_ATTEMPTS = 3

/** 弹层隐藏保持时间，等宿主完成关闭动画后再恢复显示。 */
const SUPPRESS_RELEASE_MS = 300

/**
 * 插件样式：隐藏顶部面板列表，并在读取顶部子菜单时屏蔽弹层。
 *
 * 顶部面板列表隐藏后布局自然收起；底部菜单由宿主在点击时渲染，样式不需要参与。
 */
const STYLE_TEXT = [
  `${PANEL_LIST_SELECTOR} { display: none !important; }`,
  `html[${SUPPRESS_ATTRIBUTE}] [role="menu"] { visibility: hidden !important; }`,
].join('\n')

/** 一个注入菜单项的构成：显示文案、沿用原入口的图标、点击后要执行的宿主入口。 */
interface MenuItemOptions {
  label: string
  icon: Element | null
  onClick: () => void
}

/** 注入样式；重复安装时复用同一节点。 */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_TEXT
  document.head.appendChild(style)
}

/**
 * 找左下角「更多」触发器。
 * @returns 触发器；宿主未渲染底部工具条时返回 null
 */
function findFooterTrigger(): HTMLElement | null {
  const trigger = document.querySelector(FOOTER_TRIGGER_SELECTOR)
  return trigger instanceof HTMLElement ? trigger : null
}

/**
 * 列出顶部面板行按钮，保持宿主原有顺序。
 * @returns 面板行；顶部面板列表尚未渲染时为空数组
 */
function findPanelRows(): HTMLElement[] {
  const list = document.querySelector(PANEL_LIST_SELECTOR)
  if (!(list instanceof HTMLElement)) return []

  return Array.from(list.querySelectorAll<HTMLElement>(PANEL_ROW_SELECTOR))
}

/**
 * 判断一个面板行是否为「更多」：只有它会带 aria-expanded，普通面板入口没有。
 * @param row 面板行按钮
 * @returns 是否为展开式「更多」
 */
function isMenuToggle(row: HTMLElement): boolean {
  return row.getAttribute('aria-expanded') !== null
}

/** 收起底部「更多」菜单；宿主菜单由触发器自身维护展开状态。 */
function closeFooterMenu(): void {
  const trigger = findFooterTrigger()
  if (trigger !== null && trigger.getAttribute('aria-expanded') === 'true') {
    trigger.click()
    return
  }

  // 触发器已经不可用时退化为 Escape：宿主菜单与其它弹层一样响应它
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

/**
 * 按宿主菜单项结构创建一条注入项。
 * @param template 菜单中已有的菜单项容器，克隆它沿用宿主排版与样式
 * @param options 文案、图标与点击行为
 * @returns 可插入菜单的节点；模板缺少按钮时返回未绑定点击的节点
 */
function createMenuItem(template: HTMLElement, options: MenuItemOptions): HTMLElement {
  const wrap = template.cloneNode(true) as HTMLElement
  wrap.setAttribute(INJECTED_ATTRIBUTE, '')

  // 快捷键提示属于宿主原有菜单项，克隆下来的必须清掉，否则会显示成错误的热键
  for (const node of Array.from(wrap.querySelectorAll(MENU_SHORTCUT_SELECTOR))) node.remove()

  const label = wrap.querySelector(MENU_LABEL_SELECTOR)
  if (label !== null) label.textContent = options.label

  // 图标沿用原入口的 svg；顶部子项没有独立图标，清空后与其它项左侧对齐
  const icon = wrap.querySelector(MENU_ICON_SELECTOR)
  if (icon !== null) {
    icon.replaceChildren()
    if (options.icon !== null) icon.appendChild(options.icon.cloneNode(true))
  }

  const button = wrap.querySelector('button')
  if (!(button instanceof HTMLElement)) {
    console.error('[sidebar-more] 宿主菜单项模板缺少按钮，入口不可点击:', options.label)
    return wrap
  }

  button.removeAttribute('aria-keyshortcuts')
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    // 先收起底部菜单再执行原入口：两层弹层重叠时宿主会把新弹层一起关掉
    closeFooterMenu()
    window.requestAnimationFrame(options.onClick)
  })

  return wrap
}

/**
 * 打开顶部「更多」的第 index 个子项。
 * @param index 子项下标：0 浏览更多插件，1 创建你的插件
 */
function openTopMoreItem(index: number): void {
  const more = findPanelRows().find(isMenuToggle)
  if (more === undefined) {
    console.error('[sidebar-more] 找不到顶部「更多」按钮，无法打开第', index + 1, '项')
    return
  }

  // 记录已有的弹层，点击后新出现的那个才是顶部「更多」的子菜单
  const before = new Set(document.querySelectorAll('[role="menu"]'))
  document.documentElement.setAttribute(SUPPRESS_ATTRIBUTE, '')
  more.click()

  clickNewMenuItem(before, index, 1)
}

/**
 * 在新出现的弹层里点击第 index 项。
 * @param before 点击前已存在的弹层集合
 * @param index 子项下标
 * @param attempt 当前尝试次数，宿主晚一帧渲染时重试
 */
function clickNewMenuItem(before: Set<Element>, index: number, attempt: number): void {
  const menu = Array.from(document.querySelectorAll('[role="menu"]')).find((node) => !before.has(node))
  const item = menu?.querySelectorAll('[role="menuitem"]')[index]

  if (item instanceof HTMLElement) {
    item.click()
    // 宿主关闭弹层有动画，稍后再恢复显示，避免它在左上角闪一下
    window.setTimeout(() => document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE), SUPPRESS_RELEASE_MS)
    return
  }

  if (attempt < SUBITEM_MAX_ATTEMPTS) {
    window.requestAnimationFrame(() => clickNewMenuItem(before, index, attempt + 1))
    return
  }

  console.error('[sidebar-more] 顶部「更多」菜单缺少第', index + 1, '项')
  document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE)
}

/**
 * 把顶部入口搬进当前打开的底部菜单。
 *
 * 宿主只在点开时渲染菜单，因此每次 DOM 变化都检查一次：菜单已存在注入项时直接返回，
 * 菜单被宿主重建后重新注入。
 * @param t 已绑定本 feature key 前缀的翻译函数
 */
function injectFooterItems(t: Translate): void {
  const trigger = findFooterTrigger()
  // 底部菜单收起时不动手，避免干扰宿主的渲染
  if (trigger === null || trigger.getAttribute('aria-expanded') !== 'true') return

  const menu = document.querySelector('[role="menu"]')
  if (!(menu instanceof HTMLElement)) return
  // 宿主重建菜单时会丢掉插件节点，所以以节点是否存在判断，而不是在菜单元素上打标记
  if (menu.querySelector(`[${INJECTED_ATTRIBUTE}]`) !== null) return

  const template = menu.querySelector(MENU_TEMPLATE_SELECTOR)
  if (!(template instanceof HTMLElement)) {
    console.error('[sidebar-more] 找不到宿主菜单项结构，跳过菜单搬运')
    return
  }

  const viewport = menu.querySelector('[class*="_viewport"]') ?? menu

  // 顶部面板入口（插件、Skill / MCP、自动化任务）先插入，保持宿主原有顺序
  for (const row of findPanelRows().filter((item) => !isMenuToggle(item))) {
    viewport.appendChild(
      createMenuItem(template, {
        label: row.getAttribute('aria-label') ?? row.textContent?.trim() ?? '',
        icon: row.querySelector('svg'),
        onClick: () => row.click(),
      }),
    )
  }

  // 顶部「更多」的子项没有常驻 DOM，按索引在打开子菜单后再点
  const subItems = [
    { label: t('browsePlugins'), index: 0 },
    { label: t('createPlugin'), index: 1 },
  ]

  for (const subItem of subItems) {
    viewport.appendChild(
      createMenuItem(template, {
        label: subItem.label,
        icon: null,
        onClick: () => openTopMoreItem(subItem.index),
      }),
    )
  }
}

/**
 * 安装「菜单收进更多」。
 * @param t 已绑定本 feature key 前缀的翻译函数
 * @returns 清理函数：撤销样式、监听与临时标记
 */
export function installSidebarMore(t: Translate): () => void {
  ensureStyle()

  let disposed = false
  let scheduled = false

  /** 每帧最多检查一次：宿主菜单在点击后才渲染，节点变化本身不需要逐条处理。 */
  const scan = (): void => {
    scheduled = false
    if (disposed) return
    injectFooterItems(t)
  }

  const schedule = (): void => {
    if (scheduled || disposed) return
    scheduled = true
    window.requestAnimationFrame(scan)
  }

  // 只监听节点增删：会话流式输出会频繁触发，但回调里只做几次轻量查询
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  schedule()

  return () => {
    disposed = true
    observer.disconnect()
    document.getElementById(STYLE_ID)?.remove()
    document.documentElement.removeAttribute(SUPPRESS_ATTRIBUTE)
  }
}
