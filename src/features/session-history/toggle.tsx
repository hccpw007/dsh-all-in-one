import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import {
  readSessionHistoryEnabled,
  readShowInputsEnabled,
  writeSessionHistoryEnabled,
  writeShowInputsEnabled,
} from './storage'

/** 主开关图标：左栏被高亮的窗口，表达「历史挪到左侧」。 */
function LayoutLeftIcon() {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  )
}

/** 第二开关图标：三行文本，表达「展示对话内容」。 */
function TextLinesIcon() {
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
      <path d="M4 12h10" />
      <path d="M4 17h13" />
    </svg>
  )
}

/** 单行开关的入参。 */
interface SwitchRowProps {
  /** 开关标题 */
  title: string
  /** 开关用途说明 */
  description: string
  /** 当前是否打开 */
  checked: boolean
  /** 点击切换 */
  onToggle: () => void
  /** 行首图标 */
  icon: React.ReactNode
}

/**
 * 一行开关：标题、说明、轨道。
 *
 * 两个开关共用同一套外观，上下紧贴排在同一张卡片里；
 * 点击区域是整行，开关语义由 role 与 aria-checked 表达。
 * @param props 行内容与点击回调
 */
function SwitchRow({ title, description, checked, onToggle, icon }: SwitchRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full flex-1 items-center gap-3 px-4 py-3.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* 行首图标 */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
        {icon}
      </span>
      {/* 标题与说明 */}
      <span className="min-w-0 flex-1">
        {/* 开关标题 */}
        <span className="block text-[13px] font-medium leading-5 text-primary">{title}</span>
        {/* 开关用途说明 */}
        <span className="mt-1 block text-[12px] leading-[18px] text-secondary">{description}</span>
      </span>
      {/* 轨道与滑块，仅作视觉呈现，交互由整行按钮承担 */}
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition',
          checked ? 'bg-brand' : 'bg-line2',
        )}
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full bg-base shadow transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}

/**
 * 「会话历史左侧」的入口：上下相连的两个开关。
 *
 * 切换后写入本地状态并刷新页面：客户端扩展在模块加载时读取一次状态，
 * 刷新一次才能让已经打开的会话按新状态显示。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function SessionHistoryToggle({ t }: FeatureSwitchProps) {
  const [enabled, setEnabled] = useState(readSessionHistoryEnabled)
  const [showInputs, setShowInputs] = useState(readShowInputsEnabled)
  // 存储失败时不刷新页面，并在卡片下方提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)

  /**
   * 写入状态并在成功后刷新页面。
   * @param write 写入函数
   * @param next 目标状态
   * @param accept 成功后的本地状态更新
   */
  const commit = (write: (value: boolean) => boolean, next: boolean, accept: () => void) => {
    if (!write(next)) {
      setSaveFailed(true)
      return
    }

    setSaveFailed(false)
    accept()
    window.location.reload()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-line4 bg-layer1">
        <SwitchRow
          title={t('title')}
          description={t('description')}
          checked={enabled}
          icon={<LayoutLeftIcon />}
          onToggle={() =>
            commit(writeSessionHistoryEnabled, !enabled, () => setEnabled(!enabled))
          }
        />
        {/* 第一个开关打开后才出现第二个，两个开关紧贴，用一条分隔线区分 */}
        {enabled ? (
          <>
            <div className="h-px shrink-0 bg-line4" />
            <SwitchRow
              title={t('showInputs')}
              description={t('showInputsDescription')}
              checked={showInputs}
              icon={<TextLinesIcon />}
              onToggle={() =>
                commit(writeShowInputsEnabled, !showInputs, () => setShowInputs(!showInputs))
              }
            />
          </>
        ) : null}
      </div>
      {/* 存储失败提示：说明开关状态没有保存 */}
      {saveFailed ? (
        <p className="mt-1.5 text-[12px] leading-[18px] text-danger">{t('saveFailed')}</p>
      ) : null}
    </div>
  )
}
