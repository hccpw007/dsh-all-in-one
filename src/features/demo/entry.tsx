import React from 'react'

import type { FeatureEntryProps } from '../../shell/registry'

/** 示例功能的入口图标，由功能自己决定入口的视觉元素。 */
function DemoIcon() {
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
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <path d="M14 17.5h7M17.5 14v7" />
    </svg>
  )
}

/**
 * 示例功能在「All In One」网格中的入口。
 *
 * 入口的排版、图标与交互全部由功能自己决定，外壳只传入翻译函数与打开动作。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function DemoEntry({ t, open }: FeatureEntryProps) {
  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* 入口图标 */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
        <DemoIcon />
      </span>
      {/* 入口标题与一句话描述 */}
      <span className="min-w-0">
        {/* 入口标题 */}
        <span className="block text-[13px] font-medium leading-5 text-primary">{t('title')}</span>
        {/* 入口描述 */}
        <span className="mt-1 block text-[12px] leading-[18px] text-secondary">
          {t('description')}
        </span>
      </span>
    </button>
  )
}
