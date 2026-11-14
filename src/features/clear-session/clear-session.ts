/**
 * 「清空会话」的执行层。
 *
 * 宿主没有「把一条会话的历史清零后继续用」的能力，会话日志是只追加的，
 * 因此清空等于换一条新对话：先准备一条空白会话并切过去，
 * 再按用户所选动作决定原对话的去向（保留不动，或删除本地记录）。
 */
import type { SessionsApi, UiWorkspaceApi } from '../../types/plugin'
import { requestDeleteSession } from './api'
import type { ClearSessionAction, ClearSessionTarget } from './types'

/** 清空执行所需的宿主客户端服务。 */
export interface ClearSessionDeps {
  /** 会话列表服务：读取当前对话、摘掉已删除的行。 */
  sessions: SessionsApi
  /** 工作区服务：读取归属、准备空白会话并切换主视图；不可用时退化为按目录新建。 */
  uiWorkspace: UiWorkspaceApi | undefined
}

/** 等待主视图释放旧对话的上限；宿主的会话释放是一次本地快照更新，通常几十毫秒内完成。 */
const DETACH_TIMEOUT_MS = 1500

/** 轮询间隔；用短间隔换取切换后立即继续，不必固定等待一整段超时时间。 */
const DETACH_POLL_MS = 50

/**
 * 找到用户正在浏览的那条对话。
 * @param deps 宿主客户端服务
 * @returns 清空目标；没有正在浏览的对话时返回 undefined
 */
export function findCurrentSession(deps: ClearSessionDeps): ClearSessionTarget | undefined {
  const state = deps.sessions.list.getSnapshot()
  // 主视图持有的会话就是当前对话；同一个 id 只可能在主视图里出现一次
  const sessionId = state.ids.find((id) => (state.byId[id]?.retainedBy?.mainView ?? 0) > 0)
  if (sessionId === undefined) return undefined

  const summary = state.byId[sessionId]
  const workspaceId = deps.uiWorkspace?.workspaces?.list
    .getSnapshot()
    .items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId

  return {
    sessionId,
    workspaceId,
    cwd: summary?.cwd,
    running: summary?.running === true,
  }
}

/**
 * 准备一条空白会话作为清空后的落点。
 *
 * 工作区的 `connectWorkspace` 会复用已有的空白会话；若复用到的正是当前对话，
 * 换过去等于没换，这种情况改为显式新建。
 * @param deps 宿主客户端服务
 * @param target 要清空的会话
 * @returns 新会话标识；宿主两个创建入口都不可用时返回 undefined
 */
async function prepareBlank(
  deps: ClearSessionDeps,
  target: ClearSessionTarget,
): Promise<string | undefined> {
  const create = async (): Promise<string | undefined> => {
    if (typeof deps.sessions.create !== 'function') return undefined
    try {
      return await deps.sessions.create({
        ...(target.workspaceId === undefined ? {} : { workspaceId: target.workspaceId }),
        ...(target.cwd === undefined ? {} : { cwd: target.cwd }),
      })
    } catch (error) {
      console.error('[clear-session] 新建空白会话失败:', error)
      throw error
    }
  }

  // 优先复用工作区里已有的空白会话，避免每清空一次就多留一条空壳
  if (target.workspaceId !== undefined && typeof deps.uiWorkspace?.connectWorkspace === 'function') {
    try {
      const reused = await deps.uiWorkspace.connectWorkspace(target.workspaceId)
      if (reused !== target.sessionId) return reused
    } catch (error) {
      console.error('[clear-session] 复用空白会话失败，改用新建:', error)
    }
  }

  return await create()
}

/**
 * 等待主视图放开对旧对话的持有。
 *
 * 主视图还持有旧对话时删掉磁盘记录，宿主会在后续写入时把它整条重建，
 * 清空等于没做；切走后再等它脱离持有，删除才是真的删除。
 * 超时只记日志：删除仍按最优努力执行，失败会由路由返回给用户。
 * @param sessions 会话列表服务
 * @param sessionId 旧对话标识
 */
async function waitDetached(sessions: SessionsApi, sessionId: string): Promise<void> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < DETACH_TIMEOUT_MS) {
    const summary = sessions.list.getSnapshot().byId[sessionId]
    // 快照里已经没有这一行，或主视图已不再持有它，都可以安全处理
    if (summary === undefined || (summary.retainedBy?.mainView ?? 0) === 0) return

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, DETACH_POLL_MS)
    })
  }

  console.warn('[clear-session] 等待主视图释放旧会话超时，继续处理:', sessionId)
}

/**
 * 开一条新对话；删除动作还要清掉原对话的本地记录。
 * @param deps 宿主客户端服务
 * @param target 当前对话
 * @param action 保留原对话，或删除它
 * @returns 新对话的标识；宿主没有创建入口时为 undefined
 */
export async function clearSession(
  deps: ClearSessionDeps,
  target: ClearSessionTarget,
  action: ClearSessionAction,
): Promise<string | undefined> {
  if (target.running) throw new Error('当前对话正在运行，请先停止')

  const nextId = await prepareBlank(deps, target)

  // 先把主视图切到新对话：删除要求原对话不再被主视图持有，
  // 否则宿主会按内存中的状态把它重新落盘；保留动作同样要落到新对话上
  if (nextId !== undefined) deps.uiWorkspace?.openSession?.(nextId)
  else deps.uiWorkspace?.startSession?.(target.workspaceId)

  // 保留动作到这里就结束了：原对话原样留在列表里，不做归档也不做删除
  if (action === 'keep') return nextId

  await waitDetached(deps.sessions, target.sessionId)
  await requestDeleteSession(target.sessionId)
  // 磁盘上的记录已删除，但客户端快照仍留着这一行：同步摘掉，列表立即刷新
  deps.sessions.handleSessionRemoved?.(target.sessionId)

  return nextId
}
