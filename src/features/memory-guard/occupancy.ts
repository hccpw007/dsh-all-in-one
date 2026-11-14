/**
 * 「能不能重建」的判定材料。
 *
 * 重建会重建整个 renderer，唯一不能接受的是打断正在发生的事：正在执行的轮次、
 * 已提交但还没落地的消息、还没发出去的草稿。三者之外，滚动位置与面板状态虽然
 * 会重置，但都不涉及数据，属于可接受的代价。
 *
 * 交互时间戳由模块级变量维护：重建后模块重新加载，计时自然从零开始，不需要
 * 额外持久化。
 */
import type { SessionsApi } from '../../types/plugin'
import type { OccupancyState } from './types'

/** 最后一次人工交互的时间戳；模块加载时视为刚交互过。 */
let lastInteractionAt = Date.now()

/**
 * 记录一次人工交互。
 *
 * 只监听「用户真的动手」的事件：指针、键盘、滚轮、触摸与输入。定时器、网络
 * 响应与流式输出都不算，否则会话一直在输出时永远等不到空闲。
 */
function markInteraction(): void {
  lastInteractionAt = Date.now()
}

/** 需要计入交互的事件；滚动与触摸都要算，否则「看着不动」会被误判为空闲。 */
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'input'] as const

/**
 * 安装交互监听。
 *
 * 用捕获阶段 + passive：宿主界面里的按钮可能阻止冒泡，冒泡阶段会漏掉点击；
 * passive 保证滚动监听不拖慢滚动。
 * @returns 移除监听的函数
 */
export function installInteractionTracking(): () => void {
  markInteraction()

  for (const eventName of INTERACTION_EVENTS) {
    document.addEventListener(eventName, markInteraction, { capture: true, passive: true })
  }

  return () => {
    for (const eventName of INTERACTION_EVENTS) {
      document.removeEventListener(eventName, markInteraction, { capture: true })
    }
  }
}

/**
 * 检查输入框里是否有未发送的草稿。
 *
 * DSH 自身会把草稿持久化，重建不丢文字；但草稿状态在提交瞬间可能正在写盘，
 * 而且让用户看到「刚打的字不见了」体验太差，因此把「有草稿」整类排除在自动重建外。
 * 只看可见的 textarea 与 contenteditable，避免把隐藏弹窗里的内容算进来。
 * @returns 存在非空草稿时返回 true
 */
function hasDraft(): boolean {
  const fields = document.querySelectorAll<HTMLElement>('textarea, [contenteditable="true"]')

  for (const field of fields) {
    if (field.offsetParent === null && field.getClientRects().length === 0) continue

    const text = field instanceof HTMLTextAreaElement ? field.value : (field.textContent ?? '')
    if (text.trim() !== '') return true
  }

  return false
}

/**
 * 读取当前占用状态。
 * @param sessions 宿主会话列表服务；缺失时无法确认是否有任务在跑，按「忙」处理
 * @returns 运行中、提交中、草稿、空闲时长与焦点状态
 */
export function readOccupancy(sessions: SessionsApi | undefined): OccupancyState {
  const idleMs = Date.now() - lastInteractionAt
  const focused = typeof document.hasFocus === 'function' ? document.hasFocus() : true

  if (sessions === undefined) {
    return { running: true, submitting: true, draft: hasDraft(), idleMs, focused }
  }

  let running = false
  let submitting = false

  try {
    const snapshot = sessions.list.getSnapshot()

    for (const id of snapshot.ids) {
      const summary = snapshot.byId[id]
      if (summary?.running === true) running = true

      // 只有被宿主持有时才能读到会话快照；读不到说明该会话不在当前视图里
      const binding = sessions.binding?.(id)
      if (binding === undefined) continue

      const snapshotOfSession = binding.session.getSnapshot()
      if (snapshotOfSession.pendingSubmissions.length > 0) submitting = true
    }
  } catch (error) {
    console.error('[memory-guard] 读取会话运行状态失败，按忙处理:', error)

    return { running: true, submitting: true, draft: hasDraft(), idleMs, focused }
  }

  return { running, submitting, draft: hasDraft(), idleMs, focused }
}

/**
 * 把空闲时长改为「刚刚交互过」。
 *
 * 用户取消重建、或手动触发过一次回收后调用：否则同一个检查点会立刻再次满足
 * 条件，取消按钮形同虚设。
 */
export function resetIdleClock(): void {
  markInteraction()
}
