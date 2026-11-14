/**
 * 「内存守护」的配置与运行状态持久化。
 *
 * 全部走 localStorage：定时器、交互监听与占用判定都跑在渲染进程里，配置只需
 * 对当前页面可见；重建后 localStorage 仍在，定时器随即恢复，不会因为刷新丢失设置。
 * 存储不可用（隐私模式等）时一律按默认值处理，功能退化但不报错中断。
 */
import type { MemoryGuardSettings, MemoryGuardState } from './types'

/** 配置在 localStorage 中的键。 */
const SETTINGS_KEY = 'dsh-all-in-one:memory-guard'

/** 运行状态在 localStorage 中的键，与配置分开，避免频繁写入冲掉用户设置。 */
const STATE_KEY = 'dsh-all-in-one:memory-guard:state'

/** 默认配置：开启，每 10 分钟检查一次，占用超过 600 MB 才重建。 */
const DEFAULT_SETTINGS: MemoryGuardSettings = {
  enabled: true,
  intervalMinutes: 10,
  thresholdMB: 600,
}

/** 检查间隔允许的最小值（分钟）。 */
const MIN_INTERVAL_MINUTES = 1

/** 检查间隔允许的最大值（分钟）；再长就失去「始终低负载」的意义。 */
const MAX_INTERVAL_MINUTES = 120

/** 重建阈值允许的最小值（MB）。 */
const MIN_THRESHOLD_MB = 200

/** 重建阈值允许的最大值（MB）。 */
const MAX_THRESHOLD_MB = 8192

/**
 * 把任意输入收窄成合法整数并夹到范围内。
 * @param value 原始值
 * @param fallback 无法解析时使用的值
 * @param min 下限
 * @param max 上限
 * @returns 合法整数
 */
function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(parsed)) return fallback

  return Math.min(max, Math.max(min, Math.round(parsed)))
}

/**
 * 校验并补全整份配置。
 * @param value 解析后的 JSON
 * @returns 规范化后的配置
 */
function normalizeSettings(value: unknown): MemoryGuardSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as {
    enabled?: unknown
    intervalMinutes?: unknown
    thresholdMB?: unknown
  }

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : DEFAULT_SETTINGS.enabled,
    intervalMinutes: normalizeInteger(
      candidate.intervalMinutes,
      DEFAULT_SETTINGS.intervalMinutes,
      MIN_INTERVAL_MINUTES,
      MAX_INTERVAL_MINUTES,
    ),
    thresholdMB: normalizeInteger(
      candidate.thresholdMB,
      DEFAULT_SETTINGS.thresholdMB,
      MIN_THRESHOLD_MB,
      MAX_THRESHOLD_MB,
    ),
  }
}

/** 空状态：从未回收、从未重建。 */
const EMPTY_STATE: MemoryGuardState = {
  lastReclaimAt: 0,
  lastReclaimFreedMB: 0,
  lastRebuildAt: 0,
}

/**
 * 校验运行状态。
 * @param value 解析后的 JSON
 * @returns 规范化后的状态
 */
function normalizeState(value: unknown): MemoryGuardState {
  if (typeof value !== 'object' || value === null) return { ...EMPTY_STATE }

  const candidate = value as {
    lastReclaimAt?: unknown
    lastReclaimFreedMB?: unknown
    lastRebuildAt?: unknown
  }
  const timestamp = (input: unknown): number => {
    const parsed = typeof input === 'number' ? input : Number.NaN

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }
  const freed = typeof candidate.lastReclaimFreedMB === 'number'
    ? Math.max(0, Math.round(candidate.lastReclaimFreedMB))
    : 0

  return {
    lastReclaimAt: timestamp(candidate.lastReclaimAt),
    lastReclaimFreedMB: freed,
    lastRebuildAt: timestamp(candidate.lastRebuildAt),
  }
}

/**
 * 读取一段 JSON 存储。
 * @param key localStorage 键
 * @param normalize 解析后的收窄函数
 * @returns 规范化结果；缺失、损坏或存储不可用时返回 `undefined`
 */
function readJson<T>(key: string, normalize: (value: unknown) => T): T | undefined {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return undefined

    return normalize(JSON.parse(raw) as unknown)
  } catch (error) {
    console.error(`[memory-guard] 读取 ${key} 失败:`, error)

    return undefined
  }
}

/**
 * 写入一段 JSON 存储。
 * @param key localStorage 键
 * @param value 要写入的值
 * @returns 是否写入成功；失败时调用方继续运行，只是不再持久化
 */
function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))

    return true
  } catch (error) {
    console.error(`[memory-guard] 写入 ${key} 失败:`, error)

    return false
  }
}

/**
 * 读取配置；未写过或存储不可用时返回默认值。
 * @returns 当前配置
 */
export function readMemoryGuardSettings(): MemoryGuardSettings {
  return readJson(SETTINGS_KEY, normalizeSettings) ?? { ...DEFAULT_SETTINGS }
}

/**
 * 在当前配置上应用一份补丁并落盘。
 * @param patch 要变更的字段
 * @returns 写入后的完整配置
 */
export function updateMemoryGuardSettings(patch: Partial<MemoryGuardSettings>): MemoryGuardSettings {
  const current = readMemoryGuardSettings()
  const next = normalizeSettings({ ...current, ...patch })
  writeJson(SETTINGS_KEY, next)

  return next
}

/**
 * 读取运行状态。
 * @returns 最近一次回收与重建的时间
 */
export function readMemoryGuardState(): MemoryGuardState {
  return readJson(STATE_KEY, normalizeState) ?? { ...EMPTY_STATE }
}

/**
 * 合并并写入运行状态。
 * @param patch 要变更的字段
 * @returns 写入后的完整状态
 */
export function updateMemoryGuardState(patch: Partial<MemoryGuardState>): MemoryGuardState {
  const next = normalizeState({ ...readMemoryGuardState(), ...patch })
  writeJson(STATE_KEY, next)

  return next
}

/** 检查间隔的合法范围，供卡片输入框校验与提示共用。 */
export const INTERVAL_RANGE = { min: MIN_INTERVAL_MINUTES, max: MAX_INTERVAL_MINUTES } as const

/** 重建阈值的合法范围，供卡片输入框校验与提示共用。 */
export const THRESHOLD_RANGE = { min: MIN_THRESHOLD_MB, max: MAX_THRESHOLD_MB } as const
