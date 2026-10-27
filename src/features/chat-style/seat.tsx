import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../common/cn'
import type { AgentPresetSummary, Translate } from '../../types/plugin'
import { isStylePreset, type SeatSnapshot } from './seat-store'

/**
 * 新会话选择器复刻宿主 primitives 的类名。
 *
 * 这些是宿主 `@deepseek-ai/dsh-client-ui-primitives` 与 `ui-agent-preset` 的
 * CSS Modules 类名，直接复用才能与原生模式选择器完全一致（含明暗主题）。
 * 宿主升级导致类名变化时，最坏情况是回退为无样式按钮，不影响功能。
 */

/** 内置预设没有自带名称，用语言包补齐显示文案。 */
const BUILTIN_NAME_KEYS: Record<string, string> = {
  standard: 'presetStandardName',
  ptc: 'presetPtcName',
  minimal: 'presetMinimalName',
  cordis: 'presetCordisName',
}

/** 选择器图标：与宿主预设选择器同尺寸。 */
function SeatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ufIuna_seatIcon"
    >
      <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-5.5A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="14" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
    </svg>
  )
}

/** 展开箭头。 */
function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ufIuna_chevron"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

/** 选中项右侧的勾选标记，路径与宿主菜单一致。 */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="_check_4ub78_179"
    >
      <path d="M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4" />
    </svg>
  )
}

/** 新会话选择器收到的 props，由插槽注入。 */
export interface ChatStyleSeatProps {
  sessionId?: string
  /** 插槽把 hooks.chatStyleSeat 包装成按 selector 取值的 hook。 */
  useChatStyleSeat<T>(selector: (snapshot: SeatSnapshot) => T): T
  load(): Promise<void>
  select(presetId: string): Promise<void>
  applyStaged(): Promise<void>
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 把预设转成界面名称：风格与自定义预设用自带名称，内置预设查语言包。
 * @param preset 预设摘要
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 展示名称
 */
function presetName(preset: AgentPresetSummary, t: Translate): string {
  if (preset.name) return preset.name

  const key = BUILTIN_NAME_KEYS[preset.id]
  return key === undefined ? preset.id : t(key)
}

/** 单个预设下拉的 props。 */
interface PresetDropdownProps {
  /** 当前选中的预设 id；不在 options 中时显示占位文案。 */
  current: string
  options: AgentPresetSummary[]
  /** 没有任何选中项时显示的文案。 */
  placeholder: string
  /** 列表为空时的提示。 */
  emptyText: string
  disabled: boolean
  onPick(presetId: string): void
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 一个独立的预设下拉，外观与宿主原生模式选择器一致。
 *
 * 菜单只列出调用方给定的预设集合，因此「模式」与「风格」可以各用一个实例，
 * 互不混排。
 * @param props 当前值、选项与选择回调
 */
function PresetDropdown({
  current,
  options,
  placeholder,
  emptyText,
  disabled,
  onPick,
  t,
}: PresetDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((preset) => preset.id === current)

  // 点击选择器之外的位置时收起菜单
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent): void => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      {/* 选择器按钮：结构与类名沿用宿主预设选择器 */}
      <span className="_root_4ub78_1 ufIuna_menuAnchor">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((value) => !value)}
          className="ufIuna_seat"
        >
          <SeatIcon />
          <span className="ufIuna_seatLabel">
            {selected === undefined ? placeholder : presetName(selected, t)}
          </span>
          <ChevronIcon />
        </button>
      </span>

      {/* 下拉菜单：表面、材质背景与滚动层都复用宿主菜单结构 */}
      {open ? (
        <div
          role="menu"
          data-menu-material="translucent"
          className="_surface_ri079_1 _list_4ub78_7 _scrollable_4ub78_19 absolute left-0 top-full z-50 mt-1 max-w-[360px]"
        >
          {/* 菜单材质背景层，宿主用 aria-hidden 的独立节点绘制 */}
          <div aria-hidden="true" className="_material_ri079_21" />
          <div className="_viewport_4ub78_19" role="presentation">
            {options.length === 0 ? (
              // 列表为空时的提示
              <div className="_itemWrap_4ub78_90">
                <button type="button" className="_item_4ub78_90" disabled>
                  <span className="_itemLabel_4ub78_190">
                    <span className="ufIuna_item">
                      <span className="ufIuna_itemDesc">{emptyText}</span>
                    </span>
                  </span>
                </button>
              </div>
            ) : (
              options.map((preset) => (
                <div key={preset.id} className="_itemWrap_4ub78_90">
                  {/* 菜单项：选中项加宿主 selected 类，右侧显示勾选 */}
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={preset.id === current}
                    onClick={() => {
                      setOpen(false)
                      onPick(preset.id)
                    }}
                    className={cn('_item_4ub78_90', preset.id === current && '_selected_4ub78_216')}
                  >
                    <span className="_itemLabel_4ub78_190">
                      <span className="ufIuna_item">
                        {/* 预设名称 */}
                        <span className="ufIuna_itemName">{presetName(preset, t)}</span>
                        {preset.description ? (
                          // 预设说明
                          <span className="ufIuna_itemDesc">{preset.description}</span>
                        ) : null}
                      </span>
                    </span>
                    {preset.id === current ? <CheckIcon /> : null}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * 新会话界面的预设选择区：左侧「模式」、右侧「对话风格」两个独立下拉。
 *
 * 覆盖宿主的预设选择器，但把模式与风格拆成两个下拉：模式只列非风格预设，
 * 风格只列本插件注册的 `style-*` 预设。新会话屏幕还没有会话时先暂存选择，
 * 会话出现后再提交。
 * @param props 插槽注入的状态与操作
 */
export function ChatStyleSeat({
  sessionId,
  useChatStyleSeat,
  load,
  select,
  applyStaged,
  t,
}: ChatStyleSeatProps) {
  const snapshot = useChatStyleSeat((state) => state)
  // 插槽每次渲染都可能给出新的函数引用，用 ref 固定下来，effect 只跟随会话变化
  const actionsRef = useRef({ load, applyStaged })
  actionsRef.current = { load, applyStaged }

  // 会话变化时刷新预设名单，并把暂存的选择落到新出现的空白会话
  useEffect(() => {
    void actionsRef.current.load()
    if (sessionId !== undefined) void actionsRef.current.applyStaged()
  }, [sessionId])

  const styles = snapshot.options.filter(isStylePreset)
  const modes = snapshot.options.filter((preset) => !isStylePreset(preset))
  const disabled = snapshot.status === 'loading' || snapshot.options.length === 0

  /** 选择一个预设；失败原因由 store 写入 error。 */
  const pick = (id: string): void => {
    void select(id)
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <PresetDropdown
          current={snapshot.current}
          options={modes}
          placeholder={t('modeLabel')}
          emptyText={t('seatNoModes')}
          disabled={disabled}
          onPick={pick}
          t={t}
        />
        <PresetDropdown
          current={snapshot.current}
          options={styles}
          placeholder={t('seatLabel')}
          emptyText={t('seatNoStyles')}
          disabled={disabled}
          onPick={pick}
          t={t}
        />
      </div>

      {/* 提交失败提示：会话已开始或宿主拒绝切换 */}
      {snapshot.error ? (
        <p className="mt-1 text-[12px] leading-4 text-danger" role="alert">
          {snapshot.error === 'session already started'
            ? t('seatSessionStarted')
            : `${t('seatSelectFailed')}：${snapshot.error}`}
        </p>
      ) : null}
    </div>
  )
}
