/**
 * 输入框下方的内存读数胶囊。
 *
 * 挂在 `conversation.composer.dock` 列表里，与宿主的轮次、用量统计并排，
 * 显示全部 DSH 进程的物理内存。开关打开时这里是常驻界面：读数 30 秒刷新一次即可
 * （设置页是 5 秒），不必让每次挂载都持续请求宿主进程表；关闭开关后整块隐藏，
 * 轮询一并停止。
 *
 * 位置排在宿主上下文占用圆环之后：宿主把圆环直接渲染在 dock 的 slot 之后，
 * 插件改不了渲染顺序，只能用 flex 的 order 把自己排到那一行末尾。点击读数
 * 就地弹出设置浮层，省得为了改一个阈值去设置里翻两层。
 */
import React, { useEffect, useState } from 'react'

import type { Translate } from '../../types/plugin'
import { useMemoryGuardEnabled } from './enabled'
import { readMemory } from './measure'
import { MemoryIcon } from './memory-icon'
import { MemoryGuardSettingsDialog } from './settings-dialog'
import type { MemoryReading } from './types'

/** 常驻界面的读数间隔：看趋势即可，不必像设置页那样 5 秒一次。 */
const REFRESH_MS = 30_000

/** 胶囊收到的 props。 */
export interface MemoryUsagePillProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 渲染内存读数胶囊。
 * @param props 翻译函数
 */
export function MemoryUsagePill({ t }: MemoryUsagePillProps) {
  // 开关状态：关闭后读数整块隐藏，也不再向宿主要进程内存
  const enabled = useMemoryGuardEnabled()
  // 最近一次读数；为 null 表示首帧还没读到，此时不占位
  const [reading, setReading] = useState<MemoryReading | null>(null)
  // 设置浮层是否打开
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // 关闭后不轮询：读数界面本身不显示，宿主的进程表也就不用读
    if (!enabled) {
      setReading(null)

      return
    }

    let active = true

    /** 刷新一次读数；卸载后不再写入状态 */
    const refresh = (): void => {
      void readMemory()
        .then((next) => {
          if (active) setReading(next)
        })
        .catch((error: unknown) => {
          console.error('[memory-guard] 读取内存占用失败:', error)
        })
    }

    refresh()
    const timer = window.setInterval(refresh, REFRESH_MS)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [enabled])

  // 开关关闭或首帧还没读到读数时整块隐藏，避免状态栏出现半个空标签
  if (!enabled || reading === null) return null

  // 桌面版显示全部进程合计；浏览器打开的实例只有页面 JS 堆
  const megabytes = reading.totalMB ?? reading.megabytes

  return (
    <>
      {/* 读数按钮：图标 + 数值，点击打开设置浮层；order-last 把它排到上下文圆环之后 */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={settingsOpen}
        aria-label={`${t('dockLabel')} ${megabytes} MB`}
        title={t('dockTitle')}
        onClick={() => setSettingsOpen(true)}
        className="order-last inline-flex items-center gap-1 rounded-md border-0 bg-transparent px-2 py-0.5 text-[12px] leading-5 text-tertiary transition hover:bg-interactive hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* 内存图标：替代「内存」两字，颜色跟随按钮文字；图形在 viewBox 左右自带约 2px 留白，
            因此这里的 gap 比宿主统计项的 6px 小 2px，视觉上才与它们等距 */}
        <MemoryIcon />
        {/* 占用数值：与活动监视器同口径的物理内存 */}
        <span className="tabular-nums">{`${megabytes} MB`}</span>
      </button>
      {settingsOpen ? (
        <MemoryGuardSettingsDialog t={t} onClose={() => setSettingsOpen(false)} />
      ) : null}
    </>
  )
}
