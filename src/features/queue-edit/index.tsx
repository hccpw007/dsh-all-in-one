import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { queueEditLocales } from './locales'
import { QueueEditToggle } from './toggle'

/**
 * 「编辑排队消息」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后客户端扩展接管排队条上的
 * 编辑按钮，点击即撤回那条排队，把文字与图片放回输入框。
 */
const queueEditFeature: FeatureDefinition = {
  id: 'queue-edit',
  group: 'conversation',
  order: 35,
  reloadsPage: true,
  switch: QueueEditToggle,
  client: { apply: applyClient },
  locales: queueEditLocales,
}

export default queueEditFeature
