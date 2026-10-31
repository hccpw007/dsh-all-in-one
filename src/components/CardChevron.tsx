/**
 * 卡片「可进入」标记：右向箭头。
 *
 * 网格里同时存在开关型卡片与页面型卡片，两者外观一致，用户无法从卡片本身
 * 判断能否点开设置页面；页面型卡片统一在右下角的「设置」入口后带上这个箭头，
 * 纯装饰，不参与交互（点击仍由所在按钮处理）。颜色继承父级，跟随文字一起变化。
 */
import React from 'react'

/** 箭头边长：与卡片内的功能图标同档，视觉重量不抢标题。 */
const CHEVRON_SIZE = 14

/**
 * 渲染「可进入」箭头标记。
 */
export function CardChevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={CHEVRON_SIZE}
      height={CHEVRON_SIZE}
      aria-hidden="true"
      className="shrink-0"
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
