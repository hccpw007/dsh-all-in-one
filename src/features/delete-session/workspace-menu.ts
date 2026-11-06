/**
 * 工作区「更多」菜单里的「删除所有会话」入口。
 *
 * 宿主当前版本的工作区菜单没有对外扩展点，这里按菜单的 DOM 结构注入：
 * 记录用户点开的是哪个工作区的「更多」，菜单渲染后在「删除工作区」之前插入
 * 一条同样式的菜单项；点击后关闭菜单并写入批量删除的待确认请求，由确认弹窗
 * 执行删除。
 *
 * 宿主改动菜单结构时，最坏情况是菜单项不再出现，不影响会话行删除与其它功能。
 */
import type { SessionsApi, Translate, UiWorkspaceApi } from '../../types/plugin'
import { deleteConfirmStore } from './confirm-store'
import { readDeleteSessionEnabled } from './delete-session'

/** 工作区行：宿主用 `data-row-key="workspace:<id>"` 标记。 */
const WORKSPACE_ROW_SELECTOR = '[data-row-key^="workspace:"]'

/** 菜单容器。 */
const MENU_SELECTOR = '[role="menu"]'

/** 菜单项容器：克隆它得到与宿主一致的排版与危险样式。 */
const MENU_ITEM_SELECTOR = '[class*="_itemWrap"]'

/** 菜单项文案节点。 */
const MENU_LABEL_SELECTOR = '[class*="_itemLabel"]'

/** 菜单项图标容器；宿主把图标 svg 放在它里面，替换图标时清空这一层即可。 */
const MENU_ICON_SELECTOR = '[class*="_itemIcon"]'

/** svg 元素必须用命名空间创建，否则在 HTML 文档里不会被当作图形渲染。 */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/** 菜单项图标尺寸，与宿主菜单图标一致。 */
const ICON_SIZE = 16

/**
 * 「删除所有会话」图标路径：删除线素材（1082×1024 网格），两段 path 依次为图形与删除线。
 * 每段分片拼接，避免单行超过行长上限；拼接结果须与素材完全一致，不能改动数值精度。
 */
const DELETE_ALL_ICON_PATHS = [
  [
    'M448.609524 882.590476c-58.514286 0-112.152381-19.504762-156.038095-63.390476l-126.78',
    '0953-126.780952c-19.504762-19.504762-29.257143-43.885714-29.257143-73.142858s9.752381',
    '-53.638095 29.257143-73.142857l375.466667-375.466666c39.009524-39.009524 107.27619-39',
    '.009524 146.285714 0l209.676191 209.67619c39.009524 39.009524 39.009524 107.27619 0 1',
    '46.285714l-292.571429 292.571429c-43.885714 43.885714-102.4 63.390476-156.038095 63.3',
    '90476z m-121.904762-97.523809c68.266667 68.266667 175.542857 68.266667 243.809524 0l2',
    '92.571428-292.571429c19.504762-19.504762 19.504762-53.638095 0-78.019048l-209.67619-2',
    '09.67619c-19.504762-19.504762-53.638095-19.504762-78.019048 0l-375.466666 375.466667c',
    '-9.752381 9.752381-14.628571 24.380952-14.628572 39.009523s4.87619 29.257143 14.62857',
    '2 39.009524l126.780952 126.780953z',
  ].join(''),
  [
    'M244.345905 516.437333l34.474666-34.474666 317.244953 317.19619-34.523429 34.474667zM',
    '921.6 882.590476H453.485714c-14.628571 0-24.380952-9.752381-24.380952-24.380952s9.752',
    '381-24.380952 24.380952-24.380953h468.114286c14.628571 0 24.380952 9.752381 24.380952',
    ' 24.380953s-9.752381 24.380952-24.380952 24.380952z',
  ].join(''),
]

/** 工作区菜单的末项文案，用于确认当前菜单是工作区菜单并定位插入点。 */
const DELETE_WORKSPACE_LABELS = ['删除工作区', 'Delete workspace']

