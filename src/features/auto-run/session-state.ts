/**
 * 「全自动」会话集合的浏览器端缓存。
 *
 * 侧边栏每一行都要判断是否画闪电标识；若逐行请求宿主，几十个会话就是几十个请求，
 * 因此这里只在页面加载后拉一次全量配置，页面内共享同一份集合。
 *
 * 集合的来源仍是宿主配置文件：开关切换后就地更新，页面刷新后重新拉取。
 */
import { loadEnabledSessions } from './api'

/** 已开启全自动的会话标识。 */
const enabledSessions = new Set<string>()

/** 订阅者：标识装饰器在集合变化后重新扫描列表。 */
const listeners = new Set<() => void>()

/**
 * 首次拉取是否已经发出。
 *
 * 只需要一次；失败后清回 false，让下一次调用能重试，否则一次网络抖动会让整页
 * 直到刷新前都不显示标识。
 */
let loadStarted = false

/** 通知所有订阅者重新计算。 */
function notify(): void {
  for (const listener of listeners) listener()
}

/**
 * 订阅集合变化。
 * @param listener 变化回调
 * @returns 取消订阅
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

/**
 * 首次调用时拉取全量配置；并发调用共用同一次请求。
 */
export function ensureEnabledSessionsLoaded(): void {
  if (loadStarted) return
  loadStarted = true

  void loadEnabledSessions()
    .then((sessionIds) => {
      enabledSessions.clear()
      for (const sessionId of sessionIds) enabledSessions.add(sessionId)
      notify()
    })
    .catch((error: unknown) => {
      // 读取失败只记日志：标识缺失不影响对话本身，下次调用再试
      console.error('[auto-run] 读取全自动会话列表失败:', error)
      loadStarted = false
    })
}

/**
 * 就地更新某个会话，供开关切换后同步侧边栏标识。
 * @param sessionId 会话标识
 * @param enabled 目标状态
 */
export function setSessionEnabled(sessionId: string, enabled: boolean): void {
  if (enabled) enabledSessions.add(sessionId)
  else enabledSessions.delete(sessionId)

  notify()
}

/**
 * 读取某个会话是否处于全自动。
 * @param sessionId 会话标识；缺省时返回 false
 * @returns 是否应展示标识
 */
export function isEnabled(sessionId: string): boolean {
  return enabledSessions.has(sessionId)
}
