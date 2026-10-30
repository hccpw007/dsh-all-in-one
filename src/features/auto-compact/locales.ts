import type { FeatureLocales } from '../../shell/registry'

/** 「自动压缩会话」的中英文文案；key 由外壳统一加 `auto-compact.` 前缀。 */
export const autoCompactLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '自动压缩会话',
    // 开关用途说明
    description: '超过阈值自动压缩，避免越聊越慢。',
    // 阈值输入框的标签
    thresholdLabel: '阈值',
    // 阈值输入框的单位
    thresholdUnit: '%',
    // 保留比例输入框的标签
    retainLabel: '保留',
    // 读取配置失败时的提示
    loadFailed: '读取自动压缩设置失败',
    // 保存配置失败时的提示
    saveFailed: '保存自动压缩设置失败',
    // 阈值超出 1-100 时的提示
    thresholdInvalid: '阈值需要是 1 到 100 之间的整数',
    // 保留比例不低于阈值时的提示
    retainInvalid: '保留比例需要是整数，且小于阈值',
  },
  en: {
    // Switch title
    title: 'Auto-compact sessions',
    // Switch description
    description: 'Compact a session once it crosses the threshold, so long chats stay fast.',
    // Label of the threshold input
    thresholdLabel: 'Threshold',
    // Unit shown after the threshold input
    thresholdUnit: '%',
    // Label of the retained-context input
    retainLabel: 'Keep',
    // Shown when the settings cannot be loaded
    loadFailed: 'Could not load the auto-compact settings',
    // Shown when the settings cannot be saved
    saveFailed: 'Could not save the auto-compact settings',
    // Shown when the threshold is outside 1-100
    thresholdInvalid: 'The threshold must be an integer between 1 and 100',
    // Shown when the retained share is not below the threshold
    retainInvalid: 'The retained share must be an integer below the threshold',
  },
}
