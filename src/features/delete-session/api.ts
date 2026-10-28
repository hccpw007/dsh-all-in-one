/**
 * 「删除会话」与宿主侧之间的 HTTP 客户端。
 *
 * 会话数据在宿主进程的磁盘上，浏览器无法直接删除，只能通过插件注册的本地
 * 路由请求宿主删除；错误统一抛出，由会话行按钮转成用户可读的提示。
 */
import type { DeleteSessionRequest, DeleteSessionResponse } from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/sessions'

/** 请求超时；删除需要遍历会话目录并递归删除文件。 */
const REQUEST_TIMEOUT_MS = 15000

/**
 * 请求宿主删除一个会话。
 * @param sessionId 会话标识
 * @returns 宿主确认删除后完成
 */
export async function requestDeleteSession(sessionId: string): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const body: DeleteSessionRequest = { sessionId }

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      // 错误体可能是 HTML（例如宿主未注册本路由时的 404 页面），此时只保留状态码
      let message = `HTTP ${response.status}`

      try {
        const parsed = JSON.parse(text) as { error?: unknown }
        if (typeof parsed.error === 'string') message = parsed.error
        else console.error('[delete-session] 宿主返回了非预期错误体:', text)
      } catch (error) {
        console.error('[delete-session] 解析错误响应失败:', error, text)
      }

      throw new Error(message)
    }

    const payload = (await response.json()) as DeleteSessionResponse
    if (payload.deleted !== true) throw new Error('宿主未确认删除')
  } catch (error) {
    console.error('[delete-session] 请求删除会话失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}
