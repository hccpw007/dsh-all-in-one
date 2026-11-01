import type { FeatureLocales } from '../../shell/registry'

/** 「展开过程」开关的中英文文案；key 由外壳统一加 `expand-process.` 前缀。 */
export const expandProcessLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '展开过程',
    // 开关用途说明：解释打开后会话里的哪些内容会展开
    description: '会话里的「思考」与「运行命令」默认展开，无需逐条点开。',
    // 展开范围标签
    modeLabel: '范围',
    // 展开范围选项：所有历史轮次的过程都展开
    modeAll: '全部内容',
    // 展开范围选项：只展开当前这一轮对话的过程
    modeActive: '当前激活',
    // 开关或范围写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title
    title: 'Expand process',
    // Switch description explaining what expands when enabled
    description: 'Keep reasoning and command rows expanded so they need no manual opening.',
    // Expansion scope label
    modeLabel: 'Scope',
    // Scope option: expand process rows in every turn
    modeAll: 'All content',
    // Scope option: expand only the process rows of the current turn
    modeActive: 'Active turn',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
