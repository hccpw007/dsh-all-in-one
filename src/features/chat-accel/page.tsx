/**
 * 「对话加速」功能页面。
 *
 * 平铺列出全部可勾选条目，点击条目主体切换勾选；带数值参数的条目在勾选后展开输入框。
 * 条目对应的优化逻辑尚未实现，勾选状态与参数只存在页面内存里，离开页面即重置。
 */
import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { FeaturePageProps } from '../../shell/registry'
import type { Translate } from '../../types/plugin'
import { ACCEL_ITEMS, scoreToStars } from './items'
import type { AccelItem } from './items'

/** 勾选标记：只在选中时可见。 */
function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="10"
      height="10"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  )
}

/** 五角星图标：实心填充，颜色由 currentColor 决定。 */
function StarGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={cn('h-3 w-3', className)}
    >
      <path d="M12 2.6l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.62l-5.88 3.09 1.12-6.55L2.48 9.52l6.58-.96L12 2.6Z" />
    </svg>
  )
}

/**
 * 星级评分：固定 5 颗星，支持半星，未点亮部分用浅色占位。
 * @param props stars 0–5 的星数，允许 0.5 的倍数
 */
function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${stars} / 5`}>
      {[0, 1, 2, 3, 4].map((index) => {
        // 每颗星点亮到自己那一份：整星为 1，半星为 0.5，空星为 0
        const ratio = Math.min(1, Math.max(0, stars - index))

        return (
          <span key={index} className="relative block h-3 w-3">
            {/* 未点亮部分 */}
            <StarGlyph className="absolute inset-0 text-line2" />
            {/* 点亮部分：按比例裁切，半星只显示左半边 */}
            {ratio > 0 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${ratio * 100}%` }}
              >
                <StarGlyph className="text-warn" />
              </span>
            ) : null}
          </span>
        )
      })}
    </span>
  )
}

/** 条目数值参数的输入状态。 */
interface FieldState {
  /** 当前草稿值。 */
  value: string
  /** 上一次提交是否不合法。 */
  error: boolean
  /** 草稿变化时回写。 */
  onChange: (value: string) => void
  /** 失焦或回车时提交校验。 */
  onCommit: () => void
}

/** 单条条目的 props。 */
interface AccelRowProps {
  /** 条目定义。 */
  item: AccelItem
  /** 在列表中的下标，用于显示从 1 开始的序号。 */
  index: number
  /** 是否已勾选。 */
  checked: boolean
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 切换勾选状态。 */
  onToggle: (id: string) => void
  /** 数值参数的输入状态；条目没有参数时不传。 */
  field?: FieldState
}

/**
 * 渲染一条条目：序号、名称、推荐度、说明、收益、风险，以及可选的数值参数输入框。
 * @param props 条目属性
 */
