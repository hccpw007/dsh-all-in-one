import type { FeatureLocales } from '../../shell/registry'

/**
 * 「复制工作区路径」开关的中英文文案；key 由外壳统一加 `copy-workspace-path.` 前缀。
 */
export const copyWorkspacePathLocales: FeatureLocales = {
  zh: {
    // 开关标题：工作区菜单里是否提供「复制路径」
    title: '复制工作区路径',
    // 开关用途说明：点明入口位置（右键与「更多」菜单）与结果（复制该项目的绝对路径）
    description: '工作区右键与「更多」菜单里增加「复制路径」，一键复制该项目的文件路径。',
    // 菜单项文案：把该工作区的路径写入剪贴板
    copyPath: '复制路径',
    // 复制成功后的提示
    copied: '已复制工作区路径',
    // 复制失败时的提示：通常是系统未授予剪贴板权限
    copyFailed: '复制失败，请检查剪贴板权限',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title: whether the workspace menu offers a copy action
    title: 'Copy workspace path',
    // Switch description naming where the entry appears and what it copies
    description: 'Adds “Copy path” to a workspace’s right-click and “more” menus.',
    // Menu item that writes the workspace path to the clipboard
    copyPath: 'Copy path',
    // Shown after the path has been copied
    copied: 'Workspace path copied',
    // Shown when the clipboard write is rejected, usually a permission issue
    copyFailed: 'Could not copy. Check clipboard permission.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
