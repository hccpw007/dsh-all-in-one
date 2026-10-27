import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../common/cn'
import type { AgentPresetSummary, Translate } from '../../types/plugin'
import { isStylePreset, type SeatSnapshot } from './seat-store'

/** 内置预设没有自带名称，用语言包补齐显示文案。 */
const BUILTIN_NAME_KEYS: Record<string, string> = {
  standard: 'presetStandardName',
  ptc: 'presetPtcName',
  minimal: 'presetMinimalName',
  cordis: 'presetCordisName',
}

/** 选择器图标：对话气泡，与设置页入口保持同一语义。 */
function SeatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
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
    >
      <path d="m4 6 4 4 4-4" />
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

/**
 * 把预设转成一行说明；内置预设没有自带描述，返回 undefined。
 * @param preset 预设摘要
 * @returns 说明文本
 */
function presetDescription(preset: AgentPresetSummary): string | undefined {
  return preset.description
}

/**
 * 新会话界面的「对话风格」选择器。
 *
 * 覆盖宿主的预设选择器：菜单同时列出「对话风格」与「模式」，风格来自本插件
 * 注册的 `style-*` 预设。新会话屏幕还没有会话时先暂存选择，会话出现后再提交。
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
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  // 插槽每次渲染都可能给出新的函数引用，用 ref 固定下来，effect 只跟随会话变化
  const actionsRef = useRef({ load, applyStaged })
  actionsRef.current = { load, applyStaged }

  // 会话变化时刷新预设名单，并把暂存的选择落到新出现的空白会话
  useEffect(() => {
    void actionsRef.current.load()
    if (sessionId !== undefined) void actionsRef.current.applyStaged()
  }, [sessionId])

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

  const styles = snapshot.options.filter(isStylePreset)
  const modes = snapshot.options.filter((preset) => !isStylePreset(preset))
  const current = snapshot.options.find((preset) => preset.id === snapshot.current)
  const label = current === undefined ? snapshot.current : presetName(current, t)

  /** 选择一个预设并收起菜单；失败原因由 store 写入 error。 */
  const pick = (id: string): void => {
    setOpen(false)
    void select(id)
  }

  return (
    <div ref={rootRef} className="relative">
      {/* 选择器按钮：显示当前风格或模式 */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={snapshot.status === 'loading' || snapshot.options.length === 0}
        onClick={() => {
          const next = !open
          setOpen(next)
          // 设置页可能刚创建了风格，打开菜单时重新读取一次，保证列表最新
          if (next) void load()
        }}
        className={cn(
          'inline-flex min-h-7 max-w-[min(100%,240px)] items-center gap-1 rounded-lg border-0 bg-transparent px-2 text-[13px] font-medium text-primary',
          'hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          snapshot.options.length === 0 && 'cursor-default text-secondary',
        )}
      >
        <SeatIcon />
        {/* 当前选择：风格名或模式名 */}
        <span className="max-w-[180px] truncate">{label}</span>
        <ChevronIcon />
      </button>

      {/* 下拉菜单：风格与模式分组展示 */}
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 max-h-[360px] w-72 overflow-y-auto rounded-xl border border-line1 bg-overlay p-1 shadow-lg"
        >
          {/* 分组标题：本插件注册的对话风格 */}
          <p className="px-2 py-1 text-[11px] text-secondary">{t('styleGroup')}</p>
          {styles.length === 0 ? (
            // 尚未创建风格时的提示，引导去设置页创建
            <p className="px-2 py-1.5 text-[12px] leading-4 text-secondary">{t('seatNoStyles')}</p>
          ) : (
            styles.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="menuitemradio"
                aria-checked={preset.id === snapshot.current}
                onClick={() => pick(preset.id)}
                className={cn(
                  'flex w-full flex-col items-start gap-0.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-left',
                  preset.id === snapshot.current ? 'bg-layer2' : 'hover:bg-layer2',
                )}
              >
                {/* 风格名称 */}
                <span className="text-[13px] text-primary">{presetName(preset, t)}</span>
                {presetDescription(preset) ? (
                  // 风格说明
                  <span className="text-[12px] leading-4 text-secondary">
                    {presetDescription(preset)}
                  </span>
                ) : null}
              </button>
            ))
          )}

          {modes.length > 0 ? (
            <>
              {/* 分组标题：宿主内置与其它预设 */}
              <p className="mt-1 px-2 py-1 text-[11px] text-secondary">{t('modeGroup')}</p>
              {modes.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={preset.id === snapshot.current}
                  onClick={() => pick(preset.id)}
                  className={cn(
                    'flex w-full flex-col items-start gap-0.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-left',
                    preset.id === snapshot.current ? 'bg-layer2' : 'hover:bg-layer2',
                  )}
                >
                  {/* 模式名称 */}
                  <span className="text-[13px] text-primary">{presetName(preset, t)}</span>
                  {presetDescription(preset) ? (
                    // 模式说明
                    <span className="text-[12px] leading-4 text-secondary">
                      {presetDescription(preset)}
                    </span>
                  ) : null}
                </button>
              ))}
            </>
          ) : null}
        </div>
      ) : null}

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
