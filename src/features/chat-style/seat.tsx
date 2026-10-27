import React, { useEffect, useRef, useState } from 'react'

import {
  IconAgentPresetOutlineRegular,
  IconChevronDownOutlineRegular,
  Menu,
} from '@deepseek-ai/dsh-client-ui-primitives'

import type { AgentPresetSummary, Translate } from '../../types/plugin'
import { isStylePreset, type SeatSnapshot } from './seat-store'

/**
 * 新会话界面的预设选择器直接复用宿主 primitives 的 `Menu` 与图标组件，
 * 不自行实现菜单 DOM；按钮沿用宿主预设选择器的类名，因此与原生样式一致。
 */

/** 内置预设没有自带名称与描述，用语言包补齐显示文案。 */
const BUILTIN_NAME_KEYS: Record<string, string> = {
  standard: 'presetStandardName',
  ptc: 'presetPtcName',
  minimal: 'presetMinimalName',
  cordis: 'presetCordisName',
}

/** 内置预设描述的文案 key，风格与自定义预设使用自带描述。 */
const BUILTIN_DESCRIPTION_KEYS: Record<string, string> = {
  standard: 'presetStandardDescription',
  ptc: 'presetPtcDescription',
  minimal: 'presetMinimalDescription',
  cordis: 'presetCordisDescription',
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

/**
 * 把预设转成说明文字：自定义预设与风格用自己的描述，内置预设查语言包。
 * @param preset 预设摘要
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 说明文案，未知时返回 undefined
 */
function presetDescription(preset: AgentPresetSummary, t: Translate): string | undefined {
  if (preset.description) return preset.description

  const key = BUILTIN_DESCRIPTION_KEYS[preset.id]
  return key === undefined ? undefined : t(key)
}

/** 单个预设下拉的 props。 */
interface PresetDropdownProps {
  /** 当前选中的预设 id；不在 options 中时显示占位文案。 */
  current: string
  options: AgentPresetSummary[]
  /** 没有任何选中项时显示的文案。 */
  placeholder: string
  disabled: boolean
  onPick(presetId: string): void
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 一个独立的预设下拉，菜单与按钮均由宿主组件绘制。
 *
 * 菜单只列出调用方给定的预设集合，因此「模式」与「风格」可以各用一个实例，
 * 互不混排。
 * @param props 当前值、选项与选择回调
 */
function PresetDropdown({ current, options, placeholder, disabled, onPick, t }: PresetDropdownProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((preset) => preset.id === current)
  const canOpen = !disabled && options.length > 0

  // 菜单项交给宿主 Menu 渲染；标签结构沿用宿主预设选择器的两行布局
  const items = options.map((preset) => {
    const description = presetDescription(preset, t)

    return {
      id: preset.id,
      label: (
        <span className="ufIuna_item">
          {/* 预设名称 */}
          <span className="ufIuna_itemName">{presetName(preset, t)}</span>
          {description ? (
            // 预设说明
            <span className="ufIuna_itemDesc">{description}</span>
          ) : null}
        </span>
      ),
    }
  })

  return (
    <Menu
      open={open && canOpen}
      onClose={() => setOpen(false)}
      items={items}
      selectedId={current}
      onSelect={(id) => {
        setOpen(false)
        if (id !== current) onPick(id)
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
            {selected === undefined ? placeholder : presetName(selected, t)}
          </span>
          <IconChevronDownOutlineRegular className="ufIuna_chevron" />
        </button>
      }
    />
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
          disabled={disabled}
          onPick={pick}
          t={t}
        />
        <PresetDropdown
          current={snapshot.current}
          options={styles}
          placeholder={t('seatLabel')}
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
