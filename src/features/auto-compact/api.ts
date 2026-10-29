/**
 * 「自动压缩会话」与宿主侧之间的 HTTP 客户端。
 *
 * 压缩由宿主侧在会话空闲时执行，阈值必须存在宿主进程读得到的位置，因此
 * 浏览器端统一走插件注册的本地路由读写配置。
 */
import type { AutoCompactSettings } from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/auto-compact'

/** 请求超时；本接口只读写一份小配置。 */
const REQUEST_TIMEOUT_MS = 10000

/**
 * 发起一次 JSON 请求。
 * @param init fetch 配置
 * @returns 解析后的配置
 */
async function request(init: RequestInit = {}): Promise<AutoCompactSettings> {
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
        console.error('[auto-compact] 解析错误响应失败:', error)
      }

      throw new Error(message || `HTTP ${response.status}`)
    }

    return (await response.json()) as AutoCompactSettings
  } catch (error) {
    console.error('[auto-compact] 请求自动压缩设置失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取当前设置。
 * @returns 开关与阈值
 */
export function loadAutoCompactSettings(): Promise<AutoCompactSettings> {
  return request()
}

/**
 * 更新设置；只提交传入的字段。
 * @param update 要变更的字段
 * @returns 更新后的设置
 */
export function saveAutoCompactSettings(
  update: Partial<AutoCompactSettings>,
): Promise<AutoCompactSettings> {
  return request({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(update),
  })
}
