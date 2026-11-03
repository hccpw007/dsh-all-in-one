/**
 * 「项目会话数」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次，决定是否在侧边栏项目名后显示会话数量；
 * 设置页的开关写同一个键，切换后刷新页面即可生效。
 */

/** 开关状态存储键：是否在侧边栏项目名后显示会话数量。 */
const WORKSPACE_SESSION_COUNT_STORAGE_KEY = 'dsh-all-in-one:workspace-session-count'

/**
 * 读取开关状态。
 * @returns 是否显示会话数量；存储不可用时按关闭处理
 */
export function readWorkspaceSessionCountEnabled(): boolean {
  try {
    return window.localStorage.getItem(WORKSPACE_SESSION_COUNT_STORAGE_KEY) === '1'
  } catch (error) {
    console.error(
      '[workspace-session-count] 读取开关状态失败:',
      WORKSPACE_SESSION_COUNT_STORAGE_KEY,
      error,
    )
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否显示会话数量
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeWorkspaceSessionCountEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(WORKSPACE_SESSION_COUNT_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error(
      '[workspace-session-count] 写入开关状态失败:',
      WORKSPACE_SESSION_COUNT_STORAGE_KEY,
      error,
    )
    return false
  }
}
