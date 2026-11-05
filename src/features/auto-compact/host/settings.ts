/**
 * 「自动压缩会话」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/auto-compact.json`：压缩由宿主侧在每步前检查，
 * 浏览器端 localStorage 对它不可见，因此配置必须落在宿主读得到的位置。
 *
 * 检查每步都会触发一次，读取因此以内存态为准：本进程写入后立即更新，只有
 * 「别的进程改了同一份文件」才需要重新读盘，而这种情况最多每 30 秒核对一次。
 */
import { join } from 'node:path'

import { createJsonSettingsStore } from '../../../common/json-settings'
import { resolveDshHome } from '../../../common/dsh-home'
import type { AutoCompactSettings } from '../types'

/**
 * 默认设置：默认关闭，阈值比宿主内置的 80% 更早触发，压缩后保留 20% 的近期
 * 尾部——两者相差 50 个百分点，压缩后不会立刻又触到阈值。
 */
const DEFAULT_SETTINGS: AutoCompactSettings = {
  enabled: false,
  thresholdPercent: 70,
  retainPercent: 20,
}

/** 百分比允许的最小值。 */
const MIN_PERCENT = 1

/** 百分比允许的最大值。 */
const MAX_PERCENT = 100

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

/** 设置存储：读取结果按文件状态缓存，写入后内存态同步更新。 */
const store = createJsonSettingsStore<AutoCompactSettings>({
  file: autoCompactSettingsFile,
  normalize: normalizeSettings,
  defaults: () => ({ ...DEFAULT_SETTINGS }),
  label: '[auto-compact]',
})

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readAutoCompactSettings(): AutoCompactSettings {
  return store.read()
}

/**
 * 应用一份补丁并落盘。
 * @param patch 客户端提交的补丁
 * @returns 写入后的完整设置
 */
export function updateAutoCompactSettings(patch: unknown): AutoCompactSettings {
  return store.update(patch, applyPatch)
}
