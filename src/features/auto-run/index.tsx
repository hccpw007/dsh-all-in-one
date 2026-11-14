import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { autoRunLocales } from './locales'
import { AutoRunButtonToggle } from './toggle'

/**
 * 「全自动执行」的注册定义。
 *
 * 设置页里是本功能的总开关（是否显示输入框按钮）；真正的会话级开关在对话的
 * 输入框右侧，打开后该对话不提问、不等待确认，改完自行验证。
 */
const autoRunFeature: FeatureDefinition = {
  id: 'auto-run',
  group: 'conversation',
  order: 28,
  switch: AutoRunButtonToggle,
  client: { apply: applyClient },
  locales: autoRunLocales,
}

export default autoRunFeature
