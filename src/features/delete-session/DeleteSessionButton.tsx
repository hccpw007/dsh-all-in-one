/**
 * 会话行上的删除按钮。
 *
 * 位置与宿主自带的「归档 / 置顶」按钮一致（会话行的悬停操作区），外观也
 * 对齐宿主的 16px 图标按钮；是否显示由「删除会话」开关决定。
 */
import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { Translate } from '../../types/plugin'
import { readDeleteSessionEnabled } from './delete-session'
import type { SessionDeletableState } from './types'

/** 会话行按钮收到的 props：t 由 feature 注入，其余来自插槽。 */
export interface DeleteSessionButtonProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 插槽为当前行注入的会话标识。 */
  sessionId?: string
  /** 由客户端扩展注入：读取该会话能否删除。 */
  resolveSession?: (sessionId: string) => SessionDeletableState
  /** 由客户端扩展注入：请求宿主删除该会话。 */
  deleteSession?: (sessionId: string) => Promise<void>
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
 * 点击立即请求宿主删除磁盘上的会话目录；成功后宿主列表快照会丢掉这一行，
 * 按钮随行一起消失。运行中的会话与当前正在浏览的对话不提供入口。
 * @param props 插槽注入的会话信息与删除动作
 */
export function DeleteSessionButton({
  t,
  sessionId,
  resolveSession,
  deleteSession,
}: DeleteSessionButtonProps) {
  // 请求进行中禁用按钮，避免同一会话被并发删除
  const [pending, setPending] = useState(false)
  // 删除失败后图标转为错误色，提示这一行可以重试
  const [failed, setFailed] = useState(false)

  // 开关关闭时不渲染任何内容，会话行保持宿主原样
  if (!readDeleteSessionEnabled()) return null
  if (sessionId === undefined || deleteSession === undefined) return null

  const state = resolveSession?.(sessionId)
  // 运行中的会话仍由宿主持有写句柄，删文件会破坏这次运行；当前打开的对话
  // 删除后界面会停在一条不存在的会话上，因此这两种情况都不给入口
  if (state !== undefined && (state.running || state.isCurrent)) return null

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (pending) return

    setPending(true)
    try {
      await deleteSession(sessionId)
      setFailed(false)
    } catch (error) {
      console.error('[delete-session] 删除会话失败:', error)
      setFailed(true)
      const reason = error instanceof Error ? error.message : String(error)
      window.alert(`${t('deleteFailed')}：${reason}`)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={pending ? t('deleting') : t('action')}
      title={t('action')}
      disabled={pending}
      onClick={(event) => {
        void handleClick(event)
      }}
      className={cn(
        'inline-flex h-4 w-4 flex-none cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default disabled:opacity-50',
        failed && 'text-danger hover:text-danger',
      )}
    >
      <TrashGlyph />
    </button>
  )
}
