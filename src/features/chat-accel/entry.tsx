import React from 'react'

import type { FeatureEntryProps } from '../../shell/registry'

/** 入口图标：闪电，表达加速。 */
function BoltIcon() {
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
      <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z" />
    </svg>
  )
}

/**
 * 「对话加速」在 All In One 网格中的入口。
 *
 * 卡片整体是一个按钮：点击任意位置进入设置页面，条目选择全部在页面内完成。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function ChatAccelEntry({ t, open }: FeatureEntryProps) {
  return (
    // 整张卡片即点击区；preflight 关闭，必须清掉浏览器默认的按钮底色与内边距
    <button
      type="button"
      onClick={open}
      className="flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* 入口图标 */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
        <BoltIcon />
      </span>
      {/* 入口标题与说明 */}
      <span className="min-w-0 flex-1">
        {/* 入口标题 */}
        <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
        {/* 入口描述 */}
        <span className="block text-[11px] leading-[14px] text-secondary">{t('description')}</span>
      </span>
    </button>
  )
}
