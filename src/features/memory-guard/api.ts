/**
 * 「内存守护」与宿主侧的 HTTP 客户端。
 *
 * 浏览器拿不到渲染进程的真实内存占用，只有宿主能通过进程表定位同一个 Electron
 * 渲染进程。桌面版因此读宿主路由返回的物理内存，浏览器打开的实例（dev / 远程）拿不到，
 * 由调用方退回页面 JS 堆读数。
 */
import type { HostMemoryPayload } from './types'

/** 宿主注册的内存读数路由。 */
const ENDPOINT = '/dsh-all-in-one/memory-guard'

/** 请求超时；该接口只做一次进程表读取，正常在百毫秒内返回。 */
const REQUEST_TIMEOUT_MS = 2500

/** 是否已经记录过一次失败，避免每次检查都刷同一条日志。 */
let failureReported = false

/**
 * 读取宿主侧的进程内存。
 *
 * 失败不算异常路径：浏览器环境本来就没有渲染进程可定位，路由也可能因为宿主版本
 * 差异不存在。这里只记录一次原因并返回 null，由调用方降级到页面读数。
 * @returns 宿主内存读数；不可用时返回 null
 */
export async function fetchHostMemory(): Promise<HostMemoryPayload | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(new URL(ENDPOINT, window.location.origin).toString(), {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }

    const payload = (await response.json()) as HostMemoryPayload
    failureReported = false

    return payload
  } catch (error) {
    if (!failureReported) {
      failureReported = true
      console.warn('[memory-guard] 读取宿主进程内存失败，改用页面读数:', error)
    }

    return null
  } finally {
    window.clearTimeout(timer)
  }
}
