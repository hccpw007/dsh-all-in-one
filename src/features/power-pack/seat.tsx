import React, { useEffect, useRef, useState } from 'react'

import {
  IconAgentPresetOutlineRegular,
  IconChevronDownOutlineRegular,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives'

import type { AgentPresetSummary, Translate } from '../../types/plugin'
import type { SeatSnapshot } from './seat-store'

/**
 * 新会话界面的预设选择器直接复用宿主 primitives 的 `Menu` 与图标组件，
 * 不自行实现菜单 DOM；按钮沿用宿主预设选择器的类名，因此与原生样式一致。
 *
 * 左「模式」与右「技能包」是两个独立维度：模式决定基础工具与提示词，
 * 技能包叠加在模式之上筛选技能与工具。
 */

/** 内置预设没有自带名称与描述，用语言包补齐显示文案。 */
const BUILTIN_NAME_KEYS: Record<string, string> = {
  standard: 'presetStandardName',
  ptc: 'presetPtcName',
  minimal: 'presetMinimalName',
  cordis: 'presetCordisName',
}

/** 内置预设描述的文案 key，技能包与自定义预设使用自带描述。 */
const BUILTIN_DESCRIPTION_KEYS: Record<string, string> = {
  standard: 'presetStandardDescription',
  ptc: 'presetPtcDescription',
  minimal: 'presetMinimalDescription',
  cordis: 'presetCordisDescription',
}

/** 新会话选择器收到的 props，由插槽注入。 */
export interface PowerPackSeatProps {
  sessionId?: string
  /** 插槽把 hooks.powerPackSeat 包装成按 selector 取值的 hook。 */
  usePowerPackSeat<T>(selector: (snapshot: SeatSnapshot) => T): T
  load(): Promise<void>
  selectMode(presetId: string): Promise<void>
  selectPack(packId: string): Promise<void>
  applyStaged(): Promise<void>
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 把模式预设转成界面名称：自定义预设用自带名称，内置预设查语言包。
 * @param preset 预设摘要
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 展示名称
 */
function presetName(preset: AgentPresetSummary, t: Translate): string {
  if (preset.name) return preset.name

  const key = BUILTIN_NAME_KEYS[preset.id]
  return key === undefined ? preset.id : t(key)
}

/**
 * 把模式预设转成说明文字：自定义预设用自己的描述，内置预设查语言包。
 * @param preset 预设摘要
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 说明文案，未知时返回 undefined
 */
function presetDescription(preset: AgentPresetSummary, t: Translate): string | undefined {
  if (preset.description) return preset.description

  const key = BUILTIN_DESCRIPTION_KEYS[preset.id]
  return key === undefined ? undefined : t(key)
}

/** 下拉里的一项。 */
interface DropdownOption {
  id: string
  name: string
  description?: string
}

/** 单个下拉的 props。 */
interface PresetDropdownProps {
  /** 当前选中的 id；不在选项中时显示占位文案。 */
  current: string
  options: DropdownOption[]
  /** 没有任何选中项时显示的文案。 */
  placeholder: string
  disabled: boolean
  onPick(id: string): void
}

/**
 * 一个独立的下拉，菜单与按钮均由宿主组件绘制。
 *
 * 调用方各用一个实例并传入自己的选项集合，因此「模式」与「技能包」互不混排。
 * @param props 当前值、选项与选择回调
 */
function PresetDropdown({ current, options, placeholder, disabled, onPick }: PresetDropdownProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.id === current)
  const canOpen = !disabled && options.length > 0

  // 菜单项交给宿主 Menu 渲染；标签结构沿用宿主预设选择器的两行布局
  const items = options.map((option) => ({
    id: option.id,
    label: (
      <span className="ufIuna_item">
        {/* 选项名称 */}
        <span className="ufIuna_itemName">{option.name}</span>
        {option.description ? (
          // 选项说明
          <span className="ufIuna_itemDesc">{option.description}</span>
        ) : null}
      </span>
    ),
  }))

  return (
    <Menu
      open={open && canOpen}
      onClose={() => setOpen(false)}
      items={items}
      selectedId={current}
      onSelect={(id) => {
        setOpen(false)
        onPick(id)
      }}
      align="start"
      portal
      className="ufIuna_menuAnchor"
      anchor={
        // 触发按钮的结构与类名同宿主预设选择器
        <button
          type="button"
          className="ufIuna_seat"
          aria-haspopup="menu"
          aria-expanded={open && canOpen}
          disabled={!canOpen}
          onClick={() => setOpen((value) => !value)}
        >
          <IconAgentPresetOutlineRegular className="ufIuna_seatIcon" />
          <span className="ufIuna_seatLabel">
            {selected === undefined ? placeholder : selected.name}
          </span>
          <IconChevronDownOutlineRegular className="ufIuna_chevron" />
        </button>
      }
    />
  )
}

/**
 * 新会话界面的预设选择区：左侧「模式」、右侧「技能包」两个独立下拉。
 *
 * 覆盖宿主的预设选择器，但模式与技能包各自维护选中值，互不覆盖。新会话屏幕
 * 还没有会话时先暂存选择，会话出现后再提交。
 * @param props 插槽注入的状态与操作
 */
export function PowerPackSeat({
  sessionId,
  usePowerPackSeat,
  load,
  selectMode,
  selectPack,
  applyStaged,
  t,
}: PowerPackSeatProps) {
  const snapshot = usePowerPackSeat((state) => state)
  // 插槽每次渲染都可能给出新的函数引用，用 ref 固定下来，effect 只跟随会话变化
  const actionsRef = useRef({ load, applyStaged })
  actionsRef.current = { load, applyStaged }

  // 会话变化时刷新名单，并把暂存的选择落到新出现的空白会话
  useEffect(() => {
    void actionsRef.current.load()
    if (sessionId !== undefined) void actionsRef.current.applyStaged()
  }, [sessionId])

  const modes: DropdownOption[] = snapshot.modes.map((preset) => ({
    id: preset.id,
    name: presetName(preset, t),
    description: presetDescription(preset, t),
  }))

  const disabled = snapshot.status === 'loading'

  return (
    <div>
      <div className="flex items-center gap-1">
        {/* 模式下拉：只列宿主预设 */}
        <PresetDropdown
          current={snapshot.mode}
          options={modes}
          placeholder={t('modeLabel')}
          disabled={disabled}
          onPick={(id) => void selectMode(id)}
        />
        {/* 技能包下拉：只列本插件定义的技能包 */}
        <PresetDropdown
          current={snapshot.pack}
          options={snapshot.packs}
          placeholder={t('seatLabel')}
          disabled={disabled}
          onPick={(id) => void selectPack(id)}
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
