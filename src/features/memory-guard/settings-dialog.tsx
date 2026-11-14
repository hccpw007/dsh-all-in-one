/**
 * 「内存守护」设置浮层。
 *
 * 状态栏那一行只有读数，参数与手动按钮放不下；点击读数就地弹出与设置页同一份
 * 内容，省得为了改一个阈值去设置里翻两层。
 *
 * 遮罩、Esc、焦点陷阱与 body 挂载都交给宿主的 Modal：composer 是合成层，自己写
 * 固定定位的子树会相对它定位，落到输入框旁边而不是视口中央。
 */
import React from 'react'

import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'

import type { Translate } from '../../types/plugin'
import { MemoryGuardPage } from './page'

/** 浮层 props。 */
export interface MemoryGuardSettingsDialogProps {
  /** 已绑定本 feature 前缀的翻译函数，标题与页面共用。 */
  t: Translate
  /** 关闭浮层。 */
  onClose: () => void
}

/** 关闭图标：与宿主弹窗的关闭按钮同形，描边跟随文字色。 */
function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  )
}

/**
 * 渲染设置浮层。
 *
 * 用 headless 的 Modal 是为了让页面自己绘制标题（与设置页完全一致），
 * 宿主的默认 header 会再写一遍同一个标题。
 * @param props 翻译函数与关闭回调
 */
export function MemoryGuardSettingsDialog({ t, onClose }: MemoryGuardSettingsDialogProps) {
  return (
    <Modal
      open
      headless
      onClose={onClose}
      title={t('pageTitle')}
      // 宿主的弹窗宽度按确认框设计（380px），设置页的两张卡片需要更宽的阅读列。
      // 高度用 max-h-full 卡在弹窗的 24px 内边距容器里，内容超出时由下面那层滚动，
      // 不写视口 calc：宿主已经按视口算过一次，重复计算会在缩放时对不齐
      className="dsh-aio-root !w-[560px] max-h-full"
    >
      {/* 内容列：卡片高度受限时在内部滚动，关闭按钮不随内容滚走 */}
      <div className="relative min-h-0 w-full flex-1 overflow-y-auto px-5 py-4">
        {/* 关闭按钮：与设置弹窗右上角的关闭按钮同位置、同交互 */}
        <button
          type="button"
          aria-label={t('dialogClose')}
          title={t('dialogClose')}
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-secondary transition hover:bg-interactive hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <CloseIcon />
        </button>
        <MemoryGuardPage t={t} />
      </div>
    </Modal>
  )
}
