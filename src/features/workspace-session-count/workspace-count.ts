/**
 * 侧边栏项目名后的会话数量。
 *
 * 宿主的工作区行没有标题插槽，这里按行的 DOM 结构注入：给行的标题元素写一个
 * 数据属性，由插件样式表的伪元素渲染「（N）」——伪元素不属于 React 管理的
 * 子节点，因此宿主重渲染标题文本时不会把它覆盖掉。
 *
 * 数量来自宿主工作区快照与会话快照：工作区里的会话全部计入，但排除空白
 * 「新会话」，与侧边栏实际能展开看到的会话行一致。数据变化走宿主订阅，
 * 行节点被 React 整体替换时由观察器补回。
 */
import type { SessionsApi, UiWorkspaceApi, WorkspaceSummary } from '../../types/plugin'

/** 工作区行：宿主用 `data-row-key="workspace:<id>"` 标记。 */
const WORKSPACE_ROW_SELECTOR = '[data-row-key^="workspace:"]'

/** 行标题：宿主用 CSS Module 生成 `_title` 类名，工作区行只有一个标题节点。 */
const TITLE_SELECTOR = '[class*="_title"]'

/** 计数属性：值就是数字，括号与样式由插件样式表补齐。 */
const COUNT_ATTRIBUTE = 'data-aio-workspace-count'

/** 计数标记类：样式表据此绘制数字。 */
const COUNT_CLASS = 'aio-workspace-count'

/**
 * 从工作区行读出工作区标识。
 * @param row 工作区行元素
 * @returns 工作区标识；未分组行（key 为空）返回 undefined
 */
function readWorkspaceId(row: HTMLElement): string | undefined {
  const key = row.getAttribute('data-row-key') ?? ''
  const workspaceId = key.slice('workspace:'.length)

  return workspaceId === '' ? undefined : workspaceId
}

/**
 * 计算每个工作区要显示的会话数量。
 * @param workspaces 宿主工作区快照条目
 * @param sessions 宿主会话快照
 * @returns 工作区标识到数量的映射；没有会话的工作区不进入结果
 */
function buildCounts(
  workspaces: ReadonlyArray<WorkspaceSummary>,
  sessions: { byId: Record<string, { blank?: boolean }> },
): Map<string, number> {
  const counts = new Map<string, number>()

  // 逐个工作区统计自身会话：父项目不累加子项目，子项目各自显示自己的数量
  for (const workspace of workspaces) {
    let count = 0
    for (const id of workspace.sessionIds) {
      const summary = sessions.byId[id]
      // 快照里已消失的会话与空白「新会话」都不计，用户展开后看到的行数才是准的
      if (summary !== undefined && summary.blank !== true) count += 1
    }

    // 没有会话的项目不写数字，避免整列出现大量「（0）」
    if (count > 0) counts.set(workspace.workspaceId, count)
  }

  return counts
}

/**
 * 把数量写到当前渲染出来的工作区行上。
 * @param counts 工作区标识到数量的映射
 */
function applyCounts(counts: Map<string, number>): void {
  const rows = document.querySelectorAll<HTMLElement>(WORKSPACE_ROW_SELECTOR)

  for (const row of rows) {
    const workspaceId = readWorkspaceId(row)
    if (workspaceId === undefined) continue

    const title = row.querySelector<HTMLElement>(TITLE_SELECTOR)
    if (title === null) continue

    const count = counts.get(workspaceId)
    const next = count === undefined ? null : String(count)
    // 只在值变化时写 DOM：会话流式输出期间快照会频繁变化，避免无谓的样式重算
    if (title.getAttribute(COUNT_ATTRIBUTE) === next) continue

    if (next === null) {
      title.removeAttribute(COUNT_ATTRIBUTE)
      title.classList.remove(COUNT_CLASS)
    } else {
      title.setAttribute(COUNT_ATTRIBUTE, next)
      title.classList.add(COUNT_CLASS)
    }
  }
}

/** 移除所有注入标记；插件卸载或开关关闭后侧边栏恢复宿主原样。 */
function clearCounts(): void {
  const titles = document.querySelectorAll<HTMLElement>(`[${COUNT_ATTRIBUTE}]`)

  for (const title of titles) {
    title.removeAttribute(COUNT_ATTRIBUTE)
    title.classList.remove(COUNT_CLASS)
  }
}

/**
 * 安装项目名后的会话数量显示。
 * @param sessions 宿主客户端会话列表服务
 * @param uiWorkspace 宿主工作区服务
 * @returns 清理函数：取消订阅与观察器，并移除已写入的标记
 */
export function installWorkspaceSessionCount(
  sessions: SessionsApi,
  uiWorkspace: UiWorkspaceApi,
): () => void {
  let scheduled = false
  let disposed = false
  // 上次计算用的快照与结果：宿主快照引用不变时只补回行标记，不重复统计会话
  let lastWorkspaces: ReadonlyArray<WorkspaceSummary> | undefined
  let lastSessions: { byId: Record<string, { blank?: boolean }> } | undefined
  let lastCounts = new Map<string, number>()

  /** 按当前快照重算并写入数量；一帧内多次变化只执行一次。 */
  const render = (): void => {
    scheduled = false
    if (disposed) return

    const workspaces = uiWorkspace.workspaces?.list.getSnapshot().items
    if (workspaces === undefined) return

    const sessionState = sessions.list.getSnapshot()
    // 行节点被 React 重建时快照通常没变，复用上次结果，避免流式输出期间每帧重算
    if (workspaces !== lastWorkspaces || sessionState !== lastSessions) {
      lastCounts = buildCounts(workspaces, sessionState)
      lastWorkspaces = workspaces
      lastSessions = sessionState
    }

    applyCounts(lastCounts)
  }

  /** 合并同一帧内的多次变化，避免流式输出时反复同步查询侧边栏。 */
  const schedule = (): void => {
    if (scheduled || disposed) return

    scheduled = true
    window.requestAnimationFrame(render)
  }

  // 数据变化直接触发重算；宿主版本没有订阅能力时只靠下面的观察器兜底
  const unsubscribeWorkspaces = uiWorkspace.workspaces?.list.subscribe?.(schedule)
  const unsubscribeSessions = sessions.list.subscribe?.(schedule)

  // 行节点被 React 重建（折叠、搜索过滤、侧边栏重挂载）时观察器补回标记
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })

  // 安装时侧边栏可能已经渲染完成，先算一次，不必等下一次 DOM 变化
  schedule()

  return () => {
    disposed = true
    unsubscribeWorkspaces?.()
    unsubscribeSessions?.()
    observer.disconnect()
    clearCounts()
  }
}