function AccelRow({ item, index, checked, t, onToggle, field }: AccelRowProps) {
  return (
    // 条目用浅灰圆角块承载，选中时加深底色并用勾选框表达，不用描边
    <li
      className={cn(
        'rounded-lg px-2.5 py-1.5 transition',
        checked ? 'bg-layer2' : 'bg-layer1 hover:bg-layer2',
      )}
    >
      {/* 条目主体：点击切换勾选 */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onToggle(item.id)}
        className="flex w-full items-start gap-2 border-0 bg-transparent p-0 text-left focus-visible:outline-none"
      >
        {/* 勾选框：选中时填充主色 */}
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
            checked ? 'border-brand bg-brand text-base' : 'border-line2 text-transparent',
          )}
        >
          <CheckGlyph />
        </span>
        {/* 条目内容 */}
        <span className="min-w-0 flex-1">
          {/* 序号、名称与星级 */}
          <span className="flex flex-wrap items-center gap-1.5">
            {/* 条目序号：按推荐星级排序后的次序 */}
            <span className="min-w-[14px] text-[13px] font-semibold leading-[16px] tabular-nums text-primary">
              {index + 1}
            </span>
            {/* 条目名称 */}
            <span className="text-[13px] font-medium leading-[16px] text-primary">
              {t(`${item.id}Name`)}
            </span>
            {/* 推荐星级 */}
            <StarRating stars={scoreToStars(item.score)} />
          </span>
          {/* 条目说明：这个优化解决什么问题 */}
          <span className="mt-0.5 block text-[11px] leading-[15px] text-secondary">
            {t(`${item.id}Hint`)}
          </span>
          {/* 收益与风险并排一行，过长时自然换行 */}
          <span className="mt-0.5 block text-[11px] leading-[15px]">
            <span className="text-primary">
              <span className="text-secondary">{t('gainLabel')} · </span>
              {t(`${item.id}Gain`)}
            </span>
            <span className="ml-2.5 text-secondary">
              {t('riskLabel')} · {t(`${item.id}Risk`)}
            </span>
          </span>
        </span>
      </button>
      {/* 数值参数：只有勾选后出现，且放在主体按钮之外，输入时不会误触勾选 */}
      {item.field && checked && field ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
          <label className="flex items-center gap-1.5">
            {/* 参数输入框标签 */}
            <span className="text-[12px] leading-[16px] text-secondary">
              {t(`${item.id}Threshold`)}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={item.field.min}
              max={item.field.max}
              step={1}
              value={field.value}
              aria-label={t(`${item.id}Threshold`)}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onCommit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') field.onCommit()
              }}
              className="w-16 rounded-md border border-line4 bg-base px-1.5 py-0.5 text-[12px] text-primary outline-none focus:border-brand"
            />
            {/* 参数输入框单位 */}
            <span className="text-[12px] leading-[16px] text-secondary">
              {t(`${item.id}Unit`)}
            </span>
          </label>
          {/* 输入不合法时的提示 */}
          {field.error ? (
            <span className="text-[12px] leading-[16px] text-danger" role="alert">
              {t(`${item.id}Invalid`)}
            </span>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

/**
 * 「对话加速」页面：平铺全部条目，点击切换勾选。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ChatAccelPage({ t }: FeaturePageProps) {
  // 已勾选的条目 id 集合；不持久化，按当前需求只做界面
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set())
  // 各条目数值参数的草稿值，初始为条目定义的默认值
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}

    // 只有带参数的条目需要初始值，没参数的不占键
    for (const item of ACCEL_ITEMS) {
      if (item.field) initial[item.id] = String(item.field.defaultValue)
    }

    return initial
  })
  // 各条目数值参数上次提交是否不合法
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  /**
   * 切换一条条目的勾选状态。
   * @param id 条目 id
   */
  const toggle = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous)

      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })
  }

  /**
   * 校验并提交某条目的数值参数：必须是范围内的整数，非法时回退默认值并提示。
   * @param item 条目定义
   */
  const commitField = (item: AccelItem) => {
    // 取到局部常量后再进闭包，避免属性收窄在回调里失效
    const field = item.field
    if (!field) return

    const parsed = Number((fieldValues[item.id] ?? '').trim())
    const valid = Number.isInteger(parsed) && parsed >= field.min && parsed <= field.max

    setFieldErrors((previous) => ({ ...previous, [item.id]: !valid }))

    if (!valid) {
      setFieldValues((previous) => ({ ...previous, [item.id]: String(field.defaultValue) }))
    }
  }

  return (
    <div>
      {/* 标题与已选计数同一行：计数右对齐，不额外占用一行 */}
      <div className="flex items-baseline justify-between gap-3">
        {/* 页面标题 */}
        <h2 className="text-[16px] font-semibold leading-6 text-primary">{t('pageTitle')}</h2>
        {/* 已选条目计数 */}
        <span className="shrink-0 text-[12px] leading-[18px] text-secondary">
          {t('selectedLabel')}{' '}
          <span className="font-medium text-primary">{selected.size}</span> / {ACCEL_ITEMS.length}{' '}
          {t('itemUnit')}
        </span>
      </div>
      {/* 页面用途说明 */}
      <p className="mt-1 text-[12px] leading-[18px] text-secondary">{t('pageDescription')}</p>
      {/* 条目列表：外框固定高度不滚动，条目在框内滚动 */}
      <ul className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto rounded-xl border border-line4 p-1.5">
        {ACCEL_ITEMS.map((item, index) => (
          <AccelRow
            key={item.id}
            item={item}
            index={index}
            checked={selected.has(item.id)}
            t={t}
            onToggle={toggle}
            field={
              item.field
                ? {
                    value: fieldValues[item.id] ?? '',
                    error: fieldErrors[item.id] === true,
                    onChange: (value: string) => {
                      setFieldValues((previous) => ({ ...previous, [item.id]: value }))
                      setFieldErrors((previous) => ({ ...previous, [item.id]: false }))
                    },
                    onCommit: () => commitField(item),
                  }
                : undefined
            }
          />
        ))}
      </ul>
    </div>
  )
}