/** 注入项的标记属性，避免重复插入。 */
const INJECTED_ATTRIBUTE = 'data-aio-delete-all-sessions'

/** 本次点开菜单的工作区。 */
interface MenuTarget {
  workspaceId: string
  title: string
}

/**
 * 从工作区行读出工作区标识与标题。
 * @param row 工作区行元素
 * @returns 工作区标识与标题；行结构异常时返回 undefined
 */
function readWorkspaceRow(row: HTMLElement): MenuTarget | undefined {
  const key = row.getAttribute('data-row-key') ?? ''
  const workspaceId = key.slice('workspace:'.length)
  if (workspaceId === '') return undefined

  const title = (row.querySelector('[class*="_title"]')?.textContent ?? '').trim()

  return { workspaceId, title: title === '' ? workspaceId : title }
}

/**
 * 列出工作区里可以批量删除的会话。
 * @param sessions 宿主客户端会话列表服务
 * @param uiWorkspace 宿主工作区服务
 * @param workspaceId 工作区标识
 * @returns 非运行中的会话标识（含已归档会话）；工作区服务缺失时为空
 */
function collectDeletableSessions(
  sessions: SessionsApi,
  uiWorkspace: UiWorkspaceApi | undefined,
  workspaceId: string,
): string[] {
  const workspace = uiWorkspace?.workspaces?.list.getSnapshot().items.find(
    (item) => item.workspaceId === workspaceId,
  )
  if (workspace === undefined) return []

  const state = sessions.list.getSnapshot()

  // 运行中的会话仍由宿主持有写句柄，删文件会破坏这次运行，因此整批跳过它们
  return workspace.sessionIds.filter((id) => state.byId[id]?.running !== true)
}

/** 用 Escape 关闭宿主菜单：菜单与其它浮层一样响应它。 */
function closeMenu(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

/**
 * 创建「删除所有会话」的图标。
 *
 * 素材按 1082×1024 网格绘制，填充色用 currentColor，沿用菜单项的危险色。
 * @returns 16×16 的 svg 元素
 */
function createDeleteAllIcon(): Element {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('width', String(ICON_SIZE))
  svg.setAttribute('height', String(ICON_SIZE))
  svg.setAttribute('viewBox', '0 0 1082 1024')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('aria-hidden', 'true')

  // 图形与删除线是两段独立 path，按素材原顺序追加到同一个 svg
  for (const pathData of DELETE_ALL_ICON_PATHS) {
    const iconPath = document.createElementNS(SVG_NAMESPACE, 'path')
    iconPath.setAttribute('d', pathData)
    svg.appendChild(iconPath)
  }

  return svg
}

/**
 * 按宿主菜单项结构创建一条注入项。
 * @param template 已有的「删除工作区」项，克隆它沿用排版与危险色
 * @param label 菜单项文案
 * @param onSelect 点击后的动作
 * @returns 可插入菜单的节点
 */
function createMenuItem(template: HTMLElement, label: string, onSelect: () => void): HTMLElement {
  const wrap = template.cloneNode(true) as HTMLElement
  wrap.setAttribute(INJECTED_ATTRIBUTE, '')

  const labelNode = wrap.querySelector(MENU_LABEL_SELECTOR)
  if (labelNode !== null) labelNode.textContent = label

  // 图标容器缺失时退化为替换第一个 svg；两者都没有说明宿主菜单结构已变
  const iconNode = wrap.querySelector(MENU_ICON_SELECTOR) ?? wrap.querySelector('svg')
  if (iconNode === null) {
    console.error('[delete-session] 工作区菜单项模板缺少图标节点，沿用宿主图标:', label)
  } else {
    iconNode.replaceChildren(createDeleteAllIcon())
  }

  const button = wrap.querySelector('button')
  if (!(button instanceof HTMLElement)) {
    console.error('[delete-session] 工作区菜单项模板缺少按钮，入口不可点击:', label)
    return wrap
  }

  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    onSelect()
  })

  return wrap
}

