import type { FeatureDefinition } from '../shell/registry'

import expandProcess from './expand-process'
import imagePreview from './image-preview'
import clearSession from './clear-session'
import queueEdit from './queue-edit'
import autoRun from './auto-run'
import sessionHistory from './session-history'
import sidebarMore from './sidebar-more'
import workspaceSessionCount from './workspace-session-count'
import deleteSession from './delete-session'
import powerPack from './power-pack'
import projectMemory from './project-memory'
import autoCompact from './auto-compact'
import desktopCookie from './desktop-cookie'

/**
 * 所有已注册的 feature。
 *
 * 数组顺序与设置页网格顺序一致，按「对话体验 → 界面布局 → 配置与维护」三组排列；
 * 每组四项，正好铺满两列两行。注册表按 order 升序、权重相同时保持本数组顺序，
 * 因此调整顺序时两处要一起改，读代码时这里是唯一的全景。
 *
 * 新增页面型功能：
 *   1. 新建 src/features/<id>/，参考 power-pack 的 index、entry、page 与 locales
 *   2. 改其中的 id，并重写 entry、page 与 locales
 *   3. 在下面的数组里按分组插入该文件夹的默认导出，并给同组后续功能重排 order
 *   4. 运行 npm run build 并刷新页面，卡片即出现在「All In One」网格中
 *
 * 新增开关型功能：提供 switch 组件即可，网格中直接渲染开关，没有独立页面。
 */
export const featureList: FeatureDefinition[] = [
  // 对话体验：一条对话内的阅读与操作
  expandProcess,
  imagePreview,
  clearSession,
  queueEdit,
  autoRun,
  // 界面布局：侧边栏、会话列表与导航结构
  sessionHistory,
  sidebarMore,
  workspaceSessionCount,
  deleteSession,
  // 配置与维护：带参数或配置页、在后台生效的功能
  powerPack,
  projectMemory,
  autoCompact,
  desktopCookie,
]
