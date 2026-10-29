/**
 * 「自动压缩会话」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/auto-compact.json`：压缩由宿主侧在每轮结束后
 * 检查，浏览器端 localStorage 对它不可见，因此配置必须落在宿主读得到的位置。
 *
 * 检查每轮都会触发一次，读取结果按文件 mtime 缓存，开关与阈值改动后下一次
 * 检查即可生效。
 */
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import type { AutoCompactSettings } from '../types'

/** 默认关闭，阈值取宿主内置自动压缩的同一比例。 */
const DEFAULT_SETTINGS: AutoCompactSettings = { enabled: false, thresholdPercent: 80 }

/** 阈值允许的最小百分比。 */
const MIN_THRESHOLD_PERCENT = 1

/** 阈值允许的最大百分比。 */
const MAX_THRESHOLD_PERCENT = 100

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
export function autoCompactSettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'auto-compact.json')
}

/**
 * 把任意输入收窄成合法阈值：非数字回退默认值，超出范围夹到 1-100。
 * @param value 原始值
 * @returns 合法百分比
 */
function normalizeThreshold(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(parsed)) return DEFAULT_SETTINGS.thresholdPercent

  return Math.min(MAX_THRESHOLD_PERCENT, Math.max(MIN_THRESHOLD_PERCENT, Math.round(parsed)))
}

/**
 * 校验并补全整份设置文档。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): AutoCompactSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as { enabled?: unknown; thresholdPercent?: unknown }

  return {
    enabled: candidate.enabled === true,
    thresholdPercent: normalizeThreshold(candidate.thresholdPercent),
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

  const candidate = patch as { enabled?: unknown; thresholdPercent?: unknown }

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : current.enabled,
    thresholdPercent:
      candidate.thresholdPercent === undefined
        ? current.thresholdPercent
        : normalizeThreshold(candidate.thresholdPercent),
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
