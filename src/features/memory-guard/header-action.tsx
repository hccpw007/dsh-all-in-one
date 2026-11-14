/**
 * 会话头部右上角的「回收并重建」按钮。
 *
 * 一点即走完整动作：先做一次轻量回收，再进入 5 秒倒计时重建页面；倒计时浮层
 * 上可以取消。挂在 `conversation.session.header.utilities` 列表末尾，与宿主的
 * 工具按钮同排，不占用底部状态栏的位置。开关关闭后按钮随之隐藏：不需要它的人
 * 不该在每一屏的头部多看到一个刷新图标。
 */
import React, { useState } from 'react'

import type { Translate } from '../../types/plugin'
import { useMemoryGuardEnabled } from './enabled'
import { activeMemoryGuard } from './guard'

/** 刷新图标：环形箭头，表达「回收后重载」。 */
function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? 'animate-spin' : undefined}
    >
      <path d="M13 8a5 5 0 1 1-1.6-3.7" />
      <path d="M13 2.5V5h-2.5" />
    </svg>
  )
}

/** 按钮收到的 props。 */
export interface MemoryGuardActionProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 渲染「回收并重建」按钮。
 * @param props 翻译函数
 */
export function MemoryGuardAction({ t }: MemoryGuardActionProps) {
  // 开关状态：关闭后不再渲染这个入口
  const enabled = useMemoryGuardEnabled()
  // 回收与倒计时期间禁用按钮并转动图标，避免连点叠加两次重建
  const [working, setWorking] = useState(false)

  /** 先轻量回收，再走重建倒计时；失败只记日志，页面保持原样。 */
  const handleClick = async (): Promise<void> => {
    const guard = activeMemoryGuard()
    if (guard === undefined) {
      console.warn('[memory-guard] 内存守护尚未就绪，忽略本次回收')

      return
    }

    setWorking(true)

    try {
      await guard.reclaimNow()
      const outcome = await guard.rebuildNow()
      if (!outcome.rebuilt) {
        console.warn('[memory-guard] 手动重建未执行:', outcome.reason, outcome.detail)
      }
    } catch (error) {
      console.error('[memory-guard] 回收并重建失败:', error)
    } finally {
      setWorking(false)
    }
  }

  // 开关关闭后整块不渲染，头部工具区不会留下空位
  if (!enabled) return null

  return (
    <button
      type="button"
      aria-label={t('rebuildAction')}
      title={t('rebuildAction')}
      disabled={working}
      onClick={() => void handleClick()}
      className="flex h-6 w-6 items-center justify-center rounded-md border-0 bg-transparent p-0 text-secondary transition hover:bg-layer2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default disabled:opacity-50"
    >
      <RefreshIcon spinning={working} />
    </button>
  )
}
