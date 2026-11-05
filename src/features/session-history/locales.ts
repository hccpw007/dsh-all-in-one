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
    // 提示切换开关会刷新页面，避免用户丢失滚动位置与未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    saveFailed: '开关状态保存失败，请检查浏览器存储。',
  },
  en: {
    title: 'Turn history on the left',
    description: 'Move the turn navigator to the left side; jump-on-click is unchanged.',
    // Tells the user that toggling reloads the page so state applies everywhere
    reloadHint: 'Reloads the page so the change takes effect.',
    saveFailed: 'Failed to save the switch state. Check browser storage.',
  },
}
