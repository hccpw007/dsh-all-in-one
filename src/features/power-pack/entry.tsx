import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../common/cn'
import { CardChevron } from '../../components/CardChevron'
import type { FeatureEntryProps } from '../../shell/registry'
import { loadPowerPacks, setPowerPackEnabled } from './api'
import type { PowerPacksPayload } from './types'

/** 技能包入口图标：对话气泡与调色板，表达为不同对话预设技能包。 */
function PowerPackIcon() {
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

/**
 * 「技能包」在 All In One 网格中的入口。
 *
 * 卡片主体点击进入设置页面，右侧开关控制技能包总开关：关闭时新会话界面不再出现
 * 技能包选择，也不能再合成新组合；已经绑定技能包的历史会话不受影响。
 * 还没有任何技能包时开关不能打开。
 * @param props t 已绑定本 feature 的 key 前缀，open 用于打开功能页面
 */
export function PowerPackEntry({ t, open }: FeatureEntryProps) {
  // 技能包负载；为 null 表示仍在读取
  const [payload, setPayload] = useState<PowerPacksPayload | null>(null)
  // 读写失败的原因；失败时卡片显示提示而不是静默保持旧状态
  const [error, setError] = useState<string | null>(null)
  // 保存开关请求进行中，禁用重复点击
  const [saving, setSaving] = useState(false)
  // 网格每次渲染都会重建 t（外壳按 feature 前缀现生成），不能作为 effect 依赖：
  // 否则「读取状态 → 更新状态 → 重渲染 → 新 t → 再读取」会形成请求死循环
  const translate = useRef(t)
  translate.current = t

  useEffect(() => {
    let active = true

    // 组件可能在请求返回前卸载（切换设置页），此时不再写入状态
    void loadPowerPacks()
      .then((next) => {
        if (active) setPayload(next)
      })
      .catch((failure: unknown) => {
        if (!active) return

        console.error('[power-pack] 读取技能包开关状态失败:', failure)
        setError(translate.current('loadFailed'))
      })

    return () => {
      active = false
    }
  }, [])

  const enabled = payload?.enabled === true
  const hasPacks = (payload?.packs.length ?? 0) > 0
  // 读取完成且没有任何技能包时才提示；读取中只禁用，不误导成需要新建
  const needPacks = payload !== null && !hasPacks
  // 没有任何技能包时不能打开：打开也没有可选内容，宿主侧同样拒绝
  const toggleDisabled = payload === null || saving || needPacks

  /** 切换总开关并写回宿主；成功后刷新页面让新会话界面按新状态加载。 */
  const handleToggle = async () => {
    if (toggleDisabled) return

    setSaving(true)
    setError(null)

    try {
      const next = await setPowerPackEnabled(!enabled)
      setPayload(next)
      // 选择器在客户端扩展加载时按开关状态决定是否显示，刷新一次才能立即生效
      window.location.reload()
    } catch (failure) {
      console.error('[power-pack] 保存技能包开关失败:', failure)
      setError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    // 卡片容器：主体按钮、开关与设置按钮是并列的交互区，不能互相嵌套
    <div className="flex w-full items-start gap-2 rounded-lg border border-line4 bg-layer1 px-2.5 py-1 transition hover:bg-layer2">
      {/* 卡片主体：进入设置页面。preflight 关闭，必须清掉浏览器默认的按钮底色与内边距 */}
      <button
        type="button"
        onClick={open}
        className="flex min-w-0 flex-1 items-start gap-2 rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 入口图标 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-base text-brand">
          <PowerPackIcon />
        </span>
        {/* 入口标题与说明 */}
        <span className="min-w-0 flex-1">
          {/* 入口标题 */}
          <span className="block text-[13px] font-medium leading-[16px] text-primary">{t('title')}</span>
          {/* 入口描述 */}
          <span className="block text-[11px] leading-[14px] text-secondary">
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
      {/* 右侧一列：总开关在上，设置入口在下，两者各自独立 */}
      <div className="flex shrink-0 flex-col items-center justify-between gap-1 self-stretch">
        {/* 技能包总开关：关闭后新会话界面不再出现技能包选择 */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          // 没有技能包时说明为什么打不开，避免禁用后无从得知原因
          aria-label={needPacks ? t('needPacks') : t('title')}
          title={needPacks ? t('needPacks') : undefined}
          disabled={toggleDisabled}
          onClick={() => void handleToggle()}
          className={cn(
            'flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition',
            enabled ? 'bg-brand' : 'bg-line2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-4 w-4 aio-switch bg-base shadow transition-transform',
              enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
            )}
          />
        </button>
        {/* 设置入口：从卡片右下角明确进入技能包页面 */}
        <button
          type="button"
          onClick={open}
          aria-label={t('title')}
          title={t('title')}
          className="flex shrink-0 items-center justify-center gap-0.5 self-end rounded-md border-0 bg-transparent p-0 text-[12px] leading-[16px] text-secondary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {t('settingsAction')}
          <CardChevron />
        </button>
      </div>
    </div>
  )
}
