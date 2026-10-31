/**
 * 卡片「可进入」标记：右向箭头。
 *
 * 网格里同时存在开关型卡片与页面型卡片，两者外观一致，用户无法从卡片本身
 * 判断能否点开设置页面；页面型卡片统一在进入入口旁带上这个箭头，纯装饰，
 * 不参与交互（点击仍由所在按钮处理）。
 */
import React from 'react'

import { cn } from '../common/cn'

/** 箭头边长：与卡片内的功能图标同档，视觉重量不抢标题。 */
const CHEVRON_SIZE = 14

interface CardChevronProps {
  /** 追加的定位类，由调用方决定箭头在卡片中如何对齐。 */
  className?: string
}

/**
 * 渲染「可进入」箭头标记。
 * @param props className 由调用方定位箭头
 */
export function CardChevron({ className }: CardChevronProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={CHEVRON_SIZE}
      height={CHEVRON_SIZE}
      aria-hidden="true"
      className={cn('shrink-0 text-secondary', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  )
}
