import type { FeatureDefinition } from '../../shell/registry'
import { DemoEntry } from './entry'
import { demoLocales } from './locales'
import { DemoPage } from './page'

/**
 * 示例功能的注册定义，也是新增功能时可复制的模板。
 * 入口、页面与文案分别放在同目录的 entry.tsx、page.tsx、locales.ts。
 */
const demoFeature: FeatureDefinition = {
  id: 'demo',
  order: 100,
  entry: DemoEntry,
  page: DemoPage,
  locales: demoLocales,
}

export default demoFeature
