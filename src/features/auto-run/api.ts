/**
 * 「全自动执行」与宿主侧之间的 HTTP 客户端。
 *
 * 自动模式要在宿主侧生效（系统提示词段落与询问应答都在宿主进程里），
 * 浏览器端只通过插件注册的本地路由读写当前会话的开关。
 */
import type { AutoRunState } from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/auto-run'

/** 请求超时；本接口只读写一个会话标识。 */
const REQUEST_TIMEOUT_MS = 10000

/**
 * 发起一次 JSON 请求。
 * @param sessionId 会话标识
 * @param init fetch 配置
 * @returns 解析后的开关状态
 */
async function request(sessionId: string, init: RequestInit = {}): Promise<AutoRunState> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const url = new URL(ENDPOINT, window.location.origin)
  url.searchParams.set('sessionId', sessionId)

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

    return (await response.json()) as AutoRunState
  } catch (error) {
    console.error('[auto-run] 请求全自动状态失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取某个会话的开关状态。
 * @param sessionId 会话标识
 * @returns 该会话是否处于全自动模式
 */
export function loadAutoRunState(sessionId: string): Promise<AutoRunState> {
  return request(sessionId)
}

/**
 * 写入某个会话的开关状态。
 * @param sessionId 会话标识
 * @param enabled 目标状态
 * @returns 宿主确认后的状态
 */
export function saveAutoRunState(sessionId: string, enabled: boolean): Promise<AutoRunState> {
  return request(sessionId, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId, enabled }),
  })
}

/** 全量配置的响应形状；字段缺失时按空集合处理。 */
interface AutoRunConfigResponse {
  enabledSessions?: unknown
}

/**
 * 读取所有处于全自动的会话。
 *
 * 侧边栏要给每个会话行判断是否画标识，逐行请求会把列表放大成几十次请求，
 * 因此单独走一次全量读取。
 * @returns 会话标识列表
 */
export async function loadEnabledSessions(): Promise<string[]> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()

      throw new Error(text || `HTTP ${response.status}`)
    }

    const parsed = (await response.json()) as AutoRunConfigResponse
    const list = parsed.enabledSessions

    if (!Array.isArray(list)) return []

    return list.filter((item): item is string => typeof item === 'string')
  } catch (error) {
    console.error('[auto-run] 读取全自动会话列表失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}
