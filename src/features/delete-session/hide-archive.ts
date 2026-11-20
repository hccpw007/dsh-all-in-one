/**
 * 「删除会话」开关开启时隐藏宿主的归档入口。
 *
 * 归档只是把会话从列表里藏起来，历史仍留在磁盘上，与本功能「直接删除」的定位冲突；
 * 开关打开后不再提供归档。宿主的归档按钮与菜单项都由宿主插件注册，客户端插槽 API
 * 无法注销别人的条目，因此这里从 DOM 层处理：一条样式表收起会话行的归档按钮、
 * 菜单里的归档项，以及归档项自带的悬空分隔线；再在捕获阶段拦掉宿主的默认归档快捷键。
 *
 * 只隐藏「归档」：已归档的旧会话仍可在侧栏的已归档筛选里查看，并用「取消归档」恢复。
 * 在宿主里改过归档快捷键的绑定后拦截会失效，这是已知限制；按钮与菜单项不受影响。
 */

/** 会话行：宿主用 `data-row-key="session:<id>"` 标记。 */
const SESSION_ROW_SELECTOR = '[data-row-key^="session:"]'

/** 菜单容器与菜单项容器：与宿主 ContextMenu 的 DOM 结构一致。 */
const MENU_SELECTOR = '[role="menu"]'
const MENU_ITEM_SELECTOR = '[class*="_itemWrap"]'

/** 菜单分隔线：宿主给归档项加的 `separatorBefore` 渲染成它的前一个兄弟节点。 */
const MENU_SEPARATOR_SELECTOR = `${MENU_SELECTOR} [class*="_separator"]`

/**
 * 归档图标：宿主行按钮与菜单项都用这份图标资源定位，
 * 不依赖界面语言文案，也不依赖 CSS Module 带哈希的类名。
 */
const ARCHIVE_ICON_SELECTOR = 'use[href="#dsw-icon-archive-outline-regular"]'

/** 样式表节点 id：重复安装时复用同一节点，也方便在 DevTools 里直接定位。 */
const STYLE_ID = 'aio-hide-archive'

/**
 * 归档项前的那条分隔线；隐藏归档项后它会悬空，必须一起收起。
 * 匹配「下一个兄弟是带归档图标的菜单项」——` :has() ` 不能嵌套，这里把图标判断
 * 写成相邻兄弟选择器的后代，不套第二层 `:has()`。
 */
const ARCHIVE_SEPARATOR_SELECTOR = `${MENU_SEPARATOR_SELECTOR}:has(+ ${MENU_ITEM_SELECTOR} ${ARCHIVE_ICON_SELECTOR})`

/**
 * 隐藏样式：会话行归档按钮、菜单归档项与它的分隔线。
 * 「取消归档」用另一份图标，不受这三条规则影响。
 */
const STYLE_TEXT = [
  `${SESSION_ROW_SELECTOR} button:has(${ARCHIVE_ICON_SELECTOR})`,
  `${MENU_SELECTOR} ${MENU_ITEM_SELECTOR}:has(${ARCHIVE_ICON_SELECTOR})`,
  ARCHIVE_SEPARATOR_SELECTOR,
].join(',\n') + ' { display: none !important; }'

/** 注入隐藏样式；重复安装时复用同一节点。 */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_TEXT
  document.head.appendChild(style)
}

/**
 * 判断事件是否命中宿主 web 端的默认归档快捷键。
 *
 * 宿主注册的默认值在 web 端是「主修饰键 + Alt + A」（mac 为 ⌘⌥A，其它平台为 Ctrl+Alt+A），
 * 这里按同一组合拦截。
 * @param event 键盘事件
 * @returns 是否命中归档快捷键
 */
function isArchiveShortcut(event: KeyboardEvent): boolean {
  return event.code === 'KeyA' && event.altKey && (event.metaKey || event.ctrlKey)
}

/**
 * 安装归档入口隐藏。
 * @returns 清理函数：移除快捷键监听与样式表
 */
export function installArchiveHiding(): () => void {
  ensureStyle()

  // 快捷键在捕获阶段吃掉：宿主的按键处理注册在冒泡阶段，收不到被拦下的事件
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!isArchiveShortcut(event)) return

    event.preventDefault()
    event.stopImmediatePropagation()
  }
  window.addEventListener('keydown', onKeyDown, true)

  return () => {
    window.removeEventListener('keydown', onKeyDown, true)
    document.getElementById(STYLE_ID)?.remove()
  }
}
