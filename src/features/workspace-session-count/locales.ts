import type { FeatureLocales } from '../../shell/registry'

/**
 * 「项目会话数」开关的中英文文案；key 由外壳统一加 `workspace-session-count.` 前缀。
 */
export const workspaceSessionCountLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '项目会话数',
    // 开关用途说明：解释项目名后会显示该项目自身的会话数量
    description: '侧边栏项目名后显示该项目自身的会话数量。',
    // 提示切换开关会刷新页面，避免用户丢失滚动位置与未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title
    title: 'Workspace session count',
    // Switch description explaining where the count appears and what it counts
    description: 'Show each workspace’s own session count after its name in the sidebar.',
    // Tells the user that toggling reloads the page so state applies everywhere
    reloadHint: 'Reloads the page so the change takes effect.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
