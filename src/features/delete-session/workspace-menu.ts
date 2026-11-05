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
 * 「删除所有会话」图标路径：扫把清理素材（1024 网格），分片拼接避免单行超长。
 * 已用 svgo 去掉多余精度，长度约为原始素材的四分之一，16px 下形状无可见差异。
 */
const BROOM_ICON_PATH = [
  'm826 358 97-235a85 85 0 0 0-24-101 93 93 0 0 0-147 39L609 406c-3 9-6 17-19 11l-13-1a110 ',
  '110 0 0 0-90 41l-48 62a135 135 0 0 1-29 29 674 674 0 0 1-289 123q-24 4-28 22a28 28 0 0 0',
  ' 16 30l94 60a3130 3130 0 0 0 348 195 508 508 0 0 0 128 43 54 54 0 0 0 68-30l10-18a472 47',
  '2 0 0 0 68-263l-2-36 10-78a102 102 0 0 0-50-106q-11-6-5-15zM698 964a10 10 0 0 1-12 6l-14',
  '-3-22-7 39-64a25 25 0 0 0-2-29 29 29 0 0 0-49 5q-16 30-36 59-4 9-13 4l-46-22 24-28a353 3',
  '53 0 0 0 54-81 27 27 0 0 0-13-40 29 29 0 0 0-39 18 352 352 0 0 1-73 99q-3 5-10 2-75-40-1',
  '49-84l62-37 63-42a27 27 0 0 0 10-40 29 29 0 0 0-43-4 1564 1564 0 0 1-131 82 25 25 0 0 1-',
  '31 0q-34-23-74-46l80-26a703 703 0 0 0 172-96 17 17 0 0 1 19-3l292 111a16 16 0 0 1 12 16 ',
  '431 431 0 0 1-70 250m78-376-6 48q0 9-9 6l-260-99q-9-3-3-9l33-43a54 54 0 0 1 44-20 64 64 ',
  '0 0 1 24 5q69 29 139 53a51 51 0 0 1 38 59m-51-133q-4 11-13 5l-46-17q-11-3-6-13l111-268 3',
  '7-88a35 35 0 0 1 65 4l2 10-4 14z',
].join('')

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
 * 创建「删除所有会话」的扫把清理图标。
 *
 * 路径取自 iconfont 的扫把素材（1024 网格），填充色用 currentColor，沿用菜单项的危险色。
 * @returns 16×16 的 svg 元素
 */
function createBroomIcon(): Element {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('width', String(ICON_SIZE))
  svg.setAttribute('height', String(ICON_SIZE))
  svg.setAttribute('viewBox', '0 0 1024 1024')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('aria-hidden', 'true')

  const iconPath = document.createElementNS(SVG_NAMESPACE, 'path')
  iconPath.setAttribute('d', BROOM_ICON_PATH)
  svg.appendChild(iconPath)

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
    iconNode.replaceChildren(createBroomIcon())
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
