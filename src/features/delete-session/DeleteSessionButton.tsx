/**
 * 会话行上的删除按钮。
 *
 * 位置与宿主自带的「归档 / 置顶」按钮一致（会话行的悬停操作区），外观也
 * 对齐宿主的 16px 图标按钮；是否显示由「删除会话」开关决定。
 *
 * 按钮本身不删除任何东西：点击只写入一次待确认请求，真正的删除由确认弹窗
 * （DeleteSessionDialog）在用户点「删除」后执行。
 */
import React from 'react'

import type { Translate } from '../../types/plugin'
import type { DeleteConfirmRequest } from './confirm-store'
import { readDeleteSessionEnabled } from './delete-session'
import type { SessionDeletableState } from './types'

/** 会话行按钮收到的 props：t 由 feature 注入，其余来自插槽。 */
export interface DeleteSessionButtonProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 插槽为当前行注入的会话标识。 */
  sessionId?: string
  /** 插槽为当前行注入的会话标题，用于确认弹窗指名。 */
  displayTitle?: string
  /** 由客户端扩展注入：读取该会话能否删除。 */
  resolveSession?: (sessionId: string) => SessionDeletableState
  /** 由客户端扩展注入：写入一次待确认请求。 */
  requestConfirm?: (request: DeleteConfirmRequest) => void
}

/** 删除图标：垃圾桶，尺寸与宿主的行内图标一致。 */
function TrashGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5h11" />
      <path d="M6.5 2.75h3" />
      <path d="M4 4.5 4.6 13h6.8L12 4.5" />
      <path d="M6.6 6.8v3.6" />
      <path d="M9.4 6.8v3.6" />
    </svg>
  )
}

/**
 * 会话行的删除按钮。
 *
 * 点击后只发起确认请求；运行中的会话仍由宿主持有写句柄，不提供入口。
 * 当前正在浏览的对话可以删除，删除后由客户端扩展切到默认新会话页面。
 * @param props 插槽注入的会话信息与确认请求入口
 */
export function DeleteSessionButton({
  t,
  sessionId,
  displayTitle,
  resolveSession,
  requestConfirm,
}: DeleteSessionButtonProps) {
  // 开关关闭时不渲染任何内容，会话行保持宿主原样
  if (!readDeleteSessionEnabled()) return null
  if (sessionId === undefined || requestConfirm === undefined) return null

  const state = resolveSession?.(sessionId)
  // 运行中的会话仍由宿主持有写句柄，删文件会破坏这次运行，因此不给入口
  if (state !== undefined && state.running) return null

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 行本身可点击进入会话，按钮只发起确认请求
    event.stopPropagation()
    requestConfirm({ sessionId, title: displayTitle ?? sessionId })
  }

  return (
    <button
      type="button"
      aria-label={t('action')}
      title={t('action')}
      onClick={handleClick}
      className="inline-flex h-4 w-4 flex-none cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-secondary transition hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <TrashGlyph />
    </button>
  )
}
