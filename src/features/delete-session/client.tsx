/**
 * 「删除会话」的客户端扩展。
 *
 * 两个插槽配合完成一次删除：
 *   - 会话行悬停操作区（`sidebar.workspaces.session.row.action`）里的删除按钮，
 *     点击只写入待确认请求；
 *   - 宿主浮层（`shell.overlay`）里的确认弹窗，用户确认后才请求宿主删除磁盘
 *     上的会话记录，并让客户端列表立刻丢掉这一行。
 *
 * 当前正在浏览的会话也能删除；删掉它之后优先切到工作空间里还在执行的任务，
 * 其次是第一条对话，一条都不剩时打开新建对话页面，界面不会停在一条已经不存在
 * 的会话上。
 */
import React from 'react'

import type {
  PluginContext,
  SessionsApi,
  SessionSummary,
  Translate,
  UiWorkspaceApi,
} from '../../types/plugin'
import { requestDeleteSession } from './api'
import { deleteConfirmStore } from './confirm-store'
import { DeleteSessionButton, type DeleteSessionButtonProps } from './DeleteSessionButton'
import { DeleteSessionDialog, type DeleteSessionDialogProps } from './DeleteSessionDialog'
import type { SessionDeletableState } from './types'

/** 会话行悬停操作插槽；宿主自带的归档（order 100）与置顶（order 200）也在这里。 */
const ROW_ACTION_SLOT = 'sidebar.workspaces.session.row.action'

/** 应用级浮层插槽；宿主自带的归档确认弹窗也注册在这里。 */
const OVERLAY_SLOT = 'shell.overlay'

/**
 * 读取一条会话当前能否删除。
 * @param sessions 宿主客户端会话列表服务
 * @param sessionId 会话标识
 * @returns 运行状态与是否为当前对话
 */
function resolveSession(sessions: SessionsApi, sessionId: string): SessionDeletableState {
  const summary = sessions.list.getSnapshot().byId[sessionId]

  return {
    running: summary?.running === true,
    isCurrent: (summary?.retainedBy?.mainView ?? 0) > 0,
  }
}

/**
 * 读取一条会话所属的工作空间。
 * @param uiWorkspace 宿主工作区服务；未就绪时返回 undefined
 * @param sessionId 会话标识
 * @returns 工作空间标识；会话不属于任何工作空间（未分组）时返回 undefined
 */
function findWorkspaceId(uiWorkspace: UiWorkspaceApi | undefined, sessionId: string): string | undefined {
  const items = uiWorkspace?.workspaces?.list.getSnapshot().items ?? []

  return items.find((item) => item.sessionIds.includes(sessionId))?.workspaceId
}

/**
 * 删除当前对话后要打开哪一条会话。
 * @param sessions 宿主客户端会话列表服务
 * @param uiWorkspace 宿主工作区服务
 * @param workspaceId 被删会话所属工作空间
 * @param removedId 刚被删掉的会话标识
 * @returns 目标会话标识；该工作空间已无可用会话时返回 undefined
 */
function pickNextSession(
  sessions: SessionsApi,
  uiWorkspace: UiWorkspaceApi | undefined,
  workspaceId: string | undefined,
  removedId: string,
): string | undefined {
  const state = sessions.list.getSnapshot()
  const workspaceState = uiWorkspace?.workspaces?.list.getSnapshot()
  const workspace = workspaceState?.items.find((item) => item.workspaceId === workspaceId)
  // 会话不属于任何工作空间时退化为整个列表，避免未分组视图删完无处可去
  const memberIds = workspace?.sessionIds ?? state.ids
  const archived = new Set(workspaceState?.archivedSessionIds ?? [])

  const candidates = memberIds.flatMap((id) => {
    const summary = state.byId[id]
    // 刚删掉的会话、已归档的会话与快照里已消失的会话都不能当落点
    return id === removedId || summary === undefined || archived.has(id) ? [] : [{ id, summary }]
  })

  // 进行中的任务优先：任务还在跑，回到它比回到旧对话更有用
  const running = candidates.filter((candidate) => candidate.summary.running === true)
  const pool = running.length > 0 ? running : candidates

  // 宿主默认按活动时间倒序展示会话，最近活动的一条就是列表里最前面的那条
  let newest: { id: string; summary: SessionSummary } | undefined
  for (const candidate of pool) {
    if (newest === undefined || (candidate.summary.updatedAt ?? 0) > (newest.summary.updatedAt ?? 0)) {
      newest = candidate
    }
  }

  return newest?.id
}

/**
 * 注册会话行的删除按钮与确认弹窗。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表服务缺失时只跳过删除入口，设置页的开关仍可正常使用
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    // 当前对话被删掉后主视图仍指向它，需要工作区服务把界面切走；
    // 服务缺失时删除照常可用，只是不会自动跳转
    let uiWorkspace: UiWorkspaceApi | undefined
    scoped.inject(['uiWorkspace'], (withWorkspace) => {
      uiWorkspace = withWorkspace.uiWorkspace
      return () => {
        uiWorkspace = undefined
      }
    })

    /** 请求宿主删除并同步客户端列表；确认弹窗与行按钮共用这一份实现。 */
    const deleteSession = async (sessionId: string) => {
      // 删除前判断是不是当前对话：删除后列表快照里已经没有这一行
      const wasCurrent = resolveSession(sessions, sessionId).isCurrent
      // 删除前记下所属工作空间：删除后列表里查不到这条会话的归属
      const workspaceId = findWorkspaceId(uiWorkspace, sessionId)

      await requestDeleteSession(sessionId)
      // 磁盘上的会话已删除，但客户端快照仍留着这条：同步摘掉，行立即消失
      sessions.handleSessionRemoved?.(sessionId)

      if (!wasCurrent) return

      // 删掉的是当前对话：先回到进行中的任务或第一条对话
      const next = pickNextSession(sessions, uiWorkspace, workspaceId, sessionId)
      if (next !== undefined) {
        uiWorkspace?.openSession?.(next)
        return
      }

      // 工作空间里一条对话都不剩：打开新建对话页面
      uiWorkspace?.startSession?.(workspaceId)
    }

    ctx.slots.inject(ROW_ACTION_SLOT, () =>
      ctx.slots.register(
        {
          name: ROW_ACTION_SLOT,
          id: 'delete-session',
          // 排在宿主的归档与置顶之后，不打乱宿主按钮原有顺序
          order: 300,
          inject: () => ({
            resolveSession: (sessionId: string) => resolveSession(sessions, sessionId),
            requestConfirm: deleteConfirmStore.request,
          }),
        },
        (props: Record<string, unknown>) => (
          <DeleteSessionButton
            {...(props as unknown as Omit<DeleteSessionButtonProps, 't'>)}
            t={t}
          />
        ),
      ),
    )

    ctx.slots.inject(OVERLAY_SLOT, () =>
      ctx.slots.register(
        {
          name: OVERLAY_SLOT,
          id: 'delete-session-confirm',
          inject: () => ({
            hooks: { request: deleteConfirmStore },
            deleteSession,
            settle: deleteConfirmStore.settle,
          }),
        },
        (props: Record<string, unknown>) => (
          <DeleteSessionDialog
            {...(props as unknown as Omit<DeleteSessionDialogProps, 't'>)}
            t={t}
          />
        ),
      ),
    )
  })
}
