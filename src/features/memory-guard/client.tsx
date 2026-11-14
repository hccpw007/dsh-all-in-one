/**
 * 「内存守护」的客户端扩展。
 *
 * 三个挂载点：
 *   1. 常驻定时器：用户不会为了等一次回收而停在设置页，所以无论开关状态都要安装，
 *      开关只决定每次检查时是否真的执行动作；
 *   2. 输入框下方状态栏的内存读数（`conversation.composer.dock`），排在宿主的活动
 *      与用量统计之后；
 *   3. 会话头部右上角的「回收并重建」按钮（`conversation.session.header.utilities`）。
 *
 * 读数与按钮只读共享存储，开关关闭时也照常显示：看不到占用更没法判断要不要回收。
 */
import React from 'react'

import type { PluginContext, Translate } from '../../types/plugin'
import { MemoryUsagePill } from './dock'
import { installMemoryGuard } from './guard'
import { MemoryGuardAction } from './header-action'

/** 输入框下方状态栏的插槽名。 */
const DOCK_SLOT = 'conversation.composer.dock'

/** 会话头部右侧工具区的插槽名。 */
const HEADER_UTILITIES_SLOT = 'conversation.session.header.utilities'

/**
 * 安装定时检查、状态栏读数与头部重建按钮。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  ctx.effect(() => {
    const handle = installMemoryGuard(t)

    return () => handle.dispose()
  }, 'memory-guard: timer')

  // 状态栏读数：order 取大值，排在宿主 activity(0)、usage(1) 与上下文圆环之后，
  // 成为这一排最右侧的读数，正好落在状态栏的空白处
  ctx.slots.inject(DOCK_SLOT, () =>
    ctx.slots.register(
      { name: DOCK_SLOT, id: 'memory-guard', order: 1000 },
      () => <MemoryUsagePill t={t} />,
    ),
  )

  // 头部按钮：排在工具区末尾，点击后回收并重建页面
  ctx.slots.inject(HEADER_UTILITIES_SLOT, () =>
    ctx.slots.register(
      { name: HEADER_UTILITIES_SLOT, id: 'memory-guard-rebuild', order: 100 },
      () => <MemoryGuardAction t={t} />,
    ),
  )
}
