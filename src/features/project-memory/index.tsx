import type { FeatureDefinition } from '../../shell/registry'
import { ProjectMemoryEntry } from './entry'
import { projectMemoryLocales } from './locales'
import { ProjectMemoryPage } from './page'

/**
 * 「项目记忆」的注册定义。
 *
 * 页面型 feature：网格卡片上是启用开关，点卡片主体进入页面配置记忆根目录。
 * 打开后对话会把项目记忆带进上下文，模型也可以用 `memory` 工具把新事实写进记忆文件
 * （宿主侧实现）。
 */
const projectMemoryFeature: FeatureDefinition = {
  id: 'project-memory',
  order: 30,
  entry: ProjectMemoryEntry,
  page: ProjectMemoryPage,
  locales: projectMemoryLocales,
}

export default projectMemoryFeature
