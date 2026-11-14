/**
 * 「清空会话」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次该状态决定是否注入输入框按钮，
 * 设置页的开关写同一个键；切换开关后刷新页面即可生效。
 */

/** 开关状态在 localStorage 中的键，开关组件与客户端扩展共用。 */
const CLEAR_SESSION_STORAGE_KEY = 'dsh-all-in-one:clear-session'

/**
 * 读取开关状态。
 * @returns 是否在输入框旁显示清空按钮；存储不可用时按关闭处理
 */
export function readClearSessionEnabled(): boolean {
  try {
    return window.localStorage.getItem(CLEAR_SESSION_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[clear-session] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否在输入框旁显示清空按钮
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeClearSessionEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(CLEAR_SESSION_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[clear-session] 写入开关状态失败:', error)
    return false
  }
}
