/**
 * 「会话历史左侧」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次，决定是否搬运导航条；设置页的开关写同一个键，
 * 切换开关后刷新页面即可生效。
 */

/** 开关状态存储键：是否把轮次导航条移到左侧。 */
const SESSION_HISTORY_STORAGE_KEY = 'dsh-all-in-one:session-history'

/**
 * 读取开关状态。
 * @returns 是否移动导航条；存储不可用时按关闭处理
 */
export function readSessionHistoryEnabled(): boolean {
  try {
    return window.localStorage.getItem(SESSION_HISTORY_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[session-history] 读取开关状态失败:', SESSION_HISTORY_STORAGE_KEY, error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否移动导航条
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeSessionHistoryEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[session-history] 写入开关状态失败:', SESSION_HISTORY_STORAGE_KEY, error)
    return false
  }
}
