/**
 * 「All In One」外壳页面。
 *
 * 页面只负责网格布局、功能切换与返回入口；每张入口卡片由功能自己渲染，
 * 功能页面的标题与内容也都留在各自的文件夹里。
 */
import React, { useCallback, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '../components/Button'
import { registry } from '../features/registry'
import type { Translate } from '../types/plugin'
import { PageActionsContext } from './page-actions'

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
        <div className="aio-card-grid mt-5 grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {registry.list.map((feature) => {
            const featureT = (key: string) => t(`${feature.id}.${key}`)

            // 开关型 feature 与入口卡片同列渲染（各占一半宽度），没有独立功能页；
            // 外层撑满整行高度，让同一行的两个开关卡片等高
            if ('switch' in feature) {
              const SwitchEntry = feature.switch

              return (
                <div key={feature.id} className="min-w-0">
                  <SwitchEntry t={featureT} />
                </div>
              )
            }

            const Entry = feature.entry

            // 入口卡片由功能自己渲染，外壳只负责布局与打开动作；
            // 外层与开关卡片一样包一层，卡片才能按网格行高撑到统一高度
            return (
              <div key={feature.id} className="min-w-0">
                <Entry t={featureT} open={() => setActiveId(feature.id)} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
