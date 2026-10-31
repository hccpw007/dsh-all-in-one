/**
 * 「对话加速」与宿主侧之间的 HTTP 客户端。
 *
 * 勾选结果由宿主进程消费（注册批量工具、补并发声明、改裁剪预算），
 * 因此统一走插件注册的本地路由读写，而不是浏览器本地存储。
 */
import type { ChatAccelSettings } from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/chat-accel'

/** 请求超时；本接口只读写一份小配置。 */
const REQUEST_TIMEOUT_MS = 10000

/**
 * 发起一次 JSON 请求。
 * @param init fetch 配置
 * @returns 解析后的设置
 */
async function request(init: RequestInit = {}): Promise<ChatAccelSettings> {
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
        console.error('[chat-accel] 解析错误响应失败:', error)
      }

      throw new Error(message || `HTTP ${response.status}`)
    }

    return (await response.json()) as ChatAccelSettings
  } catch (error) {
    console.error('[chat-accel] 请求设置失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取当前设置。
 * @returns 已启用条目与裁剪阈值
 */
export function loadChatAccelSettings(): Promise<ChatAccelSettings> {
  return request()
}

/**
 * 更新设置；只提交传入的字段。
 * @param update 要变更的字段
 * @returns 更新后的设置
 */
export function saveChatAccelSettings(
  update: Partial<ChatAccelSettings>,
): Promise<ChatAccelSettings> {
  return request({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(update),
  })
}
