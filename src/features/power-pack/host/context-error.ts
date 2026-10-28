/**
 * 识别「插件上下文已失效」类错误。
 *
 * 插件热重载时旧 fiber 先销毁，而宿主事件仍可能派发到旧监听器，在这类上下文里
 * 建 effect 或读服务必然失败。它不是代码缺陷，而是收尾阶段的预期噪音：新实例
 * 会重新挂载自己的隔离行，旧实例只需安静退出。集中在这里判断，避免每个调用点
 * 各写一份字符串匹配。
 */

/** 宿主以错误码表达的上下文失效。 */
const INACTIVE_CODES = new Set(['INACTIVE_EFFECT', 'INACTIVE_CONTEXT'])

/**
 * 判断错误是否表示上下文已失效。
 * @param error 捕获到的任意错误
 * @returns 属于上下文失效时返回 true
 */
export function isInactiveContextError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  const code = (error as { code?: unknown }).code
  if (typeof code === 'string' && INACTIVE_CODES.has(code)) return true

  // 读服务失败时宿主只给消息、不带码，按文案兜底
  const message = (error as { message?: unknown }).message
  return typeof message === 'string' && message.includes('inactive context')
}
