/**
 * 「复制工作区路径」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次，决定是否向宿主工作区菜单注册「复制路径」；
 * 设置页的开关写同一个键，切换后刷新页面即可生效。
 */

/** 开关状态存储键：是否在工作区菜单里提供「复制路径」。 */
const COPY_WORKSPACE_PATH_STORAGE_KEY = 'dsh-all-in-one:copy-workspace-path'

/**
 * 读取开关状态。
 * @returns 是否提供菜单项；存储不可用时按关闭处理
 */
export function readCopyWorkspacePathEnabled(): boolean {
  try {
    return window.localStorage.getItem(COPY_WORKSPACE_PATH_STORAGE_KEY) === '1'
  } catch (error) {
    console.error(
      '[copy-workspace-path] 读取开关状态失败:',
      COPY_WORKSPACE_PATH_STORAGE_KEY,
      error,
    )
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否提供菜单项
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeCopyWorkspacePathEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(COPY_WORKSPACE_PATH_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error(
      '[copy-workspace-path] 写入开关状态失败:',
      COPY_WORKSPACE_PATH_STORAGE_KEY,
      error,
    )
    return false
  }
}
