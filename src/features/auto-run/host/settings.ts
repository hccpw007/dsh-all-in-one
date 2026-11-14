/**
 * 「全自动执行」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/auto-run.json`：提示词注入与询问应答都在宿主侧
 * 发生，浏览器端 localStorage 对它不可见，因此开关必须落在宿主读得到的位置。
 *
 * 读取发生在两条热路径上（每次提示词装配、每次询问请求），因此以内存态为准：
 * 本进程写入后立即更新，只有「别的进程改了同一份文件」才重新读盘，最多每 30 秒核对一次。
 *
 * 会话状态分两层：显式记录（用户点过开关的会话）优先，没有记录时按默认值策略求值。
 * 这样「默认开 / 上一次」这类策略不必在设置页出现时就批量展开成真实会话。
 */
import { join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { createJsonSettingsStore } from '../../../common/json-settings'
import type {
  AutoRunDefaultMode,
  AutoRunSettings,
  AutoRunSettingsSummary,
  AutoRunState,
} from '../types'

/**
 * 记录的会话上限。
 *
 * 会话被删除后没有回调可以清理这里的条目，因此按写入顺序保留有限条数；
 * 超出时丢弃最早的一条，配置文件不会随使用时间无限增长。
 */
const MAX_SESSIONS = 200

/** 记录的工作空间上限；理由同上。 */
const MAX_WORKSPACES = 100

/** 默认设置：没有任何显式记录，新会话按「默认关」处理。 */
function createDefaultSettings(): AutoRunSettings {
  return { sessions: {}, workspaces: {}, defaultMode: 'off', lastEnabled: false }
}

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/auto-run.json`
 */
function autoRunSettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'auto-run.json')
}

/**
 * 收窄默认值来源，无法识别时退回「默认关」。
 * @param value 解析后的 JSON 字段
 * @returns 可识别的默认值来源
 */
function readDefaultMode(value: unknown): AutoRunDefaultMode {
  if (value === 'on' || value === 'last' || value === 'workspace') return value

  return 'off'
}

/**
 * 收窄成「标识 → 布尔」表：只保留非空键与布尔值，并裁剪到上限。
 * @param value 解析后的 JSON 字段
 * @param limit 保留的最大条数
 * @returns 规范化后的表
 */
function readBooleanMap(value: unknown, limit: number): Record<string, boolean> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}

  const entries = Object.entries(value as Record<string, unknown>)
    // 手工编辑过的文件可能混入空键或非布尔值，直接丢弃
    .filter((entry): entry is [string, boolean] => entry[0] !== '' && typeof entry[1] === 'boolean')
    .slice(-limit)

  return Object.fromEntries(entries)
}

/**
 * 旧版配置只记录开启的会话，升级后按显式开启迁移。
 * @param value 旧格式的 `enabledSessions` 字段
 * @returns 显式开关表
 */
function migrateLegacySessions(value: unknown): Record<string, boolean> {
  if (!Array.isArray(value)) return {}

  const sessions: Record<string, boolean> = {}

  // 逐项收窄：手工编辑过的文件可能混入数字或空串
  for (const item of value) {
    if (typeof item !== 'string' || item === '') continue

    sessions[item] = true
  }

  return sessions
}

/**
 * 校验并补全整份设置文档。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): AutoRunSettings {
  if (typeof value !== 'object' || value === null) return createDefaultSettings()

  const candidate = value as {
    sessions?: unknown
    enabledSessions?: unknown
    workspaces?: unknown
    defaultMode?: unknown
    lastEnabled?: unknown
  }

  // 没有 sessions 字段说明是旧版文件：把开启列表迁移成显式记录
  const sessions = candidate.sessions === undefined
    ? migrateLegacySessions(candidate.enabledSessions)
    : readBooleanMap(candidate.sessions, MAX_SESSIONS)

  return {
    sessions,
    workspaces: readBooleanMap(candidate.workspaces, MAX_WORKSPACES),
    defaultMode: readDefaultMode(candidate.defaultMode),
    lastEnabled: candidate.lastEnabled === true,
  }
}

/** 设置存储：读取结果按文件状态缓存，写入后内存态同步更新。 */
const store = createJsonSettingsStore<AutoRunSettings>({
  file: autoRunSettingsFile,
  normalize: normalizeSettings,
  defaults: createDefaultSettings,
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
 * 生成设置页与侧边栏需要的摘要。
 * @param settings 当前设置
 * @returns 默认值来源与显式开启的会话列表
 */
export function summarizeAutoRunSettings(settings: AutoRunSettings): AutoRunSettingsSummary {
  const enabledSessions: string[] = []

  for (const [sessionId, enabled] of Object.entries(settings.sessions)) {
    if (enabled) enabledSessions.push(sessionId)
  }

  return { defaultMode: settings.defaultMode, enabledSessions }
}

/**
 * 按默认值策略求值。
 *
 * 「工作空间」模式依赖会话归属：宿主侧拿不到映射时按关闭处理，由客户端在打开
 * 会话时把求值结果固化成显式记录。
 * @param settings 当前设置
 * @param workspaceId 会话所属工作空间，未知时为空
 * @returns 求值结果
 */
function defaultValue(settings: AutoRunSettings, workspaceId: string | undefined): boolean {
  switch (settings.defaultMode) {
    case 'on':
      return true
    case 'last':
      return settings.lastEnabled
    case 'workspace':
      return workspaceId !== undefined && settings.workspaces[workspaceId] === true
    case 'off':
      return false
  }
}

/**
 * 求值某个会话的开关状态，并标明是否来自显式记录。
 * @param sessionId 会话标识
 * @param workspaceId 会话所属工作空间，未知时为空
 * @returns 开关状态
 */
export function resolveAutoRunState(sessionId: string, workspaceId?: string): AutoRunState {
  const settings = store.read()
  const explicit = settings.sessions[sessionId]

  if (explicit !== undefined) return { enabled: explicit, explicit: true }

  return { enabled: defaultValue(settings, workspaceId), explicit: false }
}

/**
 * 判断某个会话是否处于全自动模式。
 * @param sessionId 会话标识
 * @returns 开关是否开启
 */
export function isAutoRunEnabled(sessionId: string): boolean {
  const settings = store.read()
  const explicit = settings.sessions[sessionId]

  if (explicit !== undefined) return explicit

  // 宿主侧不知道会话归属哪个工作空间：工作空间模式在这里按关闭处理
  return defaultValue(settings, undefined)
}

/**
 * 写入某个会话的开关状态，并同步「上一次」与工作空间记录。
 *
 * 重复写入会先删后插，让该会话回到记录末尾，裁剪时淘汰的是真正最旧的条目。
 * @param sessionId 会话标识
 * @param enabled 目标状态
 * @param workspaceId 会话所属工作空间，未知时省略
 * @returns 写入后的该会话状态
 */
export function setAutoRunEnabled(
  sessionId: string,
  enabled: boolean,
  workspaceId?: string,
): boolean {
  const current = store.read()
  const sessions = { ...current.sessions }

  delete sessions[sessionId]
  sessions[sessionId] = enabled

  const workspaces = { ...current.workspaces }

  // 工作空间记录只在客户端能确定归属时更新，否则保持上一次的值
  if (workspaceId !== undefined && workspaceId !== '') {
    delete workspaces[workspaceId]
    workspaces[workspaceId] = enabled
  }

  store.write({
    sessions: Object.fromEntries(Object.entries(sessions).slice(-MAX_SESSIONS)),
    workspaces: Object.fromEntries(Object.entries(workspaces).slice(-MAX_WORKSPACES)),
    defaultMode: current.defaultMode,
    lastEnabled: enabled,
  })

  return enabled
}

/**
 * 写入新会话默认状态的来源。
 * @param mode 目标来源
 * @returns 写入后的来源
 */
export function setAutoRunDefaultMode(mode: AutoRunDefaultMode): AutoRunDefaultMode {
  const current = store.read()

  store.write({ ...current, defaultMode: mode })

  return mode
}
