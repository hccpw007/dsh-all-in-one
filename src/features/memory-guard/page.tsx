/**
 * 「内存守护」功能页面。
 *
 * 网格卡片只留开关与说明，检查间隔、重建阈值、运行状态与手动操作都收在这里。
 * 读数只在页面打开时轮询：页面关掉立刻停止，不在后台持续读宿主的进程表。
 */
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { FeaturePageProps } from '../../shell/registry'
import type { Translate } from '../../types/plugin'
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

/** 读数的刷新间隔：用户正看着数字，5 秒一次足够，也不会压住宿主侧 4 秒的读数缓存。 */
const READING_REFRESH_MS = 5_000

/** 数字输入框样式：宽度固定，避免不同位数的值把整行挤得长短不一。 */
const INPUT_CLASS =
  'w-16 rounded-lg border border-line4 bg-base px-2 py-1 text-[12px] text-primary outline-none focus:border-brand'

/** 状态列表中标签列宽度，保证右侧的值纵向对齐。 */
const LABEL_CLASS = 'w-20 shrink-0 text-secondary'

/** 参数输入行。 */
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
  /** 草稿变化时回写。 */
  onChange: (value: string) => void
  /** 失焦或回车时提交。 */
  onCommit: () => void
}

/**
 * 渲染一个数值参数输入行。
 * @param props 字段属性
 */
function NumberField({ label, unit, value, min, max, onChange, onCommit }: NumberFieldProps) {
  return (
    <label className="flex items-center gap-2">
      {/* 输入行标签 */}
      <span className="text-[12px] font-semibold text-primary">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
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
      <span className="text-[12px] leading-[18px] text-secondary">{unit}</span>
    </label>
  )
}

/**
 * 把时间戳格式化成日期与时间。
 * @param timestamp 毫秒时间戳；0 表示从未执行
 * @param neverLabel 从未执行时的占位文案
 * @returns 展示文本
 */
function formatTime(timestamp: number, neverLabel: string): string {
  if (timestamp <= 0) return neverLabel

  return new Date(timestamp).toLocaleString()
}

/**
 * 把读数来源转成界面文案。
 * @param source 读数来源
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 来源名称
 */
function sourceLabel(source: MemoryReading['source'], t: Translate): string {
  if (source === 'process') return t('sourceProcess')
  if (source === 'heap') return t('sourceHeap')

  return t('sourceNone')
}

