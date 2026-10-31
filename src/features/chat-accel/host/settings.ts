/**
 * 「对话加速」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/chat-accel.json`：批量工具注册、工具并发声明与
 * 裁剪阈值都只在宿主进程里生效，浏览器端 localStorage 对它不可见。
 *
 * 每次读取都按文件 mtime 与大小缓存，页面上改完下一次读取即看到新值。
 */
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { ACCEL_ITEM_IDS } from '../items'
import {
  PRUNE_THRESHOLD_DEFAULT,
  PRUNE_THRESHOLD_MAX,
  PRUNE_THRESHOLD_MIN,
  type ChatAccelSettings,
} from '../types'

/** 默认设置：全部关闭，裁剪阈值取默认值。 */
const DEFAULT_SETTINGS: ChatAccelSettings = {
  enabledIds: [],
  pruneThreshold: PRUNE_THRESHOLD_DEFAULT,
}

/** 已知条目 id 的集合，用于丢弃历史配置里不再存在的条目。 */
const KNOWN_IDS = new Set(ACCEL_ITEM_IDS)

/** 缓存的解析结果，与文件的 mtime、大小一并记录。 */
interface SettingsCache {
  mtimeMs: number
  size: number
  value: ChatAccelSettings
}

let cache: SettingsCache | undefined

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/chat-accel.json`
 */
function settingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'chat-accel.json')
}

/**
 * 把任意输入收窄成合法阈值：非数字回退默认值，超出范围夹到上下限。
 * @param value 原始值
 * @returns 合法阈值
 */
function normalizeThreshold(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(parsed)) return PRUNE_THRESHOLD_DEFAULT

  return Math.min(PRUNE_THRESHOLD_MAX, Math.max(PRUNE_THRESHOLD_MIN, Math.round(parsed)))
}

/**
 * 收窄条目 id 列表：只保留已知条目并去重。
 * @param value 原始值
 * @returns 合法的已启用条目 id
 */
function normalizeEnabledIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const result: string[] = []

  for (const entry of value) {
    if (typeof entry !== 'string' || !KNOWN_IDS.has(entry) || result.includes(entry)) continue

    result.push(entry)
  }

  return result
}

/**
 * 校验并补全整份设置文档。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): ChatAccelSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as { enabledIds?: unknown; pruneThreshold?: unknown }

  return {
    enabledIds: normalizeEnabledIds(candidate.enabledIds),
    pruneThreshold: normalizeThreshold(candidate.pruneThreshold),
  }
}

/**
 * 在当前设置上应用补丁：只接受已知字段。
 * @param current 当前设置
 * @param patch 客户端提交的补丁
 * @returns 合并后的设置
 */
function applyPatch(current: ChatAccelSettings, patch: unknown): ChatAccelSettings {
  if (typeof patch !== 'object' || patch === null) return { ...current }

  const candidate = patch as { enabledIds?: unknown; pruneThreshold?: unknown }

  return {
    enabledIds:
      candidate.enabledIds === undefined
        ? current.enabledIds
        : normalizeEnabledIds(candidate.enabledIds),
    pruneThreshold:
      candidate.pruneThreshold === undefined
        ? current.pruneThreshold
        : normalizeThreshold(candidate.pruneThreshold),
  }
}

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readChatAccelSettings(): ChatAccelSettings {
  const file = settingsFile()

  try {
    const info = statSync(file)
    if (cache !== undefined && cache.mtimeMs === info.mtimeMs && cache.size === info.size) {
      return cache.value
    }

    const value = normalizeSettings(JSON.parse(readFileSync(file, 'utf8')) as unknown)
    cache = { mtimeMs: info.mtimeMs, size: info.size, value }

    return value
  } catch (error) {
    // 首次运行时文件不存在是正常情况，按全部关闭处理
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[chat-accel] 读取设置失败:', file, error)
    }

    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * 原子写入设置：先写临时文件再改名，避免写入中断留下半份配置。
 * @param next 新设置
 */
function writeSettings(next: ChatAccelSettings): void {
  const file = settingsFile()
  const temp = `${file}.tmp`

  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
    renameSync(temp, file)
    // 文件已被替换，缓存失效；下一次读取会重新解析
    cache = undefined
  } catch (error) {
    console.error('[chat-accel] 写入设置失败:', file, error)
    throw error
  }
}

/**
 * 应用一份补丁并落盘。
 * @param patch 客户端提交的补丁
 * @returns 写入后的完整设置
 */
export function updateChatAccelSettings(patch: unknown): ChatAccelSettings {
  const next = applyPatch(readChatAccelSettings(), patch)
  writeSettings(next)

  return next
}

/**
 * 判断某个条目是否已启用。
 * @param settings 当前设置
 * @param id 条目 id
 * @returns 是否启用
 */
export function isEnabled(settings: ChatAccelSettings, id: string): boolean {
  return settings.enabledIds.includes(id)
}
