import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { promptOptimizeLocales } from './locales'
import { PromptOptimizeToggle } from './toggle'

/**
 * 「提示词优化」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后发送按钮旁出现一枚图标，
 * 点击用当前会话的模型把草稿补成完整需求并回写输入框，由用户再增删。
 */
const promptOptimizeFeature: FeatureDefinition = {
  id: 'prompt-optimize',
  group: 'toggle',
  // 排在「编辑排队消息」「新会话入口」之后：三者的入口都在输入框那一排
  order: 45,
  reloadsPage: true,
  switch: PromptOptimizeToggle,
  client: { apply: applyClient },
  locales: promptOptimizeLocales,
}

export default promptOptimizeFeature