/**
 * 在已打开的工作区菜单里插入「删除所有会话」。
 * @param menu 菜单容器
 * @param target 本次点开菜单的工作区
 * @param sessions 宿主客户端会话列表服务
 * @param uiWorkspace 宿主工作区服务
 * @param t 已绑定本 feature 前缀的翻译函数
 */
function injectMenuItem(
  menu: HTMLElement,
  target: MenuTarget,
  sessions: SessionsApi,
  uiWorkspace: UiWorkspaceApi | undefined,
  t: Translate,
): void {
  if (menu.querySelector(`[${INJECTED_ATTRIBUTE}]`) !== null) return

  const items = Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
  const deleteWorkspace = items.find((item) =>
    DELETE_WORKSPACE_LABELS.includes((item.textContent ?? '').trim()),
  )
  // 不是工作区菜单（例如会话菜单）时不插入
  if (deleteWorkspace === undefined) return

  const sessionIds = collectDeletableSessions(sessions, uiWorkspace, target.workspaceId)
  // 没有可删的会话时不显示入口，避免点了才发现没有东西可删
  if (sessionIds.length === 0) return

  const item = createMenuItem(deleteWorkspace, t('deleteAllAction'), () => {
    // 先关闭宿主菜单，避免菜单浮层与确认弹窗重叠
    closeMenu()
    window.requestAnimationFrame(() => {
      deleteConfirmStore.request({
        kind: 'workspace',
        workspaceId: target.workspaceId,
        title: target.title,
        sessionIds,
      })
    })
  })

  deleteWorkspace.parentElement?.insertBefore(item, deleteWorkspace)
}

/**
 * 安装工作区菜单入口。
 * @param t 已绑定本 feature 前缀的翻译函数
 * @param sessions 宿主客户端会话列表服务
 * @param readUiWorkspace 读取当前工作区服务；未就绪时返回 undefined
 * @returns 清理函数：撤销监听与观察器
 */
export function installWorkspaceMenu(
  t: Translate,
  sessions: SessionsApi,
  readUiWorkspace: () => UiWorkspaceApi | undefined,
): () => void {
  let pending: MenuTarget | undefined
  let scheduled = false
  let disposed = false

  /**
   * 捕获阶段记录用户点开的是哪个工作区的「更多」：工作区行内第一个按钮是更多，
   * 第二个才是新建会话。
   */
  const onClick = (event: MouseEvent): void => {
    const node = event.target
    if (!(node instanceof Element)) return

    const row = node.closest(WORKSPACE_ROW_SELECTOR)
    if (!(row instanceof HTMLElement)) return

    const button = node.closest('button')
    if (button === null || row.querySelector('button') !== button) return

    // 重新点开菜单时先清掉上一次的目标，避免菜单未渲染时残留
    pending = readWorkspaceRow(row)
  }

  /** 菜单渲染后插入入口；只处理找到菜单的那一次，避免反复扫描。 */
  const scan = (): void => {
    scheduled = false
    if (disposed || pending === undefined) return

    const menu = document.querySelector(MENU_SELECTOR)
    if (!(menu instanceof HTMLElement)) return

    // 开关关闭时菜单保持宿主原样；菜单每次打开都重新判断
    if (readDeleteSessionEnabled()) {
      injectMenuItem(menu, pending, sessions, readUiWorkspace(), t)
    }

    pending = undefined
  }

  const schedule = (): void => {
    if (scheduled || disposed) return
    scheduled = true
    window.requestAnimationFrame(scan)
  }

  // 只监听节点增删：会话流式输出会频繁触发，但回调里只在点开菜单后做少量查询
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  document.addEventListener('click', onClick, true)

  return () => {
    disposed = true
    observer.disconnect()
    document.removeEventListener('click', onClick, true)
  }
}
