import React, { useState } from 'react'

import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import type { FeaturePageProps } from '../../shell/registry'

/**
 * 示例功能的页面内容。
 *
 * 用来验证三件事：功能页面在外壳内渲染、React 状态可用、样式沿用主题令牌。
 * @param props t 已绑定本 feature 的 key 前缀，直接使用短 key 即可
 */
export function DemoPage({ t }: FeaturePageProps) {
  // 演示用的点击计数，证明功能页面拥有独立的 React 状态
  const [count, setCount] = useState(0)

  // 示例功能页面根节点
  return (
    <div className="flex flex-col gap-4">
      {/* 功能页头部：标题与简介由功能自己渲染，外壳不再介入 */}
      <header>
        {/* 功能页标题 */}
        <h1 className="text-[17px] font-semibold leading-6 text-primary">{t('title')}</h1>
        {/* 功能页简介 */}
        <p className="mt-1.5 text-[13px] leading-5 text-secondary">{t('description')}</p>
      </header>

      {/* 功能说明与交互演示 */}
      <Card className="p-4">
        <h3 className="text-[13px] font-medium text-primary">{t('sectionTitle')}</h3>
        <p className="mt-1.5 text-[12px] leading-5 text-secondary">{t('sectionDescription')}</p>
        {/* 计数按钮：点击后累加，证明页面状态独立 */}
        <Button variant="outline" className="mt-3" onClick={() => setCount((value) => value + 1)}>
          {t('counterLabel')}: {count}
        </Button>
      </Card>

      {/* 新增功能的操作步骤 */}
      <Card className="p-4">
        <h3 className="text-[13px] font-medium text-primary">{t('stepsTitle')}</h3>
        <ol className="mt-1.5 list-decimal pl-4 text-[12px] leading-6 text-secondary">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
          <li>{t('step4')}</li>
        </ol>
      </Card>
    </div>
  )
}
