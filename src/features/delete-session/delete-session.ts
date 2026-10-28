/**
 * 「删除会话」开关的共享状态。
 *
 * 宿主没有提供删除会话的能力，本功能把「是否在会话行上显示删除按钮」记在
 * 浏览器本地：设置页与会话行的按钮读同一个键，切换开关后刷新页面即生效。
 */

/** 开关状态在 localStorage 中的键，读写都由本文件完成，避免两端各写一份键名。 */
const DELETE_SESSION_STORAGE_KEY = 'dsh-all-in-one:delete-session'

/**
 * 读取开关状态。
 * @returns 是否在会话行显示删除按钮；存储不可用时按关闭处理
 */
export function readDeleteSessionEnabled(): boolean {
  try {
    return window.localStorage.getItem(DELETE_SESSION_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[delete-session] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否在会话行显示删除按钮
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeDeleteSessionEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(DELETE_SESSION_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[delete-session] 写入开关状态失败:', error)
    return false
  }
}
