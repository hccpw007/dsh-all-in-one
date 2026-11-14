/**
 * 清空确认请求的共享状态。
 *
 * 输入框旁的按钮挂在宿主 DOM 里，确认弹窗注册在宿主浮层插槽中：按钮写入请求，
 * 弹窗读取请求并渲染。形状与宿主插槽的 `hooks` 约定一致
 * （`getSnapshot` / `subscribe`），因此可以直接作为 hook 源注入。
 */
import type { ClearSessionTarget } from './types'

/** 快照存储需要满足的最小形状。 */
interface ClearSessionStore {
  /** 当前待确认目标；没有请求时为 null，引用保持不变以便快照比较。 */
  getSnapshot(): ClearSessionTarget | null
  /** 订阅变更，返回取消订阅函数。 */
  subscribe(listener: () => void): () => void
  /** 写入一次待确认目标。 */
  request(target: ClearSessionTarget): void
  /** 清空请求（确认、取消或执行结束后都走这里）。 */
  settle(): void
}

const listeners = new Set<() => void>()

let pending: ClearSessionTarget | null = null

/** 通知所有订阅者：待确认目标发生变化。 */
function notify(): void {
  for (const listener of [...listeners]) {
    try {
      listener()
    } catch (error) {
      console.error('[clear-session] 确认弹窗订阅者处理失败:', error)
    }
  }
}

/** 清空确认请求的全局快照存储。 */
export const clearSessionStore: ClearSessionStore = {
  getSnapshot: () => pending,

  subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  request(target) {
    pending = target
    notify()
  },

  settle() {
    if (pending === null) return

    pending = null
    notify()
  },
}
