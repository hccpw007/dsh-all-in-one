import type { FeatureLocales } from '../../shell/registry'

/**
 * 「项目显示会话数」开关的中英文文案；key 由外壳统一加 `workspace-session-count.` 前缀。
 */
export const workspaceSessionCountLocales: FeatureLocales = {
  zh: {
    // 开关标题：侧边栏项目名后是否显示会话数量
    title: '项目显示会话数',
    // 开关用途说明：解释项目名后会显示会话数，并点明空白会话不计入
    description: '侧边栏项目名后显示该项目的会话数，空白会话不计入。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title: what the sidebar shows; kept short so it stays on one line in the card
    title: 'Workspace session count',
    // Switch description explaining where the count appears and that blank sessions are excluded
    description: 'Show each workspace’s session count after its name; blank sessions excluded.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
