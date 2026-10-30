import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { readExpandProcessEnabled, writeExpandProcessEnabled } from './expand-process'

/** 开关入口图标：上下双向箭头，表达展开与收起。 */
function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 9 5-5 5 5" />
      <path d="m7 15 5 5 5-5" />
    </svg>
  )
}

/**
 * 「展开过程」开关入口。
 *
 * 切换后写入本地状态并刷新页面：展开状态由客户端模块在加载时读取，
 * 刷新一次才能让已经渲染的会话内容也按新状态展示。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ExpandProcessToggle({ t }: FeatureSwitchProps) {
  // 惰性读取一次本地状态，作为开关的初始位置
  const [enabled, setEnabled] = useState(readExpandProcessEnabled)
  // 存储失败时不刷新页面，并在行内提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)

  const handleToggle = () => {
    const next = !enabled

    if (!writeExpandProcessEnabled(next)) {
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
        className="flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <ExpandIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 开关标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 开关用途说明 */}
          <span className="block text-[11px] leading-[14px] text-secondary">
            {t('description')}
          </span>
        </span>
        {/* 开关轨道与滑块，仅作视觉呈现，交互由上层的按钮承担 */}
        <span
          aria-hidden="true"
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 items-center aio-switch transition',
            enabled ? 'bg-brand' : 'bg-line2',
          )}
        >
          <span
            className={cn(
              'h-4 w-4 aio-switch bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </span>
      </button>
      {/* 存储失败提示：说明开关状态没有保存 */}
      {saveFailed ? (
        <p className="mt-0.5 text-[12px] leading-[16px] text-danger">{t('saveFailed')}</p>
      ) : null}
    </div>
  )
}
