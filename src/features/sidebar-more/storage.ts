/**
 * 「菜单收进更多」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次，决定是否把侧边栏顶部的面板入口搬进左下角的
 * 「更多」菜单；设置页的开关写同一个键，切换开关后刷新页面即可生效。
 */

/** 开关状态存储键：是否把侧边栏顶部的面板入口收进底部「更多」菜单。 */
const SIDEBAR_MORE_STORAGE_KEY = 'dsh-all-in-one:sidebar-more'

/**
 * 读取开关状态。
 * @returns 是否把顶部面板入口收进底部菜单；存储不可用时按关闭处理
 */
export function readSidebarMoreEnabled(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_MORE_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[sidebar-more] 读取开关状态失败:', SIDEBAR_MORE_STORAGE_KEY, error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否把顶部面板入口收进底部菜单
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeSidebarMoreEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(SIDEBAR_MORE_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[sidebar-more] 写入开关状态失败:', SIDEBAR_MORE_STORAGE_KEY, error)
    return false
  }
}
