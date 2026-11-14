import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { workspaceSessionCountLocales } from './locales'
import { WorkspaceSessionCountToggle } from './toggle'

/**
 * 「项目会话数」的注册定义。
 *
 * 开关型 feature，没有独立页面：网格里是开关，打开后客户端扩展在侧边栏
 * 项目名后显示该项目自身的会话数量。
 */
const workspaceSessionCountFeature: FeatureDefinition = {
  id: 'workspace-session-count',
  group: 'layout',
  order: 30,
  reloadsPage: true,
  switch: WorkspaceSessionCountToggle,
  client: { apply: applyClient },
  locales: workspaceSessionCountLocales,
}

export default workspaceSessionCountFeature
