/**
 * 「清空会话」与宿主删除路由之间的 HTTP 客户端。
 *
 * 不勾选「保留当前会话」时，旧对话的本地记录要由宿主删除；会话文件在宿主进程
 * 的磁盘上，浏览器删不掉。这里只复用「删除会话」功能已公开的同一条本地路由，
 * 不反向依赖那个 feature 的代码。
 */
import type { DeleteSessionResponse } from './types'

/** 宿主侧注册的单条会话删除路由，与「删除会话」功能共用。 */
const ENDPOINT = '/dsh-all-in-one/sessions'

/** 请求超时；删除需要定位会话目录并递归删除文件。 */
const REQUEST_TIMEOUT_MS = 15000

/**
 * 请求宿主删除一条会话的本地记录。
 * @param sessionId 会话标识
 * @returns 宿主确认删除后完成；失败时抛出可读原因
 */
export async function requestDeleteSession(sessionId: string): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId }),
      signal: controller.signal,
    })

    if (!response.ok) {
      // 404 表示这条会话在磁盘上已经不存在：清空的目标本就是让它消失，按已完成处理
      if (response.status === 404) {
        console.info('[clear-session] 旧会话已不存在，按已清空处理:', sessionId)
        return
      }

      const text = await response.text()
      // 错误体可能不是 JSON（例如宿主未注册该路由时的 404 页面），此时只保留状态码
      let message = `HTTP ${response.status}`

      try {
        const parsed = JSON.parse(text) as { error?: unknown }
        if (typeof parsed.error === 'string') message = parsed.error
        else console.error('[clear-session] 宿主返回了非预期错误体:', text)
      } catch (error) {
        console.error('[clear-session] 解析错误响应失败:', error, text)
      }

      throw new Error(message)
    }

    const payload = (await response.json()) as DeleteSessionResponse
    if (payload.deleted !== true) throw new Error(payload.error ?? '宿主未确认删除')
  } catch (error) {
    console.error('[clear-session] 请求宿主删除会话失败:', sessionId, error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}
