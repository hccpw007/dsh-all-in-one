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
 * 按宿主菜单项结构创建一条注入项。
 * @param template 已有的「删除工作区」项，克隆它沿用排版、危险色与垃圾桶图标
 * @param label 菜单项文案
 * @param onSelect 点击后的动作
 * @returns 可插入菜单的节点
 */
function createMenuItem(template: HTMLElement, label: string, onSelect: () => void): HTMLElement {
  const wrap = template.cloneNode(true) as HTMLElement
  wrap.setAttribute(INJECTED_ATTRIBUTE, '')

  const labelNode = wrap.querySelector(MENU_LABEL_SELECTOR)
  if (labelNode !== null) labelNode.textContent = label

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
