import type { FeatureDefinition } from '../../shell/registry'
import { autoCompactLocales } from './locales'
import { AutoCompactToggle } from './toggle'

/**
 * 「自动压缩会话」的注册定义。
 *
 * 开关型 feature 没有独立页面：卡片上的开关与阈值输入框就是全部配置，
 * 压缩动作由宿主侧扩展在会话空闲时执行。
 */
const autoCompactFeature: FeatureDefinition = {
  id: 'auto-compact',
  order: 40,
  switch: AutoCompactToggle,
  locales: autoCompactLocales,
}

export default autoCompactFeature
