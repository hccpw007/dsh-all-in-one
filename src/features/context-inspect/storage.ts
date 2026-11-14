/**
 * 「上下文详情」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次该状态决定是否接管上下文弹层，设置页的开关
 * 写同一个键；切换开关后刷新页面即可生效。默认开启：功能只在用户点击弹层里的
 * 两行时才动作，不改变宿主默认界面。
 */

/** 开关状态在 localStorage 中的键，开关组件与客户端扩展共用。 */
const CONTEXT_INSPECT_STORAGE_KEY = 'dsh-all-in-one:context-inspect'

/**
 * 读取开关状态。
 * @returns 是否接管上下文弹层；没有存过值时按开启处理，存储不可用时按关闭处理
 */
export function readContextInspectEnabled(): boolean {
  try {
    const stored = window.localStorage.getItem(CONTEXT_INSPECT_STORAGE_KEY)

    return stored === null ? true : stored === '1'
  } catch (error) {
    console.error('[context-inspect] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否接管上下文弹层
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeContextInspectEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(CONTEXT_INSPECT_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[context-inspect] 写入开关状态失败:', error)
    return false
  }
}
