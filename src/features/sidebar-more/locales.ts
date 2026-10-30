import type { FeatureLocales } from '../../shell/registry'

/**
 * 「菜单收进更多」开关的中英文文案；key 由外壳统一加 `sidebar-more.` 前缀。
 */
export const sidebarMoreLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '菜单收进更多',
    // 开关用途说明：解释打开后侧边栏顶部的哪些入口会被搬进底部菜单
    description: '顶部插件、Skill / MCP 与自动化任务收进左下角「更多」菜单。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 底部菜单里对宿主「更多」子项「浏览更多插件」的替代文案
    browsePlugins: '浏览更多插件',
    // 底部菜单里对宿主「更多」子项「创建你的插件」的替代文案
    createPlugin: '创建你的插件',
  },
  en: {
    // Switch title
    title: 'Tuck menus into More',
    // Switch description explaining which sidebar entries move into the bottom menu
    description: 'Move Plugins, Skill / MCP and Automation into the bottom-left More menu.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Replacement label for the host's "Browse more plugins" entry
    browsePlugins: 'Browse more plugins',
    // Replacement label for the host's "Create your plugin" entry
    createPlugin: 'Create your plugin',
  },
}
