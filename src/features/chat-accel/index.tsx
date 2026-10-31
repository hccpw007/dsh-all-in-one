import type { FeatureDefinition } from '../../shell/registry'
import { ChatAccelEntry } from './entry'
import { chatAccelLocales } from './locales'
import { ChatAccelPage } from './page'

/**
 * 「对话加速」的注册定义。
 *
 * 页面型 feature：点击网格卡片进入设置页面，页面里勾选要启用的 dsh 优化条目。
 * 条目功能尚未实现，当前只提供选择界面。
 */
const chatAccelFeature: FeatureDefinition = {
  id: 'chat-accel',
  order: 35,
  entry: ChatAccelEntry,
  page: ChatAccelPage,
  locales: chatAccelLocales,
}

export default chatAccelFeature
