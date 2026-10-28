import type { FeatureDefinition } from '../../shell/registry'
import { projectMemoryLocales } from './locales'
import { ProjectMemoryToggle } from './toggle'

/**
 * 「项目记忆」开关的注册定义。
 *
 * 开关型 feature：网格里是开关，打开后对话会把项目记忆带进上下文，
 * 模型也可以用 `memory` 工具把新事实写进记忆文件（宿主侧实现）。
 */
const projectMemoryFeature: FeatureDefinition = {
  id: 'project-memory',
  order: 30,
  switch: ProjectMemoryToggle,
  locales: projectMemoryLocales,
}

export default projectMemoryFeature
