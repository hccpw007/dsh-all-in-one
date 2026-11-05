/**
 * 「桌面版 Cookie 清理」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/desktop-cookie.json`：清理由宿主在启动时执行，
 * 浏览器端 localStorage 对它不可见，因此配置必须落在宿主读得到的位置。
 */
import { join } from 'node:path'

import { createJsonSettingsStore } from '../../../common/json-settings'
import { resolveDshHome } from '../../../common/dsh-home'
import type { DesktopCookieSettings } from '../types'

/**
 * 默认设置：默认开启，因为该功能就是为修复桌面版启动崩溃而存在；
 * 阈值 3、保留 1 让库中最多留下 2 条记录（本次启动新写入的那条 + 最近一条）。
 */
const DEFAULT_SETTINGS: DesktopCookieSettings = {
  enabled: true,
  threshold: 3,
  retain: 1,
}

/** 阈值允许的最小值。 */
const MIN_THRESHOLD = 1

/** 阈值允许的最大值；再大也只是让旧的认证记录白占地方。 */
const MAX_THRESHOLD = 100

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/desktop-cookie.json`
 */
function desktopCookieSettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'desktop-cookie.json')
}

/**
 * 把任意输入收窄成合法条数：非数字回退 `fallback`，超出范围夹到 1-100。
 * @param value 原始值
 * @param fallback 无法解析时使用的值
 * @returns 合法条数
 */
function normalizeCount(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(parsed)) return fallback

  return Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, Math.round(parsed)))
}

/**
 * 让保留条数始终小于阈值：否则每次启动都满足触发条件却删不掉任何记录。
 * @param retain 保留条数
 * @param threshold 触发阈值
 * @returns 小于阈值的保留条数
 */
function clampRetain(retain: number, threshold: number): number {
  return Math.min(retain, threshold - 1)
}

/**
 * 校验并补全整份设置文档。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): DesktopCookieSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as { enabled?: unknown; threshold?: unknown; retain?: unknown }
  const threshold = normalizeCount(candidate.threshold, DEFAULT_SETTINGS.threshold)
  const retain = normalizeCount(candidate.retain, DEFAULT_SETTINGS.retain)

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : DEFAULT_SETTINGS.enabled,
    threshold,
    retain: clampRetain(retain, threshold),
  }
}

/**
 * 在当前设置上应用补丁：只接受已知字段，未知字段忽略。
 * @param current 当前设置
 * @param patch 客户端提交的补丁
 * @returns 合并后的设置
 */
function applyPatch(current: DesktopCookieSettings, patch: unknown): DesktopCookieSettings {
  if (typeof patch !== 'object' || patch === null) return { ...current }

  const candidate = patch as { enabled?: unknown; threshold?: unknown; retain?: unknown }
  const threshold =
    candidate.threshold === undefined
      ? current.threshold
      : normalizeCount(candidate.threshold, current.threshold)
  const retain =
    candidate.retain === undefined ? current.retain : normalizeCount(candidate.retain, current.retain)

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : current.enabled,
    threshold,
    retain: clampRetain(retain, threshold),
  }
}

/** 设置存储：读取结果按文件状态缓存，写入后内存态同步更新。 */
const store = createJsonSettingsStore<DesktopCookieSettings>({
  file: desktopCookieSettingsFile,
  normalize: normalizeSettings,
  defaults: () => ({ ...DEFAULT_SETTINGS }),
  label: '[desktop-cookie]',
})

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readDesktopCookieSettings(): DesktopCookieSettings {
  return store.read()
}

/**
 * 应用一份补丁并落盘。
 * @param patch 客户端提交的补丁
 * @returns 写入后的完整设置
 */
export function updateDesktopCookieSettings(patch: unknown): DesktopCookieSettings {
  return store.update(patch, applyPatch)
}
