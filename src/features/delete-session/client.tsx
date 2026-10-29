/**
 * 「删除会话」的客户端扩展。
 *
 * 两个插槽配合完成一次删除：
 *   - 会话行悬停操作区（`sidebar.workspaces.session.row.action`）里的删除按钮，
 *     点击只写入待确认请求；
 *   - 宿主浮层（`shell.overlay`）里的确认弹窗，用户确认后才请求宿主删除磁盘
 *     上的会话记录，并让客户端列表立刻丢掉这一行。
 *
 * 当前正在浏览的会话也能删除；删掉它之后由宿主的工作区服务打开默认新会话
 * 页面，界面不会停在一条已经不存在的会话上。
 */
import React from 'react'

import type { PluginContext, SessionsApi, Translate } from '../../types/plugin'
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
 * 注册会话行的删除按钮与确认弹窗。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表服务缺失时只跳过删除入口，设置页的开关仍可正常使用
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    // 当前对话被删掉后主视图仍指向它，需要工作区的「新会话」入口把界面切走；
    // 服务缺失时删除照常可用，只是不会自动切到新会话页面
    let openNewSession: (() => void) | undefined
    scoped.inject(['uiWorkspace'], (withWorkspace) => {
      const uiWorkspace = withWorkspace.uiWorkspace
      if (uiWorkspace?.startSession === undefined) return

      openNewSession = () => uiWorkspace.startSession?.()
      return () => {
        openNewSession = undefined
      }
    })

    /** 请求宿主删除并同步客户端列表；确认弹窗与行按钮共用这一份实现。 */
    const deleteSession = async (sessionId: string) => {
      // 删除前判断是不是当前对话：删除后列表快照里已经没有这一行
      const wasCurrent = resolveSession(sessions, sessionId).isCurrent

      await requestDeleteSession(sessionId)
      // 磁盘上的会话已删除，但客户端快照仍留着这条：同步摘掉，行立即消失
      sessions.handleSessionRemoved?.(sessionId)
      // 删掉的是当前对话：切到默认新会话页面，避免界面停在一条不存在的会话上
      if (wasCurrent) openNewSession?.()
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
