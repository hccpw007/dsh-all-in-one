/**
 * 「复制路径」图标。
 *
 * 宿主菜单按贡献项里的 `icon.key` 在 `contextMenu.icon` 插槽里取渲染组件；
 * 图形沿用菜单图标的描边风格（24 网格、currentColor），颜色跟随父元素。
 * 菜单项与设置页开关共用同一形状，尺寸由调用方给出。
 */
import React from 'react'

/** 图标 props。 */
export interface CopyPathIconProps {
  /** 方形边长（px）：菜单项 16，设置页开关 14。 */
  size?: number
}

/**
 * 渲染两页纸叠放的复制图标。
 * @param props 图标尺寸
 */
export function CopyPathIcon({ size = 16 }: CopyPathIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 前置纸边：完整的一页，表达“复制出来的一份” */}
      <rect x="8" y="8" width="13" height="13" rx="2" />
      {/* 后置纸边：只画外侧两段，形成两页叠放而不是三个方框 */}
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  )
}
