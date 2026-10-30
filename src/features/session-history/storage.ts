/**
 * 「会话历史左侧」两个开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次，决定是否移动导航条、是否显示轮次文本；
 * 设置页的开关写同一对键，切换开关后刷新页面即可生效。
 */

/** 主开关：是否把轮次导航条移到左侧。 */
const SESSION_HISTORY_STORAGE_KEY = 'dsh-all-in-one:session-history'

/** 次开关：是否在每一轮旁显示用户输入的文本；只在主开关打开时有意义。 */
const SHOW_INPUTS_STORAGE_KEY = 'dsh-all-in-one:session-history-inputs'

/**
 * 读取主开关状态。
 * @returns 是否移动导航条；存储不可用时按关闭处理
 */
export function readSessionHistoryEnabled(): boolean {
  return readFlag(SESSION_HISTORY_STORAGE_KEY, false)
}

/**
 * 读取第二个开关状态。
 * @returns 是否显示轮次文本；存储不可用时按关闭处理
 */
export function readShowInputsEnabled(): boolean {
  return readFlag(SHOW_INPUTS_STORAGE_KEY, false)
}

/**
 * 写入主开关状态。
 * @param enabled 是否移动导航条
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeSessionHistoryEnabled(enabled: boolean): boolean {
  return writeFlag(SESSION_HISTORY_STORAGE_KEY, enabled)
}

/**
 * 写入第二个开关状态。
 * @param enabled 是否显示轮次文本
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeShowInputsEnabled(enabled: boolean): boolean {
  return writeFlag(SHOW_INPUTS_STORAGE_KEY, enabled)
}

/**
 * 读取一个布尔开关。
 * @param key localStorage 键
 * @param fallback 读取失败时的取值
 * @returns 键值为 `1` 时返回 true
 */
function readFlag(key: string, fallback: boolean): boolean {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch (error) {
    console.error('[session-history] 读取开关状态失败:', key, error)
    return fallback
  }
}

/**
 * 写入一个布尔开关。
 * @param key localStorage 键
 * @param enabled 开关状态
 * @returns 是否写入成功
 */
function writeFlag(key: string, enabled: boolean): boolean {
  try {
    window.localStorage.setItem(key, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[session-history] 写入开关状态失败:', key, error)
    return false
  }
}
