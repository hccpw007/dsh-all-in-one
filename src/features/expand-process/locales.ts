import type { FeatureLocales } from '../../shell/registry'

/** 「展开过程」开关的中英文文案；key 由外壳统一加 `expand-process.` 前缀。 */
export const expandProcessLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '展开过程',
    // 开关用途说明：解释打开后会话里的哪些内容默认展开
    description: '默认展开会话里的「思考」与「运行命令」，无需逐行点开。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title
    title: 'Expand process',
    // Switch description explaining what expands when enabled
    description: 'Keep reasoning and command rows expanded in conversations instead of opening each one.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
