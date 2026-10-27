import React from 'react'

import type { FeatureEntryProps } from '../../shell/registry'

/** 技能包入口图标：对话气泡与调色板，表达为不同对话预设技能包。 */
function PowerPackIcon() {
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
      <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="14" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
    </svg>
  )
}

/**
 * 「技能包」在 All In One 网格中的入口。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function PowerPackEntry({ t, open }: FeatureEntryProps) {
  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* 入口图标 */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
        <PowerPackIcon />
      </span>
      {/* 入口标题与说明 */}
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
