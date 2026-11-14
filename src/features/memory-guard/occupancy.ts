/**
 * 「能不能重建」的判定材料。
 *
 * 重建会重建整个 renderer。运行中的任务不再作为阻断条件：宿主把事件流持久化在
 * 磁盘上，页面重载后重放历史并重新连接，正在生成的输出会在重连后继续，因此
 * 「有任务在跑」不再是拒绝重建的理由。
 *
 * 输入框草稿同样不阻止重建：DSH 的 composer draft 自带持久化（survives reloads），
 * 重载后原样恢复。滚动位置与面板状态会重置，但都不涉及数据，属于可接受的代价。
 *
 * 交互时间戳由模块级变量维护：重建后模块重新加载，计时自然从零开始，不需要
 * 额外持久化。
 */
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
 * 读取当前占用状态。
 * @returns 空闲时长与焦点状态
 */
export function readOccupancy(): OccupancyState {
  return {
    idleMs: Date.now() - lastInteractionAt,
    focused: typeof document.hasFocus === 'function' ? document.hasFocus() : true,
  }
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
