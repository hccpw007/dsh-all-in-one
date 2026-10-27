import React, { useMemo, useState } from 'react'

import { cn } from '../../common/cn'
import type { ResourceRule, RuleMode } from './types'

/** 可勾选项的展示信息。 */
export interface RuleOption {
  id: string
  label: string
  description?: string
  /** 行内标记，如「已安装插件」。 */
  badge?: string
  /** 风险提示，只在选中时展示。 */
  warning?: string
}

interface ResourceRuleFieldProps {
  /** 分组标签；不传时只渲染模式与列表，用于紧跟在上一个控件后的规则（如 MCP）。 */
  title?: string
  rule: ResourceRule
  options: RuleOption[]
  /** 三种模式的按钮文案。 */
  modeLabels: Record<RuleMode, string>
  /** 没有可选项时的提示。 */
  emptyText: string
  /** 提供时显示搜索框。 */
  searchPlaceholder?: string
  onChange(rule: ResourceRule): void
}

/** 三态按钮的固定顺序。 */
const MODE_ORDER: RuleMode[] = ['all', 'include', 'exclude']

/** 搜索框样式，与表单输入框一致。 */
const SEARCH_CLASS =
  'w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

/**
 * 资源规则编辑：选择「全部 / 仅应用 / 仅排除」，再勾选具体条目。
 *
 * 勾选结果始终按选项原顺序保存，避免保存后列表顺序随点击变化。
 * @param props 标签、规则、可选项与变更回调
 */
export function ResourceRuleField({
  title,
  rule,
  options,
  modeLabels,
  emptyText,
  searchPlaceholder,
  onChange,
}: ResourceRuleFieldProps) {
  const [query, setQuery] = useState('')
  const selected = useMemo(() => new Set(rule.items), [rule.items])

  const visibleOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (keyword === '') return options

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(keyword) ||
        (option.description ?? '').toLowerCase().includes(keyword),
    )
  }, [options, query])

  /** 切换单个条目的勾选状态。 */
  const toggle = (id: string): void => {
    const next = new Set(rule.items)
    if (next.has(id)) next.delete(id)
    else next.add(id)

    // 按选项顺序保存，未在清单中的历史项保留在末尾，避免静默丢失用户配置
    const ordered = options.filter((option) => next.has(option.id)).map((option) => option.id)
    const unknown = [...next].filter((item) => !options.some((option) => option.id === item))

    onChange({ mode: rule.mode, items: [...ordered, ...unknown] })
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 一行内放下分组标签、模式切换与已选数量，省掉独立的区块头部 */}
      <div className="flex flex-wrap items-center gap-3">
        {title ? (
          // 分组标签
          <span className="text-[12px] font-semibold text-primary">{title}</span>
        ) : null}

        {/* 模式切换靠右对齐，与左侧标签形成左右分布 */}
        <div className="ml-auto flex items-center gap-2">
          {/* 规则模式切换：分段控件，容器铺浅底，选中项以白底凸起 */}
          <div
            className="flex items-center rounded-lg border border-line4 bg-layer2 p-0.5"
            role="group"
          >
            {MODE_ORDER.map((mode) => {
              const active = rule.mode === mode

              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ mode, items: rule.items })}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[12px] leading-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    active
                      ? 'bg-base font-medium text-primary shadow-sm'
                      : // 未选中项必须显式透明：preflight 关闭后按钮会带浏览器原生灰底
                        'bg-transparent text-secondary hover:text-primary',
                  )}
                >
                  {modeLabels[mode]}
                </button>
              )
            })}
          </div>

          {/* 已选数量：让用户快速确认规则生效范围 */}
          {selected.size > 0 ? (
            <span className="text-[11px] text-secondary">{selected.size}</span>
          ) : null}
        </div>
      </div>

      {/* 「全部」不需要逐项勾选 */}
      {rule.mode === 'all' ? null : (
        <div className="flex flex-col gap-2">
          {/* 搜索框：技能数量较多时按名称或描述过滤 */}
          {searchPlaceholder ? (
            <input
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              className={SEARCH_CLASS}
            />
          ) : null}

          {visibleOptions.length === 0 ? (
            // 没有可选项或搜索无结果时的提示
            <p className="py-2 text-[12px] text-secondary">{emptyText}</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {visibleOptions.map((option) => {
                const checked = selected.has(option.id)

                return (
                  <li key={option.id}>
                    {/* 条目勾选：整行可点，点击区域覆盖名称与描述 */}
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition',
                        checked ? 'bg-layer2' : 'hover:bg-layer2',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option.id)}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                      />
                      <span className="min-w-0">
                        {/* 条目名称与来源标记 */}
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[12px] font-medium text-primary">
                            {option.label}
                          </span>
                          {option.badge ? (
                            // 条目来源标记，如「已安装插件」
                            <span className="rounded border border-line4 px-1 py-px text-[10px] text-secondary">
                              {option.badge}
                            </span>
                          ) : null}
                        </span>
                        {option.description ? (
                          // 条目说明
                          <span className="mt-0.5 block text-[12px] leading-[18px] text-secondary">
                            {option.description}
                          </span>
                        ) : null}
                        {checked && option.warning ? (
                          // 选中后才提示的风险，避免干扰普通浏览
                          <span className="mt-0.5 block text-[12px] leading-[18px] text-warn">
                            {option.warning}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
