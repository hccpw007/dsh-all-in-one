import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { loadDesktopCookieSettings, saveDesktopCookieSettings } from './api'
import type { DesktopCookieSettings } from './types'

/** 阈值允许的最小值。 */
const MIN_THRESHOLD = 1

/** 阈值允许的最大值，与宿主侧规范化口径一致。 */
const MAX_THRESHOLD = 100

/** 保留条数允许的最小值：0 表示清理时全部删掉。 */
const MIN_RETAIN = 0

/** 数字输入框样式，宽度按三位数字预留，紧挨在开关轨道下方。 */
const INPUT_CLASS =
  'w-12 rounded-md border border-line4 bg-base px-1 py-0 text-[11px] text-primary outline-none focus:border-brand'

/** 一个条数输入行：标签、输入框与单位。 */
interface CountFieldProps {
  /** 输入行标签，如「阈值」「保留」。 */
  label: string
  /** 输入框单位，如「条」。 */
  unit: string
  /** 输入框的当前草稿值。 */
  value: string
  /** 草稿变化时回写。 */
  onChange: (value: string) => void
  /** 失焦或回车时提交。 */
  onCommit: () => void
}

/**
 * 渲染一个条数输入行。
 * @param props 字段属性
 */
function CountField({ label, unit, value, onChange, onCommit }: CountFieldProps) {
  return (
    <label className="flex items-center gap-1">
      {/* 输入行标签 */}
      <span className="text-[11px] leading-[16px] text-secondary">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={MIN_RETAIN}
        max={MAX_THRESHOLD}
        step={1}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onCommit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onCommit()
        }}
        className={INPUT_CLASS}
      />
      {/* 输入框单位 */}
      <span className="text-[11px] leading-[16px] text-secondary">{unit}</span>
    </label>
  )
}

/** 开关入口图标：一块带碎屑的饼干，表达清理过期 Cookie。 */
function CookieIcon() {
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
      <path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3.5 3.5 0 0 0 4 4 3.5 3.5 0 0 0 5 5Z" />
      <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="15.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * 「桌面版 Cookie 清理」开关入口。
 *
 * 开关、阈值与保留条数都存在宿主侧：清理由宿主在启动阶段执行，浏览器端只负责编辑。
 * 开关打开后展开两个输入框，失焦或回车才提交，避免逐字触发请求。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function DesktopCookieToggle({ t }: FeatureSwitchProps) {
  // 当前设置；null 表示仍在读取
  const [settings, setSettings] = useState<DesktopCookieSettings | null>(null)
  // 阈值输入草稿；与已保存的值分开，输入过程中不改动开关状态
  const [thresholdDraft, setThresholdDraft] = useState('')
  // 保留条数输入草稿，处理方式同上
  const [retainDraft, setRetainDraft] = useState('')
  // 读取或保存失败时的提示
  const [error, setError] = useState<string | null>(null)
  // 最近一次提交的序号：输入框失焦与开关点击可能先后发起请求，只让最后一次响应落到界面
  const latestRequest = useRef(0)

  useEffect(() => {
    let active = true

    // 卡片可能在请求返回前被切走，此时不再写入状态
    void loadDesktopCookieSettings()
      .then((next) => {
        if (!active) return

        setSettings(next)
        setThresholdDraft(String(next.threshold))
        setRetainDraft(String(next.retain))
      })
      .catch((failure: unknown) => {
        if (!active) return

        console.error('[desktop-cookie] 读取清理设置失败:', failure)
        setError(`${t('loadFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
      })

    return () => {
      active = false
    }
  }, [t])

  /**
   * 提交一份设置补丁。
   *
   * 允许请求并发：服务端逐次在最新设置上合并补丁，客户端只让最后一次响应
   * 更新界面，避免先返回的旧快照把刚保存的字段改回去。
   * @param patch 要变更的字段
   */
  const persist = async (patch: Partial<DesktopCookieSettings>): Promise<void> => {
    latestRequest.current += 1
    const request = latestRequest.current

    setError(null)

    try {
      const next = await saveDesktopCookieSettings(patch)
      if (latestRequest.current !== request) return

      setSettings(next)
      setThresholdDraft(String(next.threshold))
      setRetainDraft(String(next.retain))
    } catch (failure) {
      if (latestRequest.current !== request) return

      console.error('[desktop-cookie] 保存清理设置失败:', failure)
      setError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    }
  }

  const handleToggle = () => {
    if (settings === null) return

    void persist({ enabled: !settings.enabled })
  }

  /**
   * 校验并提交阈值草稿；不合法时恢复成已保存的值并提示。
   */
  const commitThreshold = () => {
    if (settings === null) return

    const parsed = Number(thresholdDraft.trim())
    if (!Number.isInteger(parsed) || parsed < MIN_THRESHOLD || parsed > MAX_THRESHOLD) {
      setError(t('thresholdInvalid'))
      setThresholdDraft(String(settings.threshold))

      return
    }

    if (parsed === settings.threshold) return

    void persist({ threshold: parsed })
  }

  /**
   * 校验并提交保留条数草稿：必须小于阈值，否则每次启动都触发清理却删不掉任何记录。
   */
  const commitRetain = () => {
    if (settings === null) return

    const parsed = Number(retainDraft.trim())
    if (!Number.isInteger(parsed) || parsed < MIN_RETAIN || parsed >= settings.threshold) {
      setError(t('retainInvalid'))
      setRetainDraft(String(settings.retain))

      return
    }

    if (parsed === settings.retain) return

    void persist({ retain: parsed })
  }

  const enabled = settings?.enabled === true

  return (
    // 卡片容器：文字区不参与交互，开关与输入框各自独立，不能互相嵌套；
    // 两个输入框单独占下面一行，避免挤在开关下方把整行卡片撑高
    <div className="flex w-full flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1">
      {/* 上段：文字区与开关横向并列 */}
      <div className="flex w-full items-start gap-2">
        {/* 文字区：只展示标题与说明，点它不会切换开关，交互只留给右侧开关 */}
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {/* 入口图标 */}
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
            <CookieIcon />
          </span>
          {/* 入口标题与说明 */}
          <span className="min-w-0 flex-1">
            {/* 开关标题 */}
            <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
            {/* 开关用途说明 */}
            <span className="block text-[11px] leading-[14px] text-secondary">
              {t('description')}
            </span>
            {/* 读取或保存失败提示：说明当前状态未能保存 */}
            {error !== null ? (
              <span className="block text-[12px] leading-[16px] text-danger" role="alert">
                {error}
              </span>
            ) : null}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={t('title')}
          disabled={settings === null}
          onClick={handleToggle}
          className={cn(
            'flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition',
            enabled ? 'bg-brand' : 'bg-line2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-default',
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
      {/* 阈值与保留条数：只在开关打开后出现在卡片下方，并排成一行 */}
      {enabled ? (
        <div className="flex items-center gap-3 pl-7">
          <CountField
            label={t('thresholdLabel')}
            unit={t('unit')}
            value={thresholdDraft}
            onChange={setThresholdDraft}
            onCommit={commitThreshold}
          />
          <CountField
            label={t('retainLabel')}
            unit={t('unit')}
            value={retainDraft}
            onChange={setRetainDraft}
            onCommit={commitRetain}
          />
        </div>
      ) : null}
    </div>
  )
}
