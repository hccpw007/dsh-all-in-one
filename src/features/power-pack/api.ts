/**
 * 「技能包」与宿主侧之间的 HTTP 客户端。
 *
 * 设置页运行在宿主同源页面里，直接 fetch 插件注册的本地路由；错误统一抛出，
 * 由页面转成用户可读的提示。
 */
import type {
  PowerPack,
  PowerPackComposeResponse,
  PowerPacksPayload,
  PowerPackWriteRequest,
} from './types'

/** 宿主侧注册的路由地址。 */
const ENDPOINT = '/dsh-all-in-one/power-packs'

/** 请求超时；技能包保存需要重建技能链接目录，留出充足时间。 */
const REQUEST_TIMEOUT_MS = 20000

/**
 * 发起一次 JSON 请求。
 * @param init fetch 配置
 * @returns 解析后的负载
 */
async function request<T>(init: RequestInit = {}): Promise<T> {
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
        console.error('[power-pack] 解析错误响应失败:', error)
      }

      throw new Error(message || `HTTP ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error('[power-pack] 请求技能包接口失败:', error)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * 读取技能包列表与可选项清单。
 * @returns 当前负载
 */
export function loadPowerPacks(): Promise<PowerPacksPayload> {
  return request<PowerPacksPayload>()
}

/**
 * 让宿主侧把「模式 + 技能包」合成为一个组合预设。
 * @param pack 技能包标识
 * @param mode 模式预设标识
 * @returns 已注册的组合预设 id
 */
export function composePowerPack(pack: string, mode: string): Promise<PowerPackComposeResponse> {
  const body: PowerPackWriteRequest = { action: 'compose', pack, mode }

  return request<PowerPackComposeResponse>({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * 保存一个技能包。
 * @param pack 技能包定义
 * @returns 保存后的负载
 */
export function savePowerPack(pack: PowerPack): Promise<PowerPacksPayload> {
  const body: PowerPackWriteRequest = { action: 'save', pack }

  return request<PowerPacksPayload>({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * 删除一个技能包。
 * @param id 技能包标识
 * @returns 删除后的负载
 */
export function deletePowerPack(id: string): Promise<PowerPacksPayload> {
  const body: PowerPackWriteRequest = { action: 'delete', id }

  return request<PowerPacksPayload>({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * 设置新建会话默认预选的技能包。
 * @param id 技能包标识
 * @returns 设置后的负载
 */
export function setDefaultPowerPack(id: string): Promise<PowerPacksPayload> {
  const body: PowerPackWriteRequest = { action: 'setDefault', id }

  return request<PowerPacksPayload>({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}
