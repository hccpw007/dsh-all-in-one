/**
 * 「删除会话」与宿主侧之间的 HTTP 客户端。
 *
 * 会话数据在宿主进程的磁盘上，浏览器无法直接删除，只能通过插件注册的本地
 * 路由请求宿主删除；错误统一抛出，由删除入口转成用户可读的提示。
 */
import type {
  DeleteSessionRequest,
  DeleteSessionResponse,
  DeleteSessionsRequest,
  DeleteSessionsResponse,
} from './types'

/** 宿主侧注册的单条删除路由。 */
const ENDPOINT = '/dsh-all-in-one/sessions'

/** 宿主侧注册的批量删除路由。 */
const BATCH_ENDPOINT = '/dsh-all-in-one/sessions/batch'

/** 单条请求超时；删除需要遍历会话目录并递归删除文件。 */
const REQUEST_TIMEOUT_MS = 15000

/** 批量请求超时；宿主逐条删除，会话多时需要留足时间。 */
const BATCH_TIMEOUT_MS = 120000

/**
 * 向宿主路由提交一次 JSON 请求。
 * @param path 路由路径
 * @param body 请求体
 * @param timeoutMs 超时时间
 * @returns 解析后的响应体
 */
async function postJson<T>(path: string, body: unknown, timeoutMs: number): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(new URL(path, window.location.origin).toString(), {
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

    return (await response.json()) as T
  } catch (error) {
    console.error('[delete-session] 请求宿主失败:', path, error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 请求宿主删除一个会话。
 * @param sessionId 会话标识
 * @returns 宿主确认删除后完成
 */
export async function requestDeleteSession(sessionId: string): Promise<void> {
  const body: DeleteSessionRequest = { sessionId }
  const payload = await postJson<DeleteSessionResponse>(ENDPOINT, body, REQUEST_TIMEOUT_MS)

  if (payload.deleted !== true) throw new Error('宿主未确认删除')
}

/**
 * 请求宿主批量删除一个工作区里的多个会话。
 * @param sessionIds 会话标识列表
 * @returns 成功删除与失败的会话；个别会话不存在不会让整次请求失败
 */
export async function requestDeleteSessions(sessionIds: string[]): Promise<DeleteSessionsResponse> {
  const body: DeleteSessionsRequest = { sessionIds }
  const payload = await postJson<DeleteSessionsResponse>(BATCH_ENDPOINT, body, BATCH_TIMEOUT_MS)

  // 响应缺少结果字段说明宿主版本不匹配，按失败处理而不是静默当作全部成功
  if (!Array.isArray(payload.deleted)) throw new Error('宿主未返回删除结果')

  return {
    deleted: payload.deleted,
    failed: Array.isArray(payload.failed) ? payload.failed : [],
  }
}
