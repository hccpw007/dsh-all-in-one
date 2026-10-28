import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { readDeleteSessionEnabled, writeDeleteSessionEnabled } from './delete-session'

/** 开关入口图标：垃圾桶，表达删除会话。 */
function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 4h4" />
      <path d="M9 7v11" />
      <path d="M15 7v11" />
      <path d="M6 7h12l-1 13H7L6 7Z" />
    </svg>
  )
}

/**
 * 「删除会话」开关入口。
 *
 * 切换后写入本地状态并刷新页面：删除按钮由会话行在渲染时读取该状态决定
 * 是否出现，刷新一次才能让已经打开的列表也按新状态展示。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function DeleteSessionToggle({ t }: FeatureSwitchProps) {
  // 惰性读取一次本地状态，作为开关的初始位置
  const [enabled, setEnabled] = useState(readDeleteSessionEnabled)
  // 存储失败时不刷新页面，并在行内提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)

  const handleToggle = () => {
    const next = !enabled

    if (!writeDeleteSessionEnabled(next)) {
      setSaveFailed(true)
      return
    }

    setSaveFailed(false)
    setEnabled(next)
    window.location.reload()
  }

  return (
    <div className="flex h-full flex-col">
      {/* 开关入口：撑满卡片宽度与行高、整块可点击，开关语义由 role 与 aria-checked 表达 */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={handleToggle}
        className="flex w-full flex-1 items-center gap-3 rounded-xl border border-line4 bg-layer1 px-4 py-3.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
          <TrashIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 开关标题 */}
          <span className="block text-[13px] font-medium leading-5 text-primary">{t('title')}</span>
          {/* 开关用途说明 */}
          <span className="mt-1 block text-[12px] leading-[18px] text-secondary">
            {t('description')}
          </span>
        </span>
        {/* 开关轨道与滑块，仅作视觉呈现，交互由上层的按钮承担 */}
        <span
          aria-hidden="true"
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition',
            enabled ? 'bg-brand' : 'bg-line2',
          )}
        >
          <span
            className={cn(
              'h-4 w-4 rounded-full bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </span>
      </button>
      {/* 存储失败提示：说明开关状态没有保存 */}
      {saveFailed ? (
        <p className="mt-1.5 text-[12px] leading-[18px] text-danger">{t('saveFailed')}</p>
      ) : null}
    </div>
  )
}
