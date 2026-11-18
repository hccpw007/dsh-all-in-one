import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { clearSessionLocales } from './locales'
import { ClearSessionToggle } from './toggle'

/**
 * 「新会话入口」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后输入框最左侧出现 + / - 两个按钮，
 * 加号直接开新对话并保留当前会话，减号确认后删除当前会话再开新对话。
 */
const clearSessionFeature: FeatureDefinition = {
  id: 'clear-session',
  group: 'toggle',
  order: 40,
  reloadsPage: true,
  switch: ClearSessionToggle,
  client: { apply: applyClient },
  locales: clearSessionLocales,
}

export default clearSessionFeature
