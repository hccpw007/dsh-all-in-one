/**
 * 删除确认请求的共享状态。
 *
 * 删除入口（会话行按钮、工作区「更多」菜单）与确认弹窗挂在不同插槽里：
 * 入口写入请求，弹窗读取请求并渲染。这里用一个最小的快照存储串起两者，
 * 形状与宿主插槽的 `hooks` 约定一致（`getSnapshot` / `subscribe`），
 * 因此可以直接作为 hook 源注入。
 */

/**
 * 待确认的一次删除。
 *
 * 会话行的删除按钮提交单条会话，工作区「更多」菜单里的批量入口提交整个
 * 工作区里可删的会话；两种请求共用一个确认弹窗，用 `kind` 区分文案与执行动作。
 */
export type DeleteConfirmRequest =
  | {
    kind: 'session'
    /** 会话标识。 */
    sessionId: string
    /** 会话标题，用于在弹窗里指名要删除哪一条。 */
    title: string
  }
  | {
    kind: 'workspace'
    /** 工作区标识，删除后主视图需要切到该工作区剩余会话。 */
    workspaceId: string
    /** 工作区标题，用于在弹窗里指名要清理哪个工作区。 */
    title: string
    /** 本次要删除的会话标识：工作区里所有非运行中的会话（含已归档会话）。 */
    sessionIds: string[]
  }

/** 快照存储需要满足的最小形状。 */
interface DeleteConfirmStore {
  /** 当前待确认请求；没有请求时为 null，引用保持不变以便快照比较。 */
  getSnapshot(): DeleteConfirmRequest | null
  /** 订阅变更，返回取消订阅函数。 */
  subscribe(listener: () => void): () => void
  /** 写入一次待确认请求。 */
  request(next: DeleteConfirmRequest): void
  /** 清空请求（确认、取消或删除结束后都走这里）。 */
  settle(): void
}

const listeners = new Set<() => void>()

let pending: DeleteConfirmRequest | null = null

/** 通知所有订阅者：待确认请求发生变化。 */
function notify(): void {
  for (const listener of [...listeners]) {
    try {
      listener()
    } catch (error) {
      console.error('[delete-session] 确认弹窗订阅者处理失败:', error)
    }
  }
}

/** 删除确认请求的全局快照存储。 */
export const deleteConfirmStore: DeleteConfirmStore = {
  getSnapshot: () => pending,

  subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  request(next) {
    pending = next
    notify()
  },

  settle() {
    if (pending === null) return

    pending = null
    notify()
  },
}
