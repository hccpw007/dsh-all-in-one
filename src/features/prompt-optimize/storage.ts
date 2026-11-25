/**
 * 「提示词优化」设置页开关的本地状态。
 *
 * 它只决定输入框旁是否出现优化按钮。开关在插件启动时读取一次，切换后刷新页面，
 * 已打开的页面才会装上或撤掉按钮。
 */

/** 开关状态在 localStorage 中的键，设置页开关与客户端扩展共用。 */
const STORAGE_KEY = 'dsh-all-in-one:prompt-optimize'

/** 默认值：按钮默认显示，这是本功能的主入口。 */
const DEFAULT_ENABLED = true

/**
 * 读取开关状态。
 * @returns 是否在输入框右侧显示优化按钮；存储不可用时按默认值处理
 */
export function readPromptOptimizeEnabled(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    // 未写过任何值时沿用默认显示，避免首次安装功能「看起来没生效」
    if (stored === null) return DEFAULT_ENABLED

    return stored === '1'
  } catch (error) {
    console.error('[prompt-optimize] 读取开关状态失败:', error)

    return DEFAULT_ENABLED
  }
}

/**
 * 写入开关状态。
 * @param enabled 是否显示优化按钮
 * @returns 是否写入成功；失败时调用方不应刷新页面
 */
export function writePromptOptimizeEnabled(enabled: boolean): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')

    return true
  } catch (error) {
    console.error('[prompt-optimize] 写入开关状态失败:', error)

    return false
  }
}
