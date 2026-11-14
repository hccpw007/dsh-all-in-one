/**
 * 「内存守护」的内存条图标。
 *
 * 图形是一段内存条：圆角芯片本体、上下各五根引脚，中间写 RAM。字母用路径手绘，
 * 不用 `<text>`：图标只有 14px，字体渲染会随系统与字号漂移，路径描述在任何尺寸下
 * 都是同一个形状。网格入口与状态栏读数共用，尺寸不同、颜色都跟随父元素。
 */
import React from 'react'

/** 图标 props。 */
export interface MemoryIconProps {
  /** 方形边长（px），网格入口与状态栏用的尺寸不同。 */
  size?: number
}

/**
 * 渲染内存条图标。
 * @param props 图标尺寸
 */
export function MemoryIcon({ size = 14 }: MemoryIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 芯片本体：引脚连接的那块圆角矩形 */}
      <rect x="3.6" y="6.6" width="16.8" height="11.2" rx="3.6" />
      {/* 上排引脚：五根，从本体上沿向外伸出 */}
      <path d="M6.4 4.2v2.4M9.2 4.2v2.4M12 4.2v2.4M14.8 4.2v2.4M17.6 4.2v2.4" />
      {/* 下排引脚：与上排同 x，从本体下沿镜像伸出 */}
      <path d="M6.4 17.8v2.4M9.2 17.8v2.4M12 17.8v2.4M14.8 17.8v2.4M17.6 17.8v2.4" />
      {/* 字母 R：主干、上半圆环、斜腿 */}
      <path d="M6.9 15V9h1.4a1.5 1.5 0 0 1 0 3H6.9M8.4 12l1.2 3" />
      {/* 字母 A：两条斜边加中间横杠 */}
      <path d="M10.2 15l1.5-6 1.5 6M10.7 12.7h2" />
      {/* 字母 M：左竖、中间下折、右竖共用一条笔画 */}
      <path d="M13.8 15V9l1.45 3.1L16.7 9v6" />
    </svg>
  )
}
