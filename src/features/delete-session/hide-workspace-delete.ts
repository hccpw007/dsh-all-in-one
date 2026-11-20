/**
 * 「删除会话」开关开启时，收起工作区右键菜单里的「删除工作区」。
 *
 * 删掉工作区会让它下面的所有会话一起消失；右键是随手可触发的入口，开关打开后
 * 不再从这里提供。工作区行「更多」按钮打开的菜单仍保留该项：那是用户主动展开的
 * 菜单，继续保留宿主原有的管理入口。
 *
 * 宿主菜单项由宿主插件注册，客户端插槽 API 不能注销，这里用样式表按图标收起；
 * 打开方式由 workspace-menu 写在 body 属性上，右键时菜单一出现就已隐藏。
 */

/** 菜单项容器：与宿主 ContextMenu 的 DOM 结构一致。 */
const MENU_ITEM_SELECTOR = '[class*="_itemWrap"]'

/** 「删除工作区」项的图标：宿主工作区菜单用它，与归档、置顶等图标不同。 */
const DELETE_WORKSPACE_ICON_SELECTOR = 'svg[data-icon="dsw-icon-trash-outline-regular"]'

/** body 上记录菜单打开方式的属性：右键与行内「更多」按钮打开的菜单要区别对待。 */
export const MENU_SOURCE_ATTRIBUTE = 'data-aio-menu-source'

/** 右键打开菜单：该方式下隐藏「删除工作区」。 */
export const MENU_SOURCE_CONTEXT = 'context'

/** 行内「更多」按钮打开菜单：保留宿主的「删除工作区」。 */
export const MENU_SOURCE_BUTTON = 'button'

/** 样式表节点 id：重复安装时复用同一节点，也方便在 DevTools 里直接定位。 */
const STYLE_ID = 'aio-hide-workspace-delete'

/** 隐藏样式：只在右键打开的菜单里收起「删除工作区」菜单项。 */
const STYLE_TEXT = `body[${MENU_SOURCE_ATTRIBUTE}="${MENU_SOURCE_CONTEXT}"] [role="menu"] ${MENU_ITEM_SELECTOR}:has(${DELETE_WORKSPACE_ICON_SELECTOR}) { display: none !important; }`

/** 注入隐藏样式；重复安装时复用同一节点。 */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_TEXT
  document.head.appendChild(style)
}

/**
 * 安装「删除工作区」入口隐藏。
 * @returns 清理函数：移除样式表与打开方式标记
 */
export function installWorkspaceDeleteHiding(): () => void {
  ensureStyle()

  return () => {
    document.getElementById(STYLE_ID)?.remove()
    document.body.removeAttribute(MENU_SOURCE_ATTRIBUTE)
  }
}
