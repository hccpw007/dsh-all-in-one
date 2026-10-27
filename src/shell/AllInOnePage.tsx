/**
 * 「All In One」外壳页面。
 *
 * 页面只负责网格布局、功能切换与返回入口；每张入口卡片由功能自己渲染，
 * 功能页面的标题与内容也都留在各自的文件夹里。
 */
import React, { useState } from 'react'

import { Button } from '../components/Button'
import { registry } from '../features/registry'
import type { Translate } from '../types/plugin'

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
  const active = activeId ? registry.find(activeId) : undefined

  // 已选中功能：切到功能页面，返回入口由外壳统一提供
  if (active && 'page' in active) {
    const ActivePage = active.page

    // 功能页面根节点，样式作用域限定在 dsh-aio-root
    return (
      <div className="dsh-aio-root">
        {/* 功能页头部：只提供返回网格的入口，标题由功能页面自行渲染 */}
        <div className="flex items-center gap-2 border-b border-line4 pb-3">
          {/* 返回按钮：回到功能网格 */}
          <Button variant="outline" onClick={() => setActiveId(null)}>
            <BackGlyph />
            {t('shell.back')}
          </Button>
        </div>
        {/* 当前功能的页面内容；页面拿到只带本 feature 前缀的 t，key 冲突由外壳隔离 */}
        <div className="mt-4">
          <ActivePage t={(key) => t(`${active.id}.${key}`)} />
        </div>
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
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registry.list.map((feature) => {
            const featureT = (key: string) => t(`${feature.id}.${key}`)

            // 开关型 feature 直接在网格中渲染开关并占满整行，没有独立功能页
            if ('switch' in feature) {
              const SwitchEntry = feature.switch

              return (
                <div key={feature.id} className="sm:col-span-2">
                  <SwitchEntry t={featureT} />
                </div>
              )
            }

            const Entry = feature.entry

            // 入口卡片由功能自己渲染，外壳只负责布局与打开动作
            return (
              <Entry key={feature.id} t={featureT} open={() => setActiveId(feature.id)} />
            )
          })}
        </div>
      )}
    </div>
  )
}
