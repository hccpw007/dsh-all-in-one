import React, { useEffect, useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { activeMemoryGuard } from './guard'
import { readMemory } from './measure'
import {
  INTERVAL_RANGE,
  readMemoryGuardSettings,
  readMemoryGuardState,
  THRESHOLD_RANGE,
  updateMemoryGuardSettings,
} from './storage'
import type { MemoryGuardSettings, MemoryGuardState, MemoryReading } from './types'

/** 读数的刷新间隔：卡片只在设置页打开时存在，十秒一次足以看出趋势。 */
const READING_REFRESH_MS = 10_000

/** 数字输入框样式，与其它开关型功能的参数输入保持一致。 */
const INPUT_CLASS =
  'w-12 rounded-md border border-line4 bg-base px-1 py-0 text-[11px] text-primary outline-none focus:border-brand'

/** 次要按钮样式：透明底、品牌色描边，避免和宿主的开关抢视觉。 */
const BUTTON_CLASS =
  'rounded-md border border-line4 px-2 py-0.5 text-[11px] text-primary transition hover:border-brand hover:text-brand disabled:cursor-default disabled:opacity-50'

/** 参数输入行：标签、输入框与单位。 */
interface NumberFieldProps {
  /** 输入行标签，如「检查间隔」。 */
  label: string
  /** 输入框单位，如「分钟」。 */
  unit: string
  /** 输入框的当前草稿值。 */
  value: string
  /** 允许的最小值，同时用于原生校验与滚动按钮。 */
  min: number
  /** 允许的最大值，同时用于原生校验与滚动按钮。 */
  max: number
  /** 是否处于禁用状态（例如开关关闭时）。 */
  disabled?: boolean
  /** 草稿变化时回写。 */
  onChange: (value: string) => void
  /** 失焦或回车时提交。 */
  onCommit: () => void
}

/**
 * 渲染一个数值参数输入行。
 * @param props 字段属性
 */
function NumberField({
  label,
  unit,
  value,
  min,
  max,
  disabled = false,
  onChange,
  onCommit,
}: NumberFieldProps) {
  return (
    <label className="flex items-center gap-1">
      {/* 输入行标签 */}
      <span className="text-[11px] leading-[16px] text-secondary">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
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

/**
 * 把时间戳格式化成当天的时分。
 * @param timestamp 毫秒时间戳；0 表示从未执行
 * @param neverLabel 从未执行时的占位文案
 * @returns 展示文本
 */
function formatTime(timestamp: number, neverLabel: string): string {
  if (timestamp <= 0) return neverLabel

  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** 开关入口图标：内存条，表达「占用与回收」。 */
function MemoryIcon() {
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
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 11v2M11 11v2M15 11v2" />
    </svg>
  )
}

/**
 * 「内存守护」开关入口。
 *
 * 卡片本身就是全部配置：开关、检查间隔、重建阈值、实时读数与两个手动按钮。
 * 定时器由客户端扩展常驻安装，开关只影响它是否执行动作，因此改完即时生效。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function MemoryGuardToggle({ t }: FeatureSwitchProps) {
  // 当前配置；所有变更都先落 localStorage 再回填，保证刷新后仍是用户选的值
  const [settings, setSettings] = useState(() => readMemoryGuardSettings())
  // 最近一次读数；null 表示还在读
  const [reading, setReading] = useState<MemoryReading | null>(null)
  // 运行状态：上次回收与上次重建的时间
  const [runtime, setRuntime] = useState<MemoryGuardState>(() => readMemoryGuardState())
  // 检查间隔的输入草稿，提交前不影响已保存的配置
  const [intervalDraft, setIntervalDraft] = useState(() =>
    String(readMemoryGuardSettings().intervalMinutes),
  )
  // 重建阈值的输入草稿，处理方式同上
  const [thresholdDraft, setThresholdDraft] = useState(() =>
    String(readMemoryGuardSettings().thresholdMB),
  )
  // 当前正在执行的手动操作；非 null 时两个按钮都禁用，避免并发
  const [working, setWorking] = useState<'reclaim' | 'rebuild' | null>(null)
  // 操作结果或校验失败提示；空串表示没有要显示的内容
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    /** 刷新读数与运行状态；异步返回时组件可能已卸载，用 active 拦住。 */
    const refresh = (): void => {
      void readMemory()
        .then((next) => {
          if (active) setReading(next)
        })
        .catch((error: unknown) => {
          if (!active) return

          console.error('[memory-guard] 读取内存占用失败:', error)
          setMessage(t('measureFailed'))
        })
      if (active) setRuntime(readMemoryGuardState())
    }

    refresh()
    const timer = window.setInterval(refresh, READING_REFRESH_MS)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [t])

  /**
   * 提交一份配置补丁。
   * @param patch 要变更的字段
   */
  const persist = (patch: Partial<MemoryGuardSettings>): void => {
    const next = updateMemoryGuardSettings(patch)
    setSettings(next)
    setIntervalDraft(String(next.intervalMinutes))
    setThresholdDraft(String(next.thresholdMB))
    // 改了间隔就立刻按新周期重排，否则要等旧周期走完才生效
    activeMemoryGuard()?.reschedule()
  }

  const handleToggle = () => {
    persist({ enabled: !settings.enabled })
  }

  /** 校验并提交检查间隔；不合法时恢复成已保存的值。 */
  const commitInterval = () => {
    const parsed = Number(intervalDraft.trim())
    if (
      !Number.isInteger(parsed)
      || parsed < INTERVAL_RANGE.min
      || parsed > INTERVAL_RANGE.max
    ) {
      setMessage(t('intervalInvalid'))
      setIntervalDraft(String(settings.intervalMinutes))

      return
    }

    setMessage('')
    if (parsed !== settings.intervalMinutes) persist({ intervalMinutes: parsed })
  }

  /** 校验并提交重建阈值；不合法时恢复成已保存的值。 */
  const commitThreshold = () => {
    const parsed = Number(thresholdDraft.trim())
    if (
      !Number.isInteger(parsed)
      || parsed < THRESHOLD_RANGE.min
      || parsed > THRESHOLD_RANGE.max
    ) {
      setMessage(t('thresholdInvalid'))
      setThresholdDraft(String(settings.thresholdMB))

      return
    }

    setMessage('')
    if (parsed !== settings.thresholdMB) persist({ thresholdMB: parsed })
  }

  /** 手动执行一次轻量回收。 */
  const handleReclaim = async (): Promise<void> => {
    const guard = activeMemoryGuard()
    if (guard === undefined) {
      setMessage(t('guardMissing'))

      return
    }

    setWorking('reclaim')
    setMessage('')

    try {
      const after = await guard.reclaimNow()
      setReading(after)
      setRuntime(readMemoryGuardState())
    } catch (error) {
      console.error('[memory-guard] 手动轻量回收失败:', error)
      setMessage(t('measureFailed'))
    } finally {
      setWorking(null)
    }
  }

  /** 手动重建：有未提交草稿时由 guard 拒绝并返回原因。 */
  const handleRebuild = async (): Promise<void> => {
    const guard = activeMemoryGuard()
    if (guard === undefined) {
      setMessage(t('guardMissing'))

      return
    }

    setWorking('rebuild')
    setMessage('')

    try {
      const outcome = await guard.rebuildNow()
      if (!outcome.rebuilt) setMessage(outcome.detail ?? t('busyChecking'))
    } catch (error) {
      console.error('[memory-guard] 手动重建失败:', error)
      setMessage(t('measureFailed'))
    } finally {
      setWorking(null)
    }
  }

  const readingText = reading === null
    ? t('readingUnknown')
    : reading.source === 'process'
      ? t('readingProcess').replace('{value}', String(reading.megabytes))
      : reading.source === 'heap'
        ? t('readingHeap').replace('{value}', String(reading.megabytes))
        : t('readingUnknown')

  return (
    // 卡片容器：文字区不参与交互，开关与参数各自独立，不能互相嵌套
    <div className="flex w-full flex-col gap-1 rounded-lg border border-line4 bg-layer1 px-2.5 py-1">
      {/* 上段：文字区与开关横向并列 */}
      <div className="flex w-full items-start gap-2">
        {/* 文字区：只展示标题与说明，交互只留给右侧开关 */}
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {/* 入口图标 */}
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
            <MemoryIcon />
          </span>
          {/* 入口标题与说明 */}
          <span className="min-w-0 flex-1">
            {/* 开关标题 */}
            <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
            {/* 开关用途说明 */}
            <span className="block text-[11px] leading-[14px] text-secondary">
              {t('description')}
            </span>
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          aria-label={t('title')}
          onClick={handleToggle}
          className={cn(
            'flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition',
            settings.enabled ? 'bg-brand' : 'bg-line2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-default',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-4 w-4 aio-switch bg-base shadow transition-transform',
              settings.enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
      {/* 开关打开后才展开参数、读数与操作，关闭时卡片保持一行高度 */}
      {settings.enabled ? (
        <>
          {/* 参数行：检查间隔同时是「无人工操作」的判定阈值 */}
          <div className="flex items-center gap-3 pl-7">
            <NumberField
              label={t('intervalLabel')}
              unit={t('intervalUnit')}
              value={intervalDraft}
              min={INTERVAL_RANGE.min}
              max={INTERVAL_RANGE.max}
              onChange={setIntervalDraft}
              onCommit={commitInterval}
            />
            <NumberField
              label={t('thresholdLabel')}
              unit={t('thresholdUnit')}
              value={thresholdDraft}
              min={THRESHOLD_RANGE.min}
              max={THRESHOLD_RANGE.max}
              onChange={setThresholdDraft}
              onCommit={commitThreshold}
            />
          </div>
          {/* 实时读数：桌面版是渲染进程 RSS，浏览器环境退回 JS 堆 */}
          <div className="flex flex-wrap items-center gap-x-2 pl-7 text-[11px] leading-[16px] text-secondary">
            {/* 读数标题 */}
            <span>{t('readingTitle')}</span>
            <span className="text-primary">{readingText}</span>
            {reading !== null ? (
              <span>{t('readingNodes').replace('{value}', String(reading.domNodes))}</span>
            ) : null}
          </div>
          {/* 运行状态：上次回收与上次重建的时间，方便判断定时器是否在工作 */}
          <div className="flex flex-wrap items-center gap-x-2 pl-7 text-[11px] leading-[16px] text-secondary">
            <span>
              {t('lastReclaim').replace('{time}', formatTime(runtime.lastReclaimAt, t('never')))}
              {runtime.lastReclaimFreedMB > 0 ? ` · ${runtime.lastReclaimFreedMB} MB` : ''}
            </span>
            <span>{t('lastRebuild').replace('{time}', formatTime(runtime.lastRebuildAt, t('never')))}</span>
          </div>
          {/* 操作行：手动回收与手动重建；重建会重置滚动位置，说明一并给出 */}
          <div className="flex flex-wrap items-center gap-2 pl-7">
            <button
              type="button"
              onClick={() => void handleReclaim()}
              disabled={working !== null}
              className={BUTTON_CLASS}
            >
              {working === 'reclaim' ? t('reclaiming') : t('reclaimNow')}
            </button>
            <button
              type="button"
              onClick={() => void handleRebuild()}
              disabled={working !== null}
              className={BUTTON_CLASS}
            >
              {t('rebuildNow')}
            </button>
            {/* 重建影响面提醒 */}
            <span className="text-[11px] leading-[16px] text-secondary">{t('rebuildHint')}</span>
          </div>
          {/* 结果与校验提示 */}
          {message !== '' ? (
            <span className="pl-7 text-[11px] leading-[16px] text-danger" role="alert">
              {message}
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
