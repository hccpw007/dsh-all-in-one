/**
 * 「提示词优化」与宿主路由之间的 HTTP 客户端。
 *
 * 优化要调模型，只能在宿主侧发生；浏览器这一端只负责把原文送出去、把结果收回来。
 */
import type { OptimizePayload } from './types'

/** 宿主注册的优化路由。 */
const ENDPOINT = '/dsh-all-in-one/prompt-optimize'

/**
 * 请求超时。
 *
 * 比宿主侧的端到端超时（60 秒）略长：让宿主先超时并返回可读原因，
 * 浏览器这层只兜住「宿主完全没有响应」的情况。
 */
const REQUEST_TIMEOUT_MS = 75000

/**
 * 请求一次提示词优化。
 * @param text 待优化的原文
 * @param sessionId 会话标识；新会话尚未创建时省略
 * @returns 优化后的文本
 * @throws 优化失败时抛出带可读原因的 Error
 */
export async function requestOptimize(text: string, sessionId?: string): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, sessionId }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const payload = await readPayload(response)
      throw new Error(payload.error ?? `HTTP ${response.status}`)
    }

    const payload = await readPayload(response)
    if (payload.optimized === undefined || payload.optimized === '') {
      throw new Error(payload.error ?? '优化结果为空')
    }

    return payload.optimized
  } catch (error) {
    console.error('[prompt-optimize] 请求优化失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读出响应体里的载荷。
 *
 * 路由的失败响应也是 JSON；解析不出来说明请求被别的东西接管了（网关、代理、
 * 宿主版本差异），此时把原文当作错误消息交给调用方，比只报状态码更有用。
 * @param response 响应
 * @returns 载荷；不是 JSON 时返回 `{ error: 原文 }`
 */
async function readPayload(response: Response): Promise<OptimizePayload> {
  const text = await response.text()

  try {
    return JSON.parse(text) as OptimizePayload
  } catch (error) {
    console.error('[prompt-optimize] 解析响应失败:', error)

    return { error: text === '' ? `HTTP ${response.status}` : text }
  }
}
