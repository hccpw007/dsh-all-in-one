import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { sidebarMoreLocales } from './locales'
import { SidebarMoreToggle } from './toggle'

/**
 * 「菜单收进更多」的注册定义。
 *
 * 开关型 feature，没有独立页面：网格里是开关，打开后客户端扩展把侧边栏顶部的
 * 面板入口搬进左下角的「更多」菜单，顶部整块隐藏。
 */
const sidebarMoreFeature: FeatureDefinition = {
  id: 'sidebar-more',
  order: 17,
  switch: SidebarMoreToggle,
  client: { apply: applyClient },
  locales: sidebarMoreLocales,
}

export default sidebarMoreFeature
