/**
 * 「会话图片预览」开关的共享状态。
 *
 * 客户端扩展在插件启动时读取一次该状态决定是否安装 DOM 观察器，设置页的开关
 * 写同一个键；切换开关后刷新页面即可生效。
 */

/** 开关状态在 localStorage 中的键，开关组件与客户端扩展共用。 */
const IMAGE_PREVIEW_STORAGE_KEY = 'dsh-all-in-one:image-preview'

/**
 * 读取开关状态。
 * @returns 是否在会话中显示图片预览；存储不可用时按关闭处理
 */
export function readImagePreviewEnabled(): boolean {
  try {
    return window.localStorage.getItem(IMAGE_PREVIEW_STORAGE_KEY) === '1'
  } catch (error) {
    console.error('[image-preview] 读取开关状态失败:', error)
    return false
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否在会话中显示图片预览
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writeImagePreviewEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(IMAGE_PREVIEW_STORAGE_KEY, enabled ? '1' : '0')
    return true
  } catch (error) {
    console.error('[image-preview] 写入开关状态失败:', error)
    return false
  }
}
