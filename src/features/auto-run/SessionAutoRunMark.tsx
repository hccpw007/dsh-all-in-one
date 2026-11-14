/**
 * 侧边栏会话行左侧的「全自动」标识。
 *
 * 宿主把 `sidebar.session.row.leading` 插槽渲染在会话标题之前；只有开启全自动的
 * 会话才画这道闪电，其余会话返回 null，行内布局与间距完全保持原样。
 */
import React, { useEffect } from 'react'

import { ensureEnabledSessionsLoaded, useAutoRunEnabled } from './session-state'

/** 标识宽度：与 14px 高度保持 1:2，呈窄长条而不是方形图标。 */
const MARK_WIDTH = 7

/** 标识高度：与 13px 的会话标题同高，视觉上与标题首行对齐。 */
const MARK_HEIGHT = 14

/** 标识颜色：警示黄，在浅灰侧边栏上足够醒目，又不至于盖过标题文字。 */
const MARK_COLOR = '#f0a020'

/**
 * 渲染会话行前的闪电标识。
 * @param props sessionId 为宿主传入的当前行会话标识
 */
export function SessionAutoRunMark({ sessionId }: { sessionId?: string }) {
  const enabled = useAutoRunEnabled(sessionId)

  useEffect(() => {
    // 会话行是页面里最先挂载的一批组件，在这里触发一次全量读取即可覆盖整个列表
    ensureEnabledSessionsLoaded()
  }, [])

  if (!enabled) return null

  return (
    // 右侧留 4px 与标题分隔；固定宽高避免行内文字随标识出现而位移
    <span aria-hidden="true" className="mr-1 flex h-[14px] w-[7px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 10 20" width={MARK_WIDTH} height={MARK_HEIGHT} fill={MARK_COLOR}>
        {/* 窄长条闪电：上下两折，宽度只有高度的一半，14px 高度下轮廓仍然清晰 */}
        <path d="M5.2 0 L2 12 H4 L3 20 L7.6 8 H5.2 Z" />
      </svg>
    </span>
  )
}
