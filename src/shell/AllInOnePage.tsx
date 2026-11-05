/**
 * 「All In One」外壳页面。
 *
 * 页面只负责按分组布置网格、功能切换与返回入口；每张入口卡片由功能自己渲染，
 * 功能页面的标题与内容也都留在各自的文件夹里。
 */
import React, { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '../components/Button'
import { registry } from '../features/registry'
import type { Translate } from '../types/plugin'
import { PageActionsContext } from './page-actions'
import { FEATURE_GROUP_ORDER } from './registry'
import type { FeatureDefinition } from './registry'

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

interface AllInOnePageProps {
  /** 宿主注入的翻译函数。 */
  t: Translate
}

/** 未声明 group、或 group 值不在 FEATURE_GROUP_ORDER 中的功能归入此分组。 */
const FALLBACK_GROUP = 'other'

/** 网格中的一个分组区块。 */
interface FeatureSection {
  /** 分组 id，同时拼进 `shell.group.<id>` 语言 key */
  group: string
  /** 该分组下的功能，保持注册表给出的组内顺序 */
  features: FeatureDefinition[]
}

/**
 * 按 feature.group 归集功能，并按固定顺序返回非空分组。
 *
 * 分组不影响功能是否可用：未声明或拼错的分组落到兜底组，功能照常显示。
 * @param features 注册表返回的、已按 order 排序的功能列表
 * @returns 只包含非空分组的区块列表
 */
function groupFeatures(features: readonly FeatureDefinition[]): FeatureSection[] {
  const buckets = new Map<string, FeatureDefinition[]>()

  // 逐条归组；未声明或未知的分组统一落到兜底组，避免功能从网格中消失
  for (const feature of features) {
    const group =
      feature.group !== undefined && FEATURE_GROUP_ORDER.includes(feature.group)
        ? feature.group
        : FALLBACK_GROUP
    const bucket = buckets.get(group)

    if (bucket) bucket.push(feature)
    else buckets.set(group, [feature])
  }

  const sections: FeatureSection[] = []

  // 兜底组永远排在最后
  for (const group of [...FEATURE_GROUP_ORDER, FALLBACK_GROUP]) {
    const bucket = buckets.get(group)

    if (bucket !== undefined && bucket.length > 0) sections.push({ group, features: bucket })
  }

  return sections
}

/** 网格中的单个功能入口。 */
interface FeatureCardProps {
  /** 通过注册表校验的功能定义 */
  feature: FeatureDefinition
  /** 宿主翻译函数 */
  t: Translate
  /** 打开页面型功能 */
  open: (id: string) => void
}

/**
 * 渲染单个功能入口：开关型直接渲染开关，页面型渲染可点击的入口卡片。
 *
 * 两种形态都包一层 `min-w-0`，让卡片按网格行高撑到统一高度。
 * @param props 功能定义与外壳注入的翻译、打开动作
 */
function FeatureCard({ feature, t, open }: FeatureCardProps) {
  // t 的引用会随页面重渲染变化；entry/switch 的 effect 依赖 t，若这里每次渲染都造新
  // 函数，卡片重渲染就会触发一次设置读取。按 feature.id 与 t 记忆化即可保持稳定。
  const featureT = useMemo(() => (key: string) => t(`${feature.id}.${key}`), [feature.id, t])

  // 开关型 feature 与入口卡片同列渲染（各占一半宽度），没有独立功能页
  if ('switch' in feature) {
    const SwitchEntry = feature.switch

    return (
      <div className="min-w-0">
        <SwitchEntry t={featureT} />
      </div>
    )
  }

  const Entry = feature.entry

  // 入口卡片由功能自己渲染，外壳只负责布局与打开动作
  return (
    <div className="min-w-0">
      <Entry t={featureT} open={() => open(feature.id)} />
    </div>
  )
}

/**
 * 「All In One」设置页：网格列出全部已注册 feature，点击卡片进入对应功能。
 * @param props 宿主注入的翻译函数
 */
export function AllInOnePage({ t }: AllInOnePageProps) {
  // 当前打开的功能 id；为 null 时显示功能网格
  const [activeId, setActiveId] = useState<string | null>(null)
  // 功能页投放到头部右侧的操作按钮；由功能页自己设置与清空
  const [pageActions, setPageActions] = useState<ReactNode>(null)
  const active = activeId ? registry.find(activeId) : undefined
  const activePage = active && 'page' in active ? active : undefined

  // 功能页的翻译函数必须保持引用稳定：页面据此创建的保存按钮会回写到本组件状态，
  // 若每次渲染都换新函数，会形成「投放按钮 → 重渲染 → 新函数 → 再投放」的死循环
  const featureTranslate = useCallback(
    // 网格视图不会调用此函数，activePage 为空时直接返回 key 兜底
    (key: string) => (activePage ? t(`${activePage.id}.${key}`) : key),
    [activePage, t],
  )

  // 已选中功能：切到功能页面，返回入口由外壳统一提供
  if (activePage) {
    const ActivePage = activePage.page

    // 功能页面根节点，样式作用域限定在 dsh-aio-root
    return (
      <div className="dsh-aio-root">
        <PageActionsContext.Provider value={setPageActions}>
          {/*
            功能页头部：左侧返回网格，右侧留给功能页的保存等操作。
            宿主滚动的是设置弹窗的内容区，这里用 sticky 让头部钉在滚动区顶端，
            只让下方功能页内容滚动；需要不透明底色，否则内容会从头部下方透出。
          */}
          {/* 头部层级需高于页面内带 z-index 的浮层控件（如规则三态按钮选中态 z-10），否则滚动时会被后者盖住 */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-line4 bg-base pb-3">
            {/* 返回按钮：回到功能网格 */}
            <Button variant="outline" onClick={() => setActiveId(null)}>
              <BackGlyph />
              {t('shell.back')}
            </Button>
            {/* 功能页投放的操作按钮 */}
            {pageActions ? <div className="flex items-center gap-2">{pageActions}</div> : null}
          </div>
          {/* 当前功能的页面内容；页面拿到只带本 feature 前缀的 t，key 冲突由外壳隔离 */}
          <div className="mt-4">
            <ActivePage t={featureTranslate} />
          </div>
        </PageActionsContext.Provider>
      </div>
    )
  }

  // 功能网格根节点，样式作用域限定在 dsh-aio-root
  return (
    <div className="dsh-aio-root">
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
        <p className="mt-5 rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary">
          {t('shell.empty')}
        </p>
      ) : (
        // 按分组逐块渲染：组标题说明这一块功能解决什么问题，组内仍是一张网格
        <div className="mt-4 space-y-4">
          {groupFeatures(registry.list).map((section) => (
            <section key={section.group}>
              {/* 分组标题 */}
              <h2 className="mb-2 text-[12px] font-medium text-secondary">
                {t(`shell.group.${section.group}`)}
              </h2>
              {/* 分组内的功能网格 */}
              <div className="aio-card-grid grid auto-rows-fr gap-2.5">
                {section.features.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    t={t}
                    open={(id) => setActiveId(id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
