import React from 'react'

import { cn } from '../../common/cn'

export interface CardProps {
  className?: string
  children?: React.ReactNode
}

/**
 * 内容面板：统一边框、圆角与背景令牌，各 feature 的区块无需重复这组类名。
 * @param props className 可追加布局类，children 为面板内容
 */
export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-line1 bg-layer1', className)}>{children}</div>
  )
}
