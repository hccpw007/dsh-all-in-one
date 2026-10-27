import type { FeatureDefinition } from '../../shell/registry'
import { expandProcessLocales } from './locales'
import { ExpandProcessToggle } from './toggle'

/**
 * 「展开过程」开关的注册定义。
 *
 * 开关型 feature 没有独立页面，网格中直接渲染开关，切换后刷新页面生效。
 */
const expandProcessFeature: FeatureDefinition = {
  id: 'expand-process',
  order: 10,
  switch: ExpandProcessToggle,
  locales: expandProcessLocales,
}

export default expandProcessFeature
