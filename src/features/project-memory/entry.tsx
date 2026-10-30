import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../common/cn'
import type { FeatureEntryProps } from '../../shell/registry'
import { loadMemorySettings, saveMemorySettings } from './api'
import type { MemorySettingsPayload } from './types'

/** 入口图标：书签，表达「记住」。 */
function MemoryIcon() {
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
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
      <path d="M9.5 9h5" />
    </svg>
  )
}

/** 设置接口不可用时的空负载：卡片按关闭显示，打开页面后仍可重试。 */
const EMPTY_PAYLOAD: MemorySettingsPayload = {
  enabled: false,
  root: '',
  effectiveRoot: '',
  defaultRoot: '',
  settingsPath: '',
}

/**
 * 「项目记忆」在 All In One 网格中的入口。
 *
 * 卡片主体点击进入功能页面（配置记忆路径），右侧开关单独控制启用状态。
 * 开关状态存在宿主磁盘上（提示词装配发生在宿主侧，读不到浏览器存储），因此这里
 * 的状态来自设置接口；切换后立即写回，下一条消息就会带上（或不带）记忆。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function ProjectMemoryEntry({ t, open }: FeatureEntryProps) {
  // 设置负载；为 null 表示仍在读取
  const [payload, setPayload] = useState<MemorySettingsPayload | null>(null)
  // 读写失败的原因；失败时卡片显示提示而不是静默保持旧状态
  const [error, setError] = useState<string | null>(null)
  // 保存切换请求进行中，禁用重复点击
  const [saving, setSaving] = useState(false)
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

  /** 切换启用状态并写回宿主；失败时保留提示，不吃掉错误。 */
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
    // 卡片容器：主体按钮、开关与设置按钮是并列的交互区，不能互相嵌套
    <div className="flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1.5 transition hover:bg-layer2">
      {/* 卡片主体：进入功能页面配置记忆路径。preflight 关闭，必须清掉浏览器默认的按钮底色与内边距 */}
      <button
        type="button"
        onClick={open}
        className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <MemoryIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 入口标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 入口描述 */}
          <span className="block text-[12px] leading-[16px] text-secondary">
            {t('description')}
          </span>
          {/* 读写失败提示：说明当前状态未能保存 */}
          {error !== null ? (
            <span className="block text-[12px] leading-[16px] text-danger" role="alert">
              {error}
            </span>
          ) : null}
        </span>
      </button>
      {/* 右侧一列：启用开关在上，设置按钮在下，两者各自独立 */}
      <div className="flex shrink-0 flex-col items-center justify-between gap-1 self-stretch">
        {/* 启用开关：只有轨道参与交互，避免与进入页面混淆 */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={t('title')}
          disabled={payload === null || saving}
          onClick={() => void handleToggle()}
          className={cn(
            'flex h-5 w-9 shrink-0 items-center rounded-full border-0 p-0 transition',
            enabled ? 'bg-brand' : 'bg-line2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-4 w-4 rounded-full bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </button>
        {/* 设置按钮：从卡片右下角明确进入记忆路径页面 */}
        <button
          type="button"
          onClick={open}
          aria-label={t('pathTitle')}
          title={t('pathTitle')}
          className="flex items-center justify-center rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {t('settingsAction')}
        </button>
      </div>
    </div>
  )
}
