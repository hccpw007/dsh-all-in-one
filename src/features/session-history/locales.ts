import type { FeatureLocales } from '../../shell/registry'

/**
 * 「会话历史左侧」的中英文文案。
 *
 * key 由外壳统一加 `session-history.` 前缀。
 */
export const sessionHistoryLocales: FeatureLocales = {
  zh: {
    title: '会话历史左侧',
    description: '轮次导航条从对话右侧移到左侧，点击跳转保持不变。',
    saveFailed: '开关状态保存失败，请检查浏览器存储。',
  },
  en: {
    title: 'Turn history on the left',
    description: 'Move the turn navigator to the left side; jump-on-click is unchanged.',
    saveFailed: 'Failed to save the switch state. Check browser storage.',
  },
}
