import React from 'react'

import { CardChevron } from '../../components/CardChevron'
import type { FeatureEntryProps } from '../../shell/registry'

/** 技能包入口图标：对话气泡与调色板，表达为不同对话预设技能包。 */
function PowerPackIcon() {
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
      <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="14" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
    </svg>
  )
}

/**
 * 「技能包」在 All In One 网格中的入口。
 *
 * 卡片主体点击进入设置页面，右下角另有「设置」入口，两个入口行为一致。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function PowerPackEntry({ t, open }: FeatureEntryProps) {
  return (
    // 卡片容器：主体按钮与右下角的设置按钮并列，不能互相嵌套
    <div className="flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 transition hover:bg-layer2">
      {/* 卡片主体：进入设置页面。preflight 关闭，必须清掉浏览器默认的按钮底色与内边距 */}
      <button
        type="button"
        onClick={open}
        className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <PowerPackIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 入口标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 入口描述 */}
          <span className="block text-[11px] leading-[14px] text-secondary">
            {t('description')}
          </span>
        </span>
      </button>
      {/* 右下角设置入口：与项目记忆卡片同一位置，箭头表明点进去还有一层页面 */}
      <button
        type="button"
        onClick={open}
        aria-label={t('title')}
        title={t('title')}
        className="flex shrink-0 items-center justify-center gap-0.5 self-end rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {t('settingsAction')}
        <CardChevron />
      </button>
    </div>
  )
}
