import React from 'react'

import { cn } from '../common/cn'

/** 按钮视觉变体：ghost 用于轻量文字按钮，outline 用于带边框的次要操作。 */
export type ButtonVariant = 'ghost' | 'outline'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

/** 各变体独有的尺寸与配色，公共的过渡、焦点环在组件内统一拼上。 */
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // 构建关闭了 preflight，浏览器会给 button 加上原生边框与灰底，ghost 必须显式清掉
  ghost:
    'flex items-center gap-1 rounded-lg border-0 bg-transparent px-2 py-1 text-secondary hover:bg-layer2 hover:text-primary',
  // line1、line2 在宿主浅色主题下几乎看不见，描边统一使用宿主最深的 line4
  outline: 'rounded-lg border border-line4 bg-base px-3 py-1.5 text-primary hover:bg-layer2',
}

/**
 * 插件通用按钮：统一主题令牌、过渡与键盘焦点样式，feature 只需选择变体。
 * @param props variant 指定外观，其余属性透传给原生 button
 */
export function Button({ variant = 'ghost', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      // 默认 type=button，避免功能页面放进表单时意外触发提交
      type={type}
      className={cn(
        'text-[12px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        VARIANT_CLASS[variant],
        className,
      )}
      {...rest}
    />
  )
}
