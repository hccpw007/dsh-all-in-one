import type { FeatureLocales } from '../../shell/registry'

/** 「桌面版 Cookie 清理」的中英文文案；key 由外壳统一加 `desktop-cookie.` 前缀。 */
export const desktopCookieLocales: FeatureLocales = {
  zh: {
    // 开关标题：启动时清掉过期的登录 Cookie
    title: '过期登录清理',
    // 开关用途说明：清理对象是启动时留下的旧认证 Cookie，不是等它过期
    description: '启动时清掉更早的桌面版认证 Cookie，避免旧记录堆到认证失败。',
    // 阈值输入框的标签
    thresholdLabel: '阈值',
    // 保留条数输入框的标签
    retainLabel: '保留',
    // 输入框的单位
    unit: '条',
    // 读取配置失败时的提示
    loadFailed: '读取清理设置失败',
    // 保存配置失败时的提示
    saveFailed: '保存清理设置失败',
    // 阈值超出 1-100 时的提示
    thresholdInvalid: '阈值需要是 1 到 100 之间的整数',
    // 保留条数不小于阈值时的提示
    retainInvalid: '保留条数需要是整数，且小于阈值',
  },
  en: {
    // Switch title: prunes expired sign-in cookies at launch
    title: 'Stale sign-in cleanup',
    // Switch description
    description: 'Prune stale sign-in cookies at launch so the desktop app can authenticate.',
    // Label of the threshold input
    thresholdLabel: 'Threshold',
    // Label of the retained-count input
    retainLabel: 'Keep',
    // Unit shown after both inputs
    unit: 'cookies',
    // Shown when the settings cannot be loaded
    loadFailed: 'Could not load the cleanup settings',
    // Shown when the settings cannot be saved
    saveFailed: 'Could not save the cleanup settings',
    // Shown when the threshold is outside 1-100
    thresholdInvalid: 'The threshold must be an integer between 1 and 100',
    // Shown when the retained count is not below the threshold
    retainInvalid: 'The retained count must be an integer below the threshold',
  },
}
