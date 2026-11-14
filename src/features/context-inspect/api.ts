/**
 * 「上下文详情」的宿主接口调用。
 *
 * 详情由宿主侧从会话日志读出，浏览器端只发一条带会话 id 的 GET；
 * 错误统一转成带可读说明的异常，由窗口显示给用户。
 */
import type { ContextInspectPayload } from './types'

/** 详情接口路径，与宿主侧注册的路由一致。 */
const ENDPOINT = '/dsh-all-in-one/context-inspect'

/** 读取超时：大会话解压较慢，但超过这个时间说明宿主侧已经卡住。 */
const REQUEST_TIMEOUT_MS = 15_000

/**
 * 读取一条会话的上下文详情。
 * @param sessionId 会话标识
 * @param signal 外部取消信号；窗口关闭时中止请求
 * @returns 系统提示词与工具定义
 * @throws 宿主返回非 2xx 或网络失败时抛出，消息可直接展示
 */
export async function requestContextInspect(
  sessionId: string,
  signal?: AbortSignal,
): Promise<ContextInspectPayload> {
  // 窗口在请求发出前就关掉了：直接按取消处理，不发无意义的请求
  if (signal?.aborted === true) throw new Error('请求已取消')

  const controller = new AbortController()
  const timer = window.setTimeout(() => { controller.abort() }, REQUEST_TIMEOUT_MS)
  // 外部取消与自身超时都会中止请求，用标记区分二者，才能给出准确提示
  let cancelled = false
  const abort = (): void => {
    cancelled = true
    controller.abort()
  }
  signal?.addEventListener('abort', abort)

  try {
    const response = await fetch(`${ENDPOINT}?session=${encodeURIComponent(sessionId)}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })

    const body: unknown = await response.json()
    if (!response.ok) {
      const message = typeof body === 'object' && body !== null && typeof (body as { error?: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${response.status}`

      throw new Error(message)
    }

    return body as ContextInspectPayload
  } catch (error) {
    // 超时与外部取消都表现为 AbortError；区分开才能给出有用的提示
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(cancelled ? '请求已取消' : '读取超时')
    }

    console.error('[context-inspect] 读取上下文详情失败:', sessionId, error)
    throw error instanceof Error ? error : new Error(String(error))
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}