/**
 * 「内存守护」设置页：参数、运行状态、实时读数与手动操作。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function MemoryGuardPage({ t }: FeaturePageProps) {
  // 当前配置；输入框失焦或回车提交后才更新
  const [settings, setSettings] = useState(() => readMemoryGuardSettings())
  // 运行状态：上次回收与上次重建的时间
  const [runtime, setRuntime] = useState<MemoryGuardState>(() => readMemoryGuardState())
  // 最近一次读数；为 null 表示首帧还没读到
  const [reading, setReading] = useState<MemoryReading | null>(null)
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
  // 校验失败或操作结果提示；空串表示没有要显示的内容
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    /** 刷新读数与运行状态；页面可能在请求返回前关闭，用 active 拦住 */
    const refresh = (): void => {
      void readMemory()
        .then((next) => {
          if (!active) return

          setReading(next)
          setRuntime(readMemoryGuardState())
        })
        .catch((error: unknown) => {
          if (!active) return

          console.error('[memory-guard] 读取内存占用失败:', error)
          setMessage(t('measureFailed'))
        })
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

  /** 校验并提交检查间隔；不合法时恢复成已保存的值。 */
  const commitInterval = (): void => {
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
  const commitThreshold = (): void => {
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
      setReading(await guard.reclaimNow())
      setRuntime(readMemoryGuardState())
    } catch (error) {
      console.error('[memory-guard] 手动轻量回收失败:', error)
      setMessage(t('measureFailed'))
    } finally {
      setWorking(null)
    }
  }

  /** 手动重建：点击即进入 5 秒倒计时，不要求空闲。 */
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

  return (
    <div className="space-y-4">
      {/* 页面标题与用途说明 */}
      <div>
        {/* 页面标题 */}
        <h2 className="text-[15px] font-semibold leading-6 text-primary">{t('pageTitle')}</h2>
        {/* 页面说明：检查节奏与自动重建的触发条件 */}
        <p className="mt-1.5 text-[12px] leading-[18px] text-secondary">{t('pageHint')}</p>
      </div>

      {/* 参数区：检查间隔与重建阈值，失焦或回车即保存 */}
      <section className="rounded-xl border border-line4 bg-layer1 p-4">
        {/* 检查间隔输入 */}
        <NumberField
          label={t('intervalLabel')}
          unit={t('intervalUnit')}
          value={intervalDraft}
          min={INTERVAL_RANGE.min}
          max={INTERVAL_RANGE.max}
          onChange={setIntervalDraft}
          onCommit={commitInterval}
        />
        {/* 检查间隔的作用：同时决定多久检查一次与多久没人操作才算空闲 */}
        <p className="mt-1 text-[11px] leading-4 text-secondary">{t('intervalHint')}</p>
        {/* 重建阈值输入 */}
        <div className="mt-3">
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
        {/* 重建阈值的作用：超过它才真正重建页面 */}
        <p className="mt-1 text-[11px] leading-4 text-secondary">{t('thresholdHint')}</p>
        {/* 输入框即时保存的说明 */}
        <p className="mt-3 text-[11px] leading-4 text-secondary">{t('autoSaveHint')}</p>
      </section>

      {/* 运行状态区：实时占用、DOM 规模与最近两次执行时间 */}
      <section className="rounded-xl border border-line4 bg-layer1 p-4">
        <dl className="space-y-1.5 text-[12px] leading-[18px]">
          {/* 全部进程合计：与活动监视器各行之和同口径 */}
          <div className="flex gap-2">
            {/* 当前内存占用 */}
            <dt className={LABEL_CLASS}>{t('memoryUsage')}</dt>
            <dd className="min-w-0 break-all text-primary">
              {reading === null
                ? t('readingPending')
                : reading.totalMB !== null
                  ? `${reading.totalMB} MB · ${t('sourceAll')}`
                  : `${reading.megabytes} MB · ${sourceLabel(reading.source, t)}`}
            </dd>
          </div>
          {/* 渲染进程单独列出：阈值判定与页面重建只针对这一部分 */}
          {reading !== null && reading.rendererMB !== null ? (
            <div className="flex gap-2">
              {/* 渲染进程内存 */}
              <dt className={LABEL_CLASS}>{t('rendererUsage')}</dt>
              <dd className="min-w-0 text-primary">{`${reading.rendererMB} MB`}</dd>
            </div>
          ) : null}
          {/* 页面 DOM 节点数，作为界面规模与长会话累积的旁证 */}
          <div className="flex gap-2">
            {/* DOM 节点数量 */}
            <dt className={LABEL_CLASS}>{t('domNodeCount')}</dt>
            <dd className="min-w-0 text-primary">{reading === null ? t('readingPending') : reading.domNodes}</dd>
          </div>
          {/* 上次轻量回收的时间与释放量 */}
          <div className="flex gap-2">
            {/* 上次轻量回收 */}
            <dt className={LABEL_CLASS}>{t('lastReclaim')}</dt>
            <dd className="min-w-0 break-all text-primary">
              {formatTime(runtime.lastReclaimAt, t('never'))}
              {runtime.lastReclaimFreedMB > 0
                ? `（${t('freedAmount').replace('{amount}', String(runtime.lastReclaimFreedMB))}）`
                : ''}
            </dd>
          </div>
          {/* 上次重建的时间 */}
          <div className="flex gap-2">
            {/* 上次重建 */}
            <dt className={LABEL_CLASS}>{t('lastRebuild')}</dt>
            <dd className="min-w-0 break-all text-primary">
              {formatTime(runtime.lastRebuildAt, t('never'))}
            </dd>
          </div>
        </dl>
        {/* 读数口径说明：只在拿到进程读数时显示，页面 JS 堆没有可比对象 */}
        {reading?.source === 'process' ? (
          <p className="mt-2 text-[11px] leading-4 text-secondary">{t('readingHint')}</p>
        ) : null}
        {/* 手动操作：立即回收与立即重建 */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* 立即回收：清缓存，不碰界面与会话 */}
          <Button variant="outline" disabled={working !== null} onClick={() => void handleReclaim()}>
            {working === 'reclaim' ? t('reclaiming') : t('reclaimNow')}
          </Button>
          {/* 立即重建：确认倒计时后重载页面 */}
          <Button variant="outline" disabled={working !== null} onClick={() => void handleRebuild()}>
            {t('rebuildNow')}
          </Button>
        </div>
      </section>

      {/* 校验或操作结果提示 */}
      {message !== '' ? (
        <p className="text-[12px] leading-[18px] text-danger" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  )
}
