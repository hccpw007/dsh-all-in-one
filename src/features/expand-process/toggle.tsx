import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import {
  readExpandProcessEnabled,
  readExpandProcessMode,
  writeExpandProcessEnabled,
  writeExpandProcessMode,
  type ExpandProcessMode,
} from './expand-process'

/** 展开范围的可选项，顺序即界面上的排列顺序。 */
const MODE_OPTIONS: Array<{ value: ExpandProcessMode; labelKey: string }> = [
  { value: 'all', labelKey: 'modeAll' },
  { value: 'active', labelKey: 'modeActive' },
]

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
 * 切换总开关或展开范围后写入本地状态并刷新页面：展开状态由客户端模块在加载时读取，
 * 刷新一次才能让已经渲染的会话内容也按新状态展示。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ExpandProcessToggle({ t }: FeatureSwitchProps) {
  // 惰性读取一次本地状态，作为开关与范围的初始值；改动后整页刷新，组件不再更新它们
  const [enabled] = useState(readExpandProcessEnabled)
  const [mode] = useState(readExpandProcessMode)
  // 存储失败时不刷新页面，并在行内提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)

  /**
   * 保存一处改动并刷新页面。
   * @param apply 实际的写入动作，返回是否成功
   */
  const save = (apply: () => boolean) => {
    if (!apply()) {
      setSaveFailed(true)
      return
    }

    setSaveFailed(false)
    window.location.reload()
  }

  const handleToggle = () => save(() => writeExpandProcessEnabled(!enabled))

  const handleModeChange = (next: ExpandProcessMode) => {
    if (next === mode) return

    save(() => writeExpandProcessMode(next))
  }

  return (
    <div className="flex h-full flex-col">
      {/* 卡片容器：文字区不参与交互，开关与范围选项各自独立，不能互相嵌套 */}
      <div className="flex w-full flex-1 flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1">
        {/* 上段：文字区与开关横向并列 */}
        <div className="flex w-full items-start gap-2">
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
            {/* 切换会刷新页面：提前告知，避免用户丢失滚动位置与未保存的输入 */}
            <span className="block text-[10px] leading-[13px] text-secondary">{t('reloadHint')}</span>
          </span>
          {/* 开关轨道与滑块：开关语义由 role 与 aria-checked 表达 */}
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
        {/* 展开范围：只在开关打开后出现在卡片下方，与自动压缩的阈值行同位置 */}
        {enabled ? (
          <div className="flex items-center gap-2 pl-7" role="radiogroup" aria-label={t('modeLabel')}>
            {/* 范围标签 */}
            <span className="text-[11px] leading-[16px] text-secondary">{t('modeLabel')}</span>
            {MODE_OPTIONS.map((option) => {
              const checked = option.value === mode

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => handleModeChange(option.value)}
                  className={cn(
                    'rounded-md border px-1.5 py-0 text-[11px] leading-[16px] transition',
                    checked
                      ? 'border-brand bg-base text-brand'
                      : 'border-line4 bg-layer1 text-secondary hover:text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
                  )}
                >
                  {t(option.labelKey)}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
      {/* 存储失败提示：说明开关状态没有保存 */}
      {saveFailed ? (
        <p className="mt-0.5 text-[12px] leading-[16px] text-danger">{t('saveFailed')}</p>
      ) : null}
    </div>
  )
}
