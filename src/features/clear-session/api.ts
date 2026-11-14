/**
 * 「清空会话」与宿主路由之间的 HTTP 客户端。
 *
 * 两件事都必须由宿主做，浏览器做不到：
 *   - 删除旧对话的本地记录：会话文件在宿主进程的磁盘上；这里复用「删除会话」
 *     功能已公开的同一条本地路由，不反向依赖那个 feature 的代码；
 *   - 停止正在执行的轮次：执行由宿主持有，只能请求它中断。
 */
import type { DeleteSessionResponse } from './types'

/** 宿主侧注册的单条会话删除路由，与「删除会话」功能共用。 */
const ENDPOINT = '/dsh-all-in-one/sessions'

/** 请求超时；删除需要定位会话目录并递归删除文件。 */
const REQUEST_TIMEOUT_MS = 15000

/** 停止路由；宿主收到后立即中断当前轮次，不等任务自然结束。 */
const CANCEL_ENDPOINT = '/dsh-all-in-one/session/cancel'

/** 停止请求超时；中断只是把取消交给 Agent，正常在毫秒级返回。 */
const CANCEL_TIMEOUT_MS = 5000

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

/**
 * 请求宿主停止一条会话正在执行的轮次。
 * @param sessionId 会话标识
 * @returns 取消已交给宿主；会话本来就没在跑时同样视为完成
 */
export async function requestCancelSession(sessionId: string): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), CANCEL_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(CANCEL_ENDPOINT, window.location.origin).toString(), {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId }),
      signal: controller.signal,
    })

    // 404 表示宿主侧没有这条会话的 Agent：它本来就没在跑，停止目标已经达成
    if (response.status === 404) {
      console.info('[clear-session] 会话未在运行，无需停止:', sessionId)

      return
    }

    if (!response.ok) {
      const text = await response.text()
      // 错误体可能不是 JSON（例如宿主未注册该路由），此时只保留状态码
      let message = `HTTP ${response.status}`

      try {
        const parsed = JSON.parse(text) as { error?: unknown }
        if (typeof parsed.error === 'string') message = parsed.error
        else console.error('[clear-session] 停止接口返回了非预期错误体:', text)
      } catch (error) {
        console.error('[clear-session] 解析停止接口错误响应失败:', error, text)
      }

      throw new Error(message)
    }
  } catch (error) {
    console.error('[clear-session] 请求宿主停止任务失败:', sessionId, error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}
