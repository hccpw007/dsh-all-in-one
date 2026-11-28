import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { copyWorkspacePathLocales } from './locales'
import { CopyWorkspacePathToggle } from './toggle'

/**
 * 「复制工作区路径」的注册定义。
 *
 * 开关型 feature，没有独立页面：网格里是开关，打开后客户端扩展在工作区的
 * 右键与「更多」菜单里增加「复制路径」，把该项目的绝对路径写入剪贴板。
 */
const copyWorkspacePathFeature: FeatureDefinition = {
  id: 'copy-workspace-path',
  group: 'toggle',
  order: 90,
  reloadsPage: true,
  switch: CopyWorkspacePathToggle,
  client: { apply: applyClient },
  locales: copyWorkspacePathLocales,
}

export default copyWorkspacePathFeature
