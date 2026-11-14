import React, { useEffect, useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { loadAutoRunSettings, saveAutoRunDefaultMode } from './api'
import { readAutoRunButtonEnabled, writeAutoRunButtonEnabled } from './storage'
import type { AutoRunDefaultMode } from './types'

/** 默认值的可选项，顺序即界面上的排列顺序。 */
const MODE_OPTIONS: Array<{ value: AutoRunDefaultMode; labelKey: string; hintKey: string }> = [
  { value: 'off', labelKey: 'modeOff', hintKey: 'modeOffHint' },
  { value: 'on', labelKey: 'modeOn', hintKey: 'modeOnHint' },
  { value: 'last', labelKey: 'modeLast', hintKey: 'modeLastHint' },
  { value: 'workspace', labelKey: 'modeWorkspace', hintKey: 'modeWorkspaceHint' },
]

/** 开关入口图标：与输入框按钮同一道雷电，让两处一眼认作同一功能。 */
function AutoRunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      {/* 雷电：上宽下尖，向右折一次 */}
      <path d="M13.6 2 4.8 13.4h5.5L10.2 22l8.9-11.6h-5.6z" />
    </svg>
  )
}

/**
 * 「全自动执行」的设置页入口。
 *
 * 这里是功能的总入口：总开关决定输入框右侧是否显示「全自动」按钮；下方的默认值
 * 选项决定新对话该按钮的初始状态。切换总开关会刷新页面，已打开页面的 composer
 * 才会换上或撤掉按钮；切换默认值同样刷新，让插槽组件按新默认值重新求值。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function AutoRunButtonToggle({ t }: FeatureSwitchProps) {
  // 惰性读取一次本地状态，作为总开关的初始位置
  const [enabled] = useState(readAutoRunButtonEnabled)
  // 默认值来自宿主配置：null 表示还没读回来，此时不显示选项、也不允许切换
  const [mode, setMode] = useState<AutoRunDefaultMode | null>(null)
  // 保存进行中，避免连点写出交叉的状态
  const [pending, setPending] = useState(false)
  // 存储失败时不刷新页面，并在行内提示，避免用户误以为已经保存
  const [saveFailed, setSaveFailed] = useState(false)
  // 默认值读取失败：选项区显示提示，不给出一组无法保存的按钮
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let active = true

    void loadAutoRunSettings()
      .then((settings) => {
        if (active) setMode(settings.defaultMode)
      })
      .catch((error: unknown) => {
        console.error('[auto-run] 读取默认值选项失败:', error)
        if (active) setLoadFailed(true)
      })

    return () => {
      active = false
    }
  }, [])

  const handleToggle = () => {
    const next = !enabled

    if (!writeAutoRunButtonEnabled(next)) {
      setSaveFailed(true)

      return
    }

    setSaveFailed(false)
    window.location.reload()
  }

  /**
   * 保存默认值并刷新页面。
   * @param next 目标默认值来源
   */
  const handleModeChange = (next: AutoRunDefaultMode) => {
    if (next === mode || pending) return

    setPending(true)
    setSaveFailed(false)

    void saveAutoRunDefaultMode(next)
      .then((settings) => {
        setMode(settings.defaultMode)
        setPending(false)
        window.location.reload()
      })
      .catch((error: unknown) => {
        console.error('[auto-run] 保存默认值选项失败:', error)
        setSaveFailed(true)
        setPending(false)
      })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 卡片容器：文字区不参与交互，开关与默认值选项各自独立，不能互相嵌套 */}
      <div className="flex w-full flex-1 flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1">
        {/* 上段：文字区与总开关横向并列 */}
        <div className="flex w-full items-start gap-2">
          {/* 入口图标 */}
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
            <AutoRunIcon />
          </span>
          {/* 入口标题与说明 */}
          <span className="min-w-0 flex-1">
            {/* 开关标题 */}
            <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
            {/* 开关用途说明：入口位置、会话级语义与下方默认值 */}
            <span className="block text-[11px] leading-[14px] text-secondary">
              {t('description')}
            </span>
          </span>
          {/* 开关轨道与滑块：总入口的开关语义由 role 与 aria-checked 表达 */}
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
        {/* 默认值选项：只在总开关打开且读回配置后出现；与上方文字左对齐，标签只留给读屏 */}
        {enabled && mode !== null ? (
          <div
            className="flex flex-wrap items-center gap-1 pl-7"
            role="radiogroup"
            aria-label={t('modeGroupLabel')}
          >
            {MODE_OPTIONS.map((option) => {
              const checked = option.value === mode

              return (
                // 每个选项一个单选按钮：点击后写入宿主并刷新页面
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  title={t(option.hintKey)}
                  disabled={pending}
                  onClick={() => handleModeChange(option.value)}
                  className={cn(
                    'shrink-0 whitespace-nowrap rounded-md border px-1 py-0 text-[11px] leading-[16px] transition',
                    checked
                      ? 'border-brand bg-base text-brand'
                      : 'border-line4 bg-layer1 text-secondary hover:text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
                    pending ? 'opacity-60' : '',
                  )}
                >
                  {t(option.labelKey)}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
      {/* 存储或读取失败提示：说明改动没有保存或默认值不可用 */}
      {saveFailed ? (
        <p className="mt-0.5 text-[12px] leading-[16px] text-danger">{t('saveFailed')}</p>
      ) : loadFailed ? (
        <p className="mt-0.5 text-[12px] leading-[16px] text-danger">{t('loadFailed')}</p>
      ) : null}
    </div>
  )
}
