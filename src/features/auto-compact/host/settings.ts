/**
 * 「自动压缩会话」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/auto-compact.json`：压缩由宿主侧在每步前检查，
 * 浏览器端 localStorage 对它不可见，因此配置必须落在宿主读得到的位置。
 *
 * 检查每步都会触发一次，读取结果按文件 mtime 缓存，改动后下一次检查即可生效。
 */
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import type { AutoCompactSettings } from '../types'

/** 默认关闭：阈值沿用宿主内置自动压缩的比例，保留比例沿用宿主默认的近期尾部预算。 */
const DEFAULT_SETTINGS: AutoCompactSettings = {
  enabled: false,
  thresholdPercent: 80,
  retainPercent: 16,
}

/** 百分比允许的最小值。 */
const MIN_PERCENT = 1

/** 百分比允许的最大值。 */
const MAX_PERCENT = 100

/** 缓存的解析结果，与文件的 mtime、大小一并记录，文件未变时直接复用。 */
interface SettingsCache {
  mtimeMs: number
  size: number
  value: AutoCompactSettings
}

let cache: SettingsCache | undefined

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/auto-compact.json`
 */
function autoCompactSettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'auto-compact.json')
}

/**
 * 把任意输入收窄成合法百分比：非数字回退 `fallback`，超出范围夹到 1-100。
 * @param value 原始值
 * @param fallback 无法解析时使用的值
 * @returns 合法百分比
 */
function normalizePercent(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(parsed)) return fallback

  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, Math.round(parsed)))
}

/**
 * 让保留比例始终低于阈值：压缩后必须真正落在阈值以下，否则每次检查都会再压一次。
 * @param retainPercent 保留比例
 * @param thresholdPercent 触发阈值
 * @returns 小于阈值的保留比例
 */
function clampRetain(retainPercent: number, thresholdPercent: number): number {
  return Math.min(retainPercent, Math.max(MIN_PERCENT, thresholdPercent - 1))
}

/**
 * 校验并补全整份设置文档。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): AutoCompactSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as { enabled?: unknown; thresholdPercent?: unknown; retainPercent?: unknown }
  const thresholdPercent = normalizePercent(candidate.thresholdPercent, DEFAULT_SETTINGS.thresholdPercent)
  const retainPercent = normalizePercent(candidate.retainPercent, DEFAULT_SETTINGS.retainPercent)

  return {
    enabled: candidate.enabled === true,
    thresholdPercent,
    retainPercent: clampRetain(retainPercent, thresholdPercent),
  }
}

/**
 * 在当前设置上应用补丁：只接受已知字段，未知字段忽略。
 * @param current 当前设置
 * @param patch 客户端提交的补丁
 * @returns 合并后的设置
 */
function applyPatch(current: AutoCompactSettings, patch: unknown): AutoCompactSettings {
  if (typeof patch !== 'object' || patch === null) return { ...current }

  const candidate = patch as { enabled?: unknown; thresholdPercent?: unknown; retainPercent?: unknown }
  const thresholdPercent =
    candidate.thresholdPercent === undefined
      ? current.thresholdPercent
      : normalizePercent(candidate.thresholdPercent, current.thresholdPercent)
  const retainPercent =
    candidate.retainPercent === undefined
      ? current.retainPercent
      : normalizePercent(candidate.retainPercent, current.retainPercent)

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : current.enabled,
    thresholdPercent,
    retainPercent: clampRetain(retainPercent, thresholdPercent),
  }
}

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readAutoCompactSettings(): AutoCompactSettings {
  const file = autoCompactSettingsFile()

  try {
    const info = statSync(file)
    if (cache !== undefined && cache.mtimeMs === info.mtimeMs && cache.size === info.size) {
      return cache.value
    }

    const value = normalizeSettings(JSON.parse(readFileSync(file, 'utf8')) as unknown)
    cache = { mtimeMs: info.mtimeMs, size: info.size, value }

    return value
  } catch (error) {
    // 首次运行时文件不存在是正常情况，按默认关闭处理
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[auto-compact] 读取自动压缩设置失败:', file, error)
    }

    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * 原子写入设置：先写临时文件再改名，避免写入中断留下半份配置。
 * @param next 新设置
 */
function writeSettings(next: AutoCompactSettings): void {
  const file = autoCompactSettingsFile()
  const temp = `${file}.tmp`

  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
    renameSync(temp, file)
    // 文件已被替换，缓存失效；下一次读取会重新解析
    cache = undefined
  } catch (error) {
    console.error('[auto-compact] 写入自动压缩设置失败:', file, error)
    throw error
  }
}

/**
 * 应用一份补丁并落盘。
 * @param patch 客户端提交的补丁
 * @returns 写入后的完整设置
 */
export function updateAutoCompactSettings(patch: unknown): AutoCompactSettings {
  const next = applyPatch(readAutoCompactSettings(), patch)
  writeSettings(next)

  return next
}
