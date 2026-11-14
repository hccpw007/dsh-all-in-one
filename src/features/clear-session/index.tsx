import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { clearSessionLocales } from './locales'
import { ClearSessionToggle } from './toggle'

/**
 * 「清空会话」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后输入框最左侧出现清空按钮，
 * 点击弹出确认框，确认后在当前工作区打开一条新的空白对话。
 */
const clearSessionFeature: FeatureDefinition = {
  id: 'clear-session',
  group: 'conversation',
  order: 25,
  switch: ClearSessionToggle,
  client: { apply: applyClient },
  locales: clearSessionLocales,
}

export default clearSessionFeature
