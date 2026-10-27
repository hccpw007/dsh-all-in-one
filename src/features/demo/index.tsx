import React, { useState } from 'react'

import type { FeatureDefinition } from '../../shell/registry'

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
 * 示例功能的页面内容。
 *
 * 用来验证三件事：功能页面在外壳内渲染、React 状态可用、样式沿用主题令牌。
 */
function DemoPage() {
  // 演示用的点击计数，证明功能页面拥有独立的 React 状态
  const [count, setCount] = useState(0)

  // 示例功能页面根节点
  return (
    <div className="flex flex-col gap-4">
      {/* 功能说明与交互演示 */}
      <section className="rounded-xl border border-line1 bg-layer1 p-4">
        <h3 className="text-[13px] font-medium text-primary">独立的功能页面</h3>
        <p className="mt-1.5 text-[12px] leading-5 text-secondary">
          每个功能都有自己的文件夹和页面组件。外壳只负责网格、导航和样式，页面只需关心自己的内容。
        </p>
        {/* 计数按钮：点击后累加，证明页面状态独立 */}
        <button
          type="button"
          onClick={() => setCount((value) => value + 1)}
          className="mt-3 rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          点击计数：{count}
        </button>
      </section>

      {/* 新增功能的操作步骤 */}
      <section className="rounded-xl border border-line1 bg-layer1 p-4">
        <h3 className="text-[13px] font-medium text-primary">新增一个功能</h3>
        <ol className="mt-1.5 list-decimal pl-4 text-[12px] leading-6 text-secondary">
          <li>
            复制 <code className="rounded bg-base px-1 py-0.5">src/features/demo/</code> 为{' '}
            <code className="rounded bg-base px-1 py-0.5">src/features/&lt;id&gt;/</code>
          </li>
          <li>在文件夹的 index.tsx 里改 id、title、description 与页面内容</li>
          <li>
            在 <code className="rounded bg-base px-1 py-0.5">src/features/index.ts</code> 的
            featureList 里追加导入
          </li>
          <li>运行 npm run build 并刷新页面，卡片自动出现在网格中</li>
        </ol>
      </section>
    </div>
  )
}

/** 示例功能的注册定义，也是新增功能时可复制的模板。 */
const demoFeature: FeatureDefinition = {
  id: 'demo',
  title: '示例功能',
  description: '演示独立文件夹的结构、注册方式与页面渲染。',
  order: 100,
  icon: DemoIcon,
  page: DemoPage,
}

export default demoFeature
