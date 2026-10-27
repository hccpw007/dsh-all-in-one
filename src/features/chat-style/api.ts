/**
 * 「对话风格」与宿主侧之间的 HTTP 客户端。
 *
 * 设置页运行在宿主同源页面里，直接 fetch 插件注册的本地路由；错误统一抛出，
 * 由页面转成用户可读的提示。
 */
import type {
  ChatStyle,
  ChatStylesPayload,
  ChatStyleWriteRequest,
} from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/chat-styles'

/** 请求超时；风格保存需要重建技能链接目录，留出充足时间。 */
const REQUEST_TIMEOUT_MS = 20000

/**
 * 发起一次 JSON 请求。
 * @param init fetch 配置
 * @returns 解析后的负载
 */
async function request(init: RequestInit = {}): Promise<ChatStylesPayload> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
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
        console.error('[chat-style] 解析错误响应失败:', error)
      }

      throw new Error(message || `HTTP ${response.status}`)
    }

    return (await response.json()) as ChatStylesPayload
  } catch (error) {
    console.error('[chat-style] 请求风格接口失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取风格列表与可选项清单。
 * @returns 当前负载
 */
export function loadChatStyles(): Promise<ChatStylesPayload> {
  return request()
}

/**
 * 保存一个风格。
 * @param style 风格定义
 * @returns 保存后的负载
 */
export function saveChatStyle(style: ChatStyle): Promise<ChatStylesPayload> {
  const body: ChatStyleWriteRequest = { action: 'save', style }

  return request({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * 删除一个风格。
 * @param id 风格标识
 * @returns 删除后的负载
 */
export function deleteChatStyle(id: string): Promise<ChatStylesPayload> {
  const body: ChatStyleWriteRequest = { action: 'delete', id }

  return request({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}
