/**
 * 「删除会话」的客户端扩展。
 *
 * 宿主的会话行支持在悬停操作区插槽里追加按钮（归档、置顶就在那里）。这里
 * 注册一个删除按钮，点击后请求插件宿主侧路由删掉磁盘上的会话目录，并让
 * 客户端会话列表立刻丢掉这一行。
 */
import React from 'react'

import type { PluginContext, SessionsApi, Translate } from '../../types/plugin'
import { requestDeleteSession } from './api'
import { DeleteSessionButton, type DeleteSessionButtonProps } from './DeleteSessionButton'
import type { SessionDeletableState } from './types'

/** 会话行悬停操作插槽；宿主自带的归档（order 100）与置顶（order 200）也在这里。 */
const ROW_ACTION_SLOT = 'sidebar.workspaces.session.row.action'

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
 * 注册会话行的删除按钮。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表服务缺失时只跳过删除按钮，设置页的开关仍可正常使用
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    ctx.slots.inject(ROW_ACTION_SLOT, () =>
      ctx.slots.register(
        {
          name: ROW_ACTION_SLOT,
          id: 'delete-session',
          // 排在宿主的归档与置顶之后，不打乱宿主按钮原有顺序
          order: 300,
          inject: () => ({
            resolveSession: (sessionId: string) => resolveSession(sessions, sessionId),
            deleteSession: async (sessionId: string) => {
              await requestDeleteSession(sessionId)
              // 磁盘上的会话已删除，但客户端快照仍留着这条：同步摘掉，行立即消失
              sessions.handleSessionRemoved?.(sessionId)
            },
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
  })
}
