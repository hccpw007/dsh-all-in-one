/**
 * 「全自动执行」与宿主侧之间的 HTTP 客户端。
 *
 * 自动模式要在宿主侧生效（系统提示词段落与询问应答都在宿主进程里），
 * 浏览器端只通过插件注册的本地路由读写开关与默认值。
 */
import type { AutoRunDefaultMode, AutoRunSettingsSummary, AutoRunState } from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/auto-run'

/** 请求超时；本接口只读写少量标识。 */
const REQUEST_TIMEOUT_MS = 10000

/**
 * 发起一次 JSON 请求。
 * @param search 查询参数，值为 undefined 时不带该参数
 * @param init fetch 配置
 * @returns 解析后的响应体
 */
async function requestJson<T>(
  search: Record<string, string | undefined>,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const url = new URL(ENDPOINT, window.location.origin)

  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined) url.searchParams.set(key, value)
  }

  try {
    const response = await fetch(url.toString(), {
      credentials: 'same-origin',
      cache: 'no-store',
      ...init,
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      let message = text

      try {
        const parsed = JSON.parse(text) as { error?: unknown }
        if (typeof parsed.error === 'string') message = parsed.error
      } catch (error) {
        // 非 JSON 错误体保留原文，便于定位宿主路由问题
        console.error('[auto-run] 解析错误响应失败:', error)
      }

      throw new Error(message || `HTTP ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error('[auto-run] 请求全自动配置失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取某个会话的开关状态。
 * @param sessionId 会话标识
 * @param workspaceId 会话所属工作空间，未知时省略
 * @returns 该会话是否处于全自动模式
 */
export function loadAutoRunState(sessionId: string, workspaceId?: string): Promise<AutoRunState> {
  return requestJson<AutoRunState>({ sessionId, workspaceId })
}

/**
 * 写入某个会话的开关状态。
 * @param sessionId 会话标识
 * @param enabled 目标状态
 * @param workspaceId 会话所属工作空间，未知时省略
 * @returns 宿主确认后的状态
 */
export function saveAutoRunState(
  sessionId: string,
  enabled: boolean,
  workspaceId?: string,
): Promise<AutoRunState> {
  return requestJson<AutoRunState>({}, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId, enabled, workspaceId }),
  })
}

/**
 * 读取设置摘要：默认值来源与显式开启的会话列表。
 * @returns 设置页与侧边栏需要的数据
 */
export function loadAutoRunSettings(): Promise<AutoRunSettingsSummary> {
  return requestJson<AutoRunSettingsSummary>({})
}

/**
 * 写入新会话默认状态的来源。
 * @param defaultMode 目标来源
 * @returns 写入后的设置摘要
 */
export function saveAutoRunDefaultMode(
  defaultMode: AutoRunDefaultMode,
): Promise<AutoRunSettingsSummary> {
  return requestJson<AutoRunSettingsSummary>({}, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ defaultMode }),
  })
}
