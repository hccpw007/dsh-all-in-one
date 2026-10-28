import type { FeatureDefinition } from '../shell/registry'

import powerPack from './power-pack'
import expandProcess from './expand-process'
import deleteSession from './delete-session'
import projectMemory from './project-memory'

/**
 * 所有已注册的 feature。
 *
 * 新增页面型功能：
 *   1. 新建 src/features/<id>/，参考 power-pack 的 index、entry、page 与 locales
 *   2. 改其中的 id，并重写 entry、page 与 locales
 *   3. 在下面的数组里追加该文件夹的默认导出
 *   4. 运行 npm run build 并刷新页面，卡片即出现在「All In One」网格中
 *
 * 新增开关型功能：提供 switch 组件即可，网格中直接渲染开关，没有独立页面。
 */
export const featureList: FeatureDefinition[] = [
  expandProcess,
  deleteSession,
  projectMemory,
  powerPack,
]
