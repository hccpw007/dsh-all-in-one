/**
 * 输入框下方的内存读数胶囊。
 *
 * 挂在 `conversation.composer.dock` 列表末尾，与宿主的轮次、用量统计并排，
 * 显示全部 DSH 进程的物理内存。这里是常驻界面：读数 30 秒刷新一次即可
 * （设置页是 5 秒），不必让每次挂载都持续请求宿主进程表。
 */
import React, { useEffect, useState } from 'react'

import type { Translate } from '../../types/plugin'
import { readMemory } from './measure'
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
  // 最近一次读数；为 null 表示首帧还没读到，此时不占位
  const [reading, setReading] = useState<MemoryReading | null>(null)

  useEffect(() => {
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
  }, [])

  // 还没有读数时整块隐藏，避免状态栏出现半个空标签
  if (reading === null) return null

  // 桌面版显示全部进程合计；浏览器打开的实例只有页面 JS 堆
  const megabytes = reading.totalMB ?? reading.megabytes

  return (
    <span
      className="flex items-center gap-1 text-[11px] leading-[16px] text-secondary"
      title={t('dockTitle')}
    >
      {/* 读数标签 */}
      <span>{t('dockLabel')}</span>
      {/* 占用数值：与活动监视器同口径的物理内存 */}
      <span className="text-primary">{`${megabytes} MB`}</span>
    </span>
  )
}
