import React, { useMemo, useState } from 'react'

import { cn } from '../../common/cn'
import { Button } from '../../components/Button'
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
  /** 区块标题。 */
  title: string
  /** 区块用途说明。 */
  hint: string
  rule: ResourceRule
  options: RuleOption[]
  /** 三种模式的按钮文案。 */
  modeLabels: Record<RuleMode, string>
  /** 当前模式的行为说明。 */
  modeHint: string
  /** 没有可选项时的提示。 */
  emptyText: string
  /** 提供时显示搜索框。 */
  searchPlaceholder?: string
  onChange(rule: ResourceRule): void
}

/** 三态按钮的固定顺序。 */
const MODE_ORDER: RuleMode[] = ['all', 'include', 'exclude']

/**
 * 资源规则编辑：选择「全部 / 仅引用 / 仅排除」，再勾选具体条目。
 *
 * 勾选结果始终按选项原顺序保存，避免保存后列表顺序随点击变化。
 * @param props 标题、规则、可选项与变更回调
 */
export function ResourceRuleField({
  title,
  hint,
  rule,
  options,
  modeLabels,
  modeHint,
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
    <section className="rounded-xl border border-line1 bg-layer1">
      <header className="border-b border-line1 px-4 py-3">
        {/* 区块标题与已选数量 */}
        <div className="flex items-center justify-between gap-2">
          {/* 区块标题 */}
          <h3 className="text-[13px] font-medium text-primary">{title}</h3>
          {/* 已选数量：让用户快速确认规则生效范围 */}
          <span className="text-[12px] text-secondary">
            {selected.size > 0 ? selected.size : ''}
          </span>
        </div>
        {/* 区块用途说明 */}
        <p className="mt-1 text-[12px] leading-[18px] text-secondary">{hint}</p>
      </header>

      {/* 规则模式切换 */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        {MODE_ORDER.map((mode) => (
          <Button
            key={mode}
            variant={rule.mode === mode ? 'outline' : 'ghost'}
            aria-pressed={rule.mode === mode}
            onClick={() => onChange({ mode, items: rule.items })}
          >
            {modeLabels[mode]}
          </Button>
        ))}
        {/* 当前模式的行为说明 */}
        <span className="text-[12px] leading-[18px] text-secondary">{modeHint}</span>
      </div>

      {/* 「全部」不需要逐项勾选 */}
      {rule.mode === 'all' ? null : (
        <div className="px-4 pb-4 pt-3">
          {/* 搜索框：技能数量较多时按名称或描述过滤 */}
          {searchPlaceholder ? (
            <input
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              className="mb-2 w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand"
            />
          ) : null}

          {visibleOptions.length === 0 ? (
            // 没有可选项或搜索无结果时的提示
            <p className="py-3 text-[12px] text-secondary">{emptyText}</p>
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
                            <span className="rounded border border-line1 px-1 py-px text-[10px] text-secondary">
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
    </section>
  )
}
