import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { contextInspectLocales } from './locales'
import { ContextInspectToggle } from './toggle'

/**
 * 「上下文详情」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后客户端扩展接管上下文
 * 气泡里的系统提示词与工具定义两行，点击即打开详情窗口。
 */
const contextInspectFeature: FeatureDefinition = {
  id: 'context-inspect',
  group: 'conversation',
  order: 25,
  reloadsPage: true,
  switch: ContextInspectToggle,
  client: { apply: applyClient },
  locales: contextInspectLocales,
}

export default contextInspectFeature
