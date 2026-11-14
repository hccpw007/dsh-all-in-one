/**
 * 「全自动执行」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/auto-run.json`：提示词注入与询问应答都在宿主侧
 * 发生，浏览器端 localStorage 对它不可见，因此开关必须落在宿主读得到的位置。
 *
 * 读取发生在两条热路径上（每次提示词装配、每次询问请求），因此以内存态为准：
 * 本进程写入后立即更新，只有「别的进程改了同一份文件」才重新读盘，最多每 30 秒核对一次。
 */
import { join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { createJsonSettingsStore } from '../../../common/json-settings'
import type { AutoRunSettings } from '../types'

/**
 * 记录的会话上限。
 *
 * 会话被删除后没有回调可以清理这里的条目，因此按「最近开启」保留有限条数；
 * 超出时丢弃最早的一条，配置文件不会随使用时间无限增长。
 */
const MAX_SESSIONS = 200

/** 默认设置：没有任何会话处于自动模式。 */
const DEFAULT_SETTINGS: AutoRunSettings = { enabledSessions: [] }

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/auto-run.json`
 */
function autoRunSettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'auto-run.json')
}

/**
 * 校验并补全整份设置文档：只保留非空字符串、去重、裁剪到上限。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): AutoRunSettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = (value as { enabledSessions?: unknown }).enabledSessions
  if (!Array.isArray(candidate)) return { ...DEFAULT_SETTINGS }

  const sessions: string[] = []

  // 逐项收窄：手工编辑过的文件可能混入数字、空串或重复项
  for (const item of candidate) {
    if (typeof item !== 'string' || item === '') continue
    if (sessions.includes(item)) continue

    sessions.push(item)
  }

  return { enabledSessions: sessions.slice(-MAX_SESSIONS) }
}

/** 设置存储：读取结果按文件状态缓存，写入后内存态同步更新。 */
const store = createJsonSettingsStore<AutoRunSettings>({
  file: autoRunSettingsFile,
  normalize: normalizeSettings,
  defaults: () => ({ ...DEFAULT_SETTINGS, enabledSessions: [] }),
  label: '[auto-run]',
})

/**
 * 读取配置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readAutoRunSettings(): AutoRunSettings {
  return store.read()
}

/**
 * 判断某个会话是否处于全自动模式。
 * @param sessionId 会话标识
 * @returns 开关是否开启
 */
export function isAutoRunEnabled(sessionId: string): boolean {
  return store.read().enabledSessions.includes(sessionId)
}

/**
 * 写入某个会话的开关状态。
 *
 * 开启时追加到列表末尾（视为最近开启），关闭时删除该条目；重复写入同一状态
 * 不会产生重复项。
 * @param sessionId 会话标识
 * @param enabled 目标状态
 * @returns 写入后的该会话状态
 */
export function setAutoRunEnabled(sessionId: string, enabled: boolean): boolean {
  const current = store.read()
  const without = current.enabledSessions.filter((item) => item !== sessionId)
  const next = enabled ? [...without, sessionId] : without

  store.write({ enabledSessions: next.slice(-MAX_SESSIONS) })

  return enabled
}
