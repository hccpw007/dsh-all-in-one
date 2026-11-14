/**
 * 「编辑排队消息」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次该状态决定是否安装排队条上的按钮，设置页的
 * 开关写同一个键；切换开关后刷新页面即可生效。
 */

/** 开关状态在 localStorage 中的键，开关组件与客户端扩展共用。 */
const QUEUE_EDIT_STORAGE_KEY = 'dsh-all-in-one:queue-edit'

/**
 * 读取开关状态。
 * @returns 是否接管排队消息的编辑按钮；存储不可用时按关闭处理
 */
export function readQueueEditEnabled(): boolean {
  try {
    return window.localStorage.getItem(QUEUE_EDIT_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[queue-edit] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否接管排队消息的编辑按钮
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeQueueEditEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(QUEUE_EDIT_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[queue-edit] 写入开关状态失败:', error)
    return false
  }
}
