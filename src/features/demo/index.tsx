import React from 'react'

import type { FeatureDefinition } from '../../shell/registry'
import { demoLocales } from './locales'
import { DemoPage } from './page'

/**
 * 示例功能图标。
 *
 * 每个 feature 自己提供图标组件，外壳只负责把它放进卡片左上角。
 */
function DemoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <path d="M14 17.5h7M17.5 14v7" />
    </svg>
  )
}

/**
 * 示例功能的注册定义，也是新增功能时可复制的模板。
 * 页面与文案放在同目录的 page.tsx、locales.ts，互不干扰。
 */
const demoFeature: FeatureDefinition = {
  id: 'demo',
  titleKey: 'title',
  descriptionKey: 'description',
  order: 100,
  icon: DemoIcon,
  locales: demoLocales,
  page: DemoPage,
}

export default demoFeature
