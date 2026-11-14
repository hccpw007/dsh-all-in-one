/**
 * 输入框右侧的「全自动」开关。
 *
 * 宿主把该按钮渲染在 `conversation.input.right` 插槽里，位置在模型选择器与
 * 「回退」之前的一排控件中。开关按会话生效：读取时带上 sessionId，点击后写宿主，
 * 因此每个对话各自记住自己的状态，新会话默认关闭。
 *
 * 这个按钮不在插件的 `.dsh-aio-root` 容器内，样式只依赖宿主主题令牌与
 * Tailwind 工具类，不套用设置页那套带根节点前缀的规则。
 */
import React, { useEffect, useState } from 'react'

import { cn } from '../../common/cn'
import type { Translate } from '../../types/plugin'
import { loadAutoRunState, saveAutoRunState } from './api'

/** 输入框「全自动」按钮收到的 props。 */
export interface AutoRunToggleProps {
  /** 当前会话标识；新会话尚未创建时缺省。 */
  sessionId?: string
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 渲染「全自动」开关。
 * @param props 当前会话标识与翻译函数
 */
export function AutoRunToggle({ sessionId, t }: AutoRunToggleProps) {
  // null 表示还没从宿主读回状态：此时既不能显示开启也不能允许切换
  const [enabled, setEnabled] = useState<boolean | null>(null)
  // 请求进行中，避免连点写出交叉的状态
  const [pending, setPending] = useState(false)
  // 读取或写入失败的原因，展示在悬停提示里
  const [failure, setFailure] = useState<string | null>(null)

  useEffect(() => {
    // 新会话页面还没有会话标识：按钮保持禁用，等宿主给出会话后再读
    if (sessionId === undefined) {
      setEnabled(null)
      setFailure(null)

      return
    }

    let active = true
    setEnabled(null)
    setFailure(null)

    void loadAutoRunState(sessionId)
      .then((state) => {
        if (!active) return

        setEnabled(state.enabled)
      })
      .catch((error: unknown) => {
        if (!active) return

        console.error('[auto-run] 读取全自动状态失败:', error)
        setFailure(error instanceof Error ? error.message : String(error))
      })

    return () => {
      active = false
    }
  }, [sessionId])

  /** 悬停提示：优先说明失败原因，其次说明当前状态。 */
  const hint = (() => {
    if (failure !== null) return `${t('toggleFailed')}：${failure}`
    if (sessionId === undefined) return t('unavailable')
    if (enabled === null) return t('loading')

    return enabled ? t('hintOn') : t('hintOff')
  })()

  /** 切换当前会话的全自动状态；先改界面再写宿主，失败时回滚。 */
  const toggle = () => {
    if (sessionId === undefined || enabled === null || pending) return

    const next = !enabled
    setEnabled(next)
    setPending(true)
    setFailure(null)

    void saveAutoRunState(sessionId, next)
      .then((state) => {
        setEnabled(state.enabled)
      })
      .catch((error: unknown) => {
        console.error('[auto-run] 写入全自动状态失败:', error)
        // 宿主没接受这次切换：把界面退回原状态，悬停提示给出原因
        setEnabled(!next)
        setFailure(error instanceof Error ? error.message : String(error))
      })
      .finally(() => {
        setPending(false)
      })
  }

  const disabled = sessionId === undefined || enabled === null || pending

  return (
    // 整行即一个开关：左侧固定功能名，右侧滑动轨道表达状态，避免文字长短变化挤动布局
    <button
      type="button"
      role="switch"
      aria-checked={enabled === true}
      aria-label={t('action')}
      title={hint}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'flex h-7 shrink-0 items-center gap-2 rounded-full border-0 bg-transparent px-2 text-[12px] font-medium leading-none transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        enabled === true ? 'text-primary' : 'text-secondary hover:text-primary',
        disabled ? 'opacity-60' : '',
      )}
    >
      {/* 功能名：不随开关状态改文案，状态只由右侧轨道与 aria-checked 表达 */}
      <span>{t('action')}</span>
      {/* 轨道：开启走品牌色，关闭走次级线色；滑块取底色，深浅主题下都能分辨 */}
      <span
        aria-hidden="true"
        className={cn(
          'flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-out',
          enabled === true ? 'bg-brand' : 'bg-line2',
        )}
      >
        {/* 滑块：靠位移区分开与关；描边加投影让它在灰轨道与品牌色轨道上都不糊边 */}
        <span
          className={cn(
            'h-4 w-4 rounded-full bg-base ring-1 ring-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.22)]',
            'transition-transform duration-200 ease-out',
            enabled === true ? 'translate-x-[18px]' : 'translate-x-[2px]',
          )}
        />
      </span>
    </button>
  )
}
