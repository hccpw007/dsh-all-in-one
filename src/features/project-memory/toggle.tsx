import React, { useEffect, useRef, useState } from 'react'

import { Button } from '../../components/Button'
import { cn } from '../../common/cn'
import type { FeatureSwitchProps } from '../../shell/registry'
import { loadMemorySettings, saveMemorySettings } from './api'
import { MemoryPathDialog } from './MemoryPathDialog'
import type { MemorySettingsPayload } from './types'

/** 开关入口图标：书签，表达「记住」。 */
function MemoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
      <path d="M9.5 9h5" />
    </svg>
  )
}

/** 设置接口不可用时的空负载：卡片按关闭显示，打开入口仍可重试。 */
const EMPTY_PAYLOAD: MemorySettingsPayload = {
  enabled: false,
  root: '',
  effectiveRoot: '',
  defaultRoot: '',
  settingsPath: '',
}

/**
 * 「项目记忆」开关入口。
 *
 * 开关状态存在宿主磁盘上（提示词装配发生在宿主侧，读不到浏览器存储），因此这里的
 * 状态来自设置接口；切换后立即写回，下一条消息就会带上（或不带）记忆。
 * 卡片下方的「记忆路径」按钮打开弹窗设置记忆根目录。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ProjectMemoryToggle({ t }: FeatureSwitchProps) {
  // 设置负载；为 null 表示仍在读取
  const [payload, setPayload] = useState<MemorySettingsPayload | null>(null)
  // 读写失败的原因；失败时卡片显示提示而不是静默保持旧状态
  const [error, setError] = useState<string | null>(null)
  // 保存切换请求进行中，禁用重复点击
  const [saving, setSaving] = useState(false)
  // 记忆路径弹窗是否打开
  const [dialogOpen, setDialogOpen] = useState(false)
  // 网格每次渲染都会重建 t（外壳按 feature 前缀现生成），不能作为 effect 依赖：
  // 否则「读取设置 → 更新状态 → 重渲染 → 新 t → 再读取」会形成请求死循环
  const translate = useRef(t)
  translate.current = t

  useEffect(() => {
    let active = true

    // 组件可能在请求返回前卸载（切换设置页），此时不再写入状态
    void loadMemorySettings()
      .then((next) => {
        if (active) setPayload(next)
      })
      .catch((failure: unknown) => {
        if (!active) return

        console.error('[project-memory] 读取设置失败:', failure)
        setError(translate.current('loadFailed'))
        setPayload(EMPTY_PAYLOAD)
      })

    return () => {
      active = false
    }
  }, [])

  const enabled = payload?.enabled === true

  const handleToggle = async () => {
    if (payload === null || saving) return

    setSaving(true)
    setError(null)

    try {
      const next = await saveMemorySettings({ enabled: !enabled })
      setPayload(next)
    } catch (failure) {
      console.error('[project-memory] 保存开关状态失败:', failure)
      setError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* 开关入口：撑满卡片宽度与行高、整块可点击，开关语义由 role 与 aria-checked 表达 */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={payload === null || saving}
        onClick={() => void handleToggle()}
        className="flex w-full flex-1 items-center gap-3 rounded-xl border border-line4 bg-layer1 px-4 py-3.5 text-left transition hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base text-brand">
          <MemoryIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 开关标题 */}
          <span className="block text-[13px] font-medium leading-5 text-primary">{t('title')}</span>
          {/* 开关用途说明 */}
          <span className="mt-1 block text-[12px] leading-[18px] text-secondary">
            {t('description')}
          </span>
        </span>
        {/* 开关轨道与滑块，仅作视觉呈现，交互由上层的按钮承担 */}
        <span
          aria-hidden="true"
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition',
            enabled ? 'bg-brand' : 'bg-line2',
          )}
        >
          <span
            className={cn(
              'h-4 w-4 rounded-full bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </span>
      </button>
      {/* 卡片底部操作行：打开记忆根目录设置，并展示读写失败原因 */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        {/* 记忆根目录设置入口 */}
        <Button variant="ghost" onClick={() => setDialogOpen(true)}>
          {t('pathAction')}
        </Button>
        {/* 读写失败提示，说明当前状态未能保存 */}
        {error !== null ? (
          <p className="min-w-0 truncate text-[12px] leading-[18px] text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <MemoryPathDialog
        open={dialogOpen}
        payload={payload}
        onClose={() => setDialogOpen(false)}
        onSaved={setPayload}
        t={t}
      />
    </div>
  )
}
