import type { FeatureDefinition } from '../shell/registry'

import expandProcess from './expand-process'
import imagePreview from './image-preview'
import contextInspect from './context-inspect'
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
import memoryGuard from './memory-guard'

/**
 * 所有已注册的 feature。
 *
 * 数组顺序与设置页网格顺序一致，按界面位置分成「对话内容 → 输入框 → 界面布局 →
 * 配置与维护」四组；每组内按 order 升序，权重相同时保持本数组顺序。注册表同样按
 * order 排序，因此调整顺序时两处要一起改，读代码时这里是唯一的全景。
 *
 * 组内顺序按使用动线排：先看输出（过程展开、图片预览、上下文详情），再管省事
 * （自动压缩），输入框组按「执行 → 排队 → 开新对话」，布局组按「导航 → 列表 →
 * 收纳 → 删除」。网格只保证同一行内卡片等高，行与行的高度各自按本行最高的一张算，
 * 因此把参数行型与纯开关型卡片配对放在同一行，能让矮卡所在的行单独收缩下来。
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
  // 对话内容：对话正文里的过程展开、图片预览与上下文
  expandProcess,
  autoCompact,
  imagePreview,
  contextInspect,
  // 输入框：输入框上的按钮与执行开关
  autoRun,
  queueEdit,
  clearSession,
  // 界面布局：侧边栏、会话列表与导航结构
  sessionHistory,
  workspaceSessionCount,
  sidebarMore,
  deleteSession,
  // 配置与维护：带参数或配置页、在后台生效的功能
  powerPack,
  projectMemory,
  desktopCookie,
  memoryGuard,
]
