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
