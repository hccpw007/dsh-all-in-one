import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { readPromptOptimizeEnabled, writePromptOptimizeEnabled } from './storage'

/** 开关入口图标：文字行加星芒，与输入框里的按钮同一套图形语言。 */
function OptimizeIcon() {
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
      <path d="M4 7h10M4 12h7M4 17h5" />
      <path d="M17.6 4.8l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" />
    </svg>
  )
}

/**
 * 「提示词优化」开关入口。
 *
 * 开关只决定输入框旁是否装上那枚按钮：注册发生在插件加载时，切换后刷新页面
 * 才能让已经打开的会话也按新状态显示。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function PromptOptimizeToggle({ t }: FeatureSwitchProps) {
  // 惰性读取一次本地状态，作为开关的初始位置
  const [enabled, setEnabled] = useState(readPromptOptimizeEnabled)
  // 存储失败时不刷新页面，并在行内提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)

  const handleToggle = () => {
    const next = !enabled

    if (!writePromptOptimizeEnabled(next)) {
      setSaveFailed(true)
      return
    }

    setSaveFailed(false)
    setEnabled(next)
    window.location.reload()
  }

  return (
    <div className="flex h-full flex-col">
      {/* 卡片容器：只有右侧开关参与交互，点标题与说明不切换，避免浏览设置时误触 */}
      <div className="flex w-full flex-1 items-center gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1">
        {/* 入口图标 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <OptimizeIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 开关标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 开关用途说明 */}
          <span className="line-clamp-2 block text-[11px] leading-[14px] text-secondary">
            {t('description')}
          </span>
        </span>
        {/* 开关轨道与滑块：整卡唯一的交互区，开关语义由 role 与 aria-checked 表达 */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={t('title')}
          onClick={handleToggle}
          className={cn(
            'flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition',
            enabled ? 'bg-brand' : 'bg-line2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-4 w-4 aio-switch bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
      {/* 存储失败提示：说明开关状态没有保存 */}
      {saveFailed ? (
        <p className="mt-0.5 text-[12px] leading-[16px] text-danger">{t('saveFailed')}</p>
      ) : null}
    </div>
  )
}
