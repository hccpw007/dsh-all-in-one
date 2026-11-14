import React, { useState } from 'react'

import { cn } from '../../common/cn'
import { CardChevron } from '../../components/CardChevron'
import type { FeatureEntryProps } from '../../shell/registry'
import { activeMemoryGuard } from './guard'
import { MemoryIcon } from './memory-icon'
import { readMemoryGuardSettings, updateMemoryGuardSettings } from './storage'

/**
 * 「内存守护」在 All In One 网格中的入口。
 *
 * 卡片只留标题、说明、开关与设置入口：间隔、阈值、读数与手动按钮都收在设置页，
 * 网格里不必为一张卡铺开一串参数。开关状态与设置页共用同一份 localStorage 配置；
 * 从设置页返回网格时卡片会重新挂载，读到的就是最新值。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开设置页
 */
export function MemoryGuardEntry({ t, open }: FeatureEntryProps) {
  // 开关状态；存储不可用时拿到的是默认值，不影响卡片渲染
  const [enabled, setEnabled] = useState(() => readMemoryGuardSettings().enabled)

  /** 切换开关并立即重排定时器：关闭后定时器仍在跑，但每次检查都会因未启用而跳过。 */
  const handleToggle = (): void => {
    const next = updateMemoryGuardSettings({ enabled: !enabled })
    setEnabled(next.enabled)
    activeMemoryGuard()?.reschedule()
  }

  return (
    // 卡片容器：主体按钮、开关与设置按钮是并列的交互区，不能互相嵌套
    <div className="flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 transition hover:bg-layer2">
      {/* 卡片主体：进入设置页 */}
      <button
        type="button"
        onClick={open}
        className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <MemoryIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 入口标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 入口描述：说明定时回收与自动重建的作用 */}
          <span className="block text-[11px] leading-[14px] text-secondary">
            {t('description')}
          </span>
        </span>
      </button>
      {/* 右侧一列：启用开关在上，设置入口在下，两者各自独立 */}
      <div className="flex shrink-0 flex-col items-center justify-between gap-1 self-stretch">
        {/* 启用开关：关闭后定时检查不再做任何回收 */}
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
        {/* 设置入口：进入设置页调整间隔、阈值并查看读数 */}
        <button
          type="button"
          onClick={open}
          aria-label={t('settingsAction')}
          title={t('settingsAction')}
          className="flex shrink-0 items-center justify-center gap-0.5 self-end rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {t('settingsAction')}
          <CardChevron />
        </button>
      </div>
    </div>
  )
}
