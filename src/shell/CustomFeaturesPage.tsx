/**
 * 「定制功能」外壳页面。
 *
 * 页面本身只做两件事：把注册表里的 feature 渲染成网格，以及为选中的
 * feature 提供返回入口。每个功能的具体实现与文案都留在各自的文件夹里。
 */
import React, { useState } from 'react'

import { Button } from '../components/Button'
import { registry } from '../features/registry'
import type { Translate } from '../types/plugin'
import type { FeatureDefinition } from './registry'

/** 未提供图标的 feature 使用的默认网格图标。 */
function DefaultGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="2" y="2" width="5" height="5" rx="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1.4" />
    </svg>
  )
}

/** 功能页返回网格时显示的箭头图标。 */
function BackGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 3.5 5 8l4.5 4.5" />
    </svg>
  )
}

interface FeatureCardProps {
  feature: FeatureDefinition
  /** 宿主翻译函数，用于取本 feature 的标题与描述。 */
  t: Translate
  /** 点击卡片后打开对应功能。 */
  onOpen: () => void
}

/** 网格中的单个功能入口卡片。 */
function FeatureCard({ feature, t, onOpen }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-xl border border-line1 bg-layer1 px-4 py-3.5 text-left transition hover:border-line2 hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* 功能图标，未指定时回退到默认网格图标 */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
        {Icon ? <Icon /> : <DefaultGlyph />}
      </span>
      {/* 功能标题与一句话描述，key 由外壳统一加 feature id 前缀后取值 */}
      <span className="min-w-0">
        <span className="block text-[13px] font-medium leading-5 text-primary">
          {t(`${feature.id}.${feature.titleKey}`)}
        </span>
        <span className="mt-1 block text-[12px] leading-[18px] text-secondary">
          {t(`${feature.id}.${feature.descriptionKey}`)}
        </span>
      </span>
    </button>
  )
}

interface CustomFeaturesPageProps {
  /** 宿主注入的翻译函数。 */
  t: Translate
}

/**
 * 「定制功能」设置页：网格列出全部已注册 feature，点击卡片进入对应功能。
 * @param props 宿主注入的翻译函数
 */
export function CustomFeaturesPage({ t }: CustomFeaturesPageProps) {
  // 当前打开的功能 id；为 null 时显示功能网格
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = activeId ? registry.find(activeId) : undefined

  // 已选中功能：切到功能页面，返回入口由外壳统一提供
  if (active) {
    const ActivePage = active.page

    // 功能页面根节点，样式作用域限定在 dsh-cf-root
    return (
      <div className="dsh-cf-root">
        {/* 功能页头部：返回网格与当前功能名 */}
        <div className="flex items-center gap-2 border-b border-line1 pb-3">
          {/* 返回按钮：回到功能网格 */}
          <Button variant="ghost" onClick={() => setActiveId(null)}>
            <BackGlyph />
            {t('shell.back')}
          </Button>
          <span className="text-[13px] font-medium text-primary">
            {t(`${active.id}.${active.titleKey}`)}
          </span>
        </div>
        {/* 当前功能的页面内容；页面拿到只带本 feature 前缀的 t，key 冲突由外壳隔离 */}
        <div className="mt-4">
          <ActivePage t={(key) => t(`${active.id}.${key}`)} />
        </div>
      </div>
    )
  }

  // 功能网格根节点，样式作用域限定在 dsh-cf-root
  return (
    <div className="dsh-cf-root">
      {/* 页面标题与简介 */}
      <header>
        {/* 页面主标题 */}
        <h1 className="text-[17px] font-semibold leading-6 text-primary">{t('shell.pageTitle')}</h1>
        {/* 页面用途说明 */}
        <p className="mt-1.5 text-[13px] leading-5 text-secondary">{t('shell.pageDescription')}</p>
      </header>
      {/* 功能网格：没有注册任何 feature 时显示空态 */}
      {registry.list.length === 0 ? (
        // 尚未注册功能时的空态提示
        <p className="mt-5 rounded-xl border border-dashed border-line1 px-4 py-6 text-center text-[12px] text-secondary">
          {t('shell.empty')}
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registry.list.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              t={t}
              onOpen={() => setActiveId(feature.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
