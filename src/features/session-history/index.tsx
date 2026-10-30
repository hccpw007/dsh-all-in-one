import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { sessionHistoryLocales } from './locales'
import { SessionHistoryToggle } from './toggle'

/**
 * 「会话历史左侧」的注册定义。
 *
 * 开关型 feature，没有独立页面：网格里是上下相连的两个开关，
 * 打开后客户端扩展把会话右侧的轮次导航条挪到左侧，并可选显示每轮用户输入。
 */
const sessionHistoryFeature: FeatureDefinition = {
  id: 'session-history',
  order: 16,
  switch: SessionHistoryToggle,
  client: { apply: applyClient },
  locales: sessionHistoryLocales,
}

export default sessionHistoryFeature
