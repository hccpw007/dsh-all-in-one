/**
 * 「对话风格」的客户端扩展：在新会话界面注入独立的风格选择器。
 *
 * 覆盖宿主的预设位（single 插槽，低 priority 生效），但渲染两个并排的独立
 * 下拉：左「模式」只列非风格预设，右「对话风格」只列 `style-*` 预设。
 * 风格本身仍是 Agent 预设，选择后宿主会按该预设挂载工具与技能。
 *
 * 会话与预设服务按需注入：服务缺失时只跳过选择器，设置页仍可正常使用。
 */
import React from 'react'

import type { PluginContext, Translate } from '../../types/plugin'
import { ChatStyleSeat, type ChatStyleSeatProps } from './seat'
import { createSeatController } from './seat-store'

/**
 * 注册新会话界面的风格选择器。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 预设命名空间必须显式 inject：cordis 在未声明依赖时读取属性会直接抛错
  ctx.inject(['sessions', 'remote', 'remote.agentPresets'], (scoped) => {
    const controller = createSeatController(scoped)

    ctx.slots.inject('conversation.hero.agentPreset', () =>
      ctx.slots.register(
        {
          name: 'conversation.hero.agentPreset',
          // 宿主内置选择器使用默认 priority 0；更低的值覆盖它
          priority: -10,
          inject: (sessionId) => ({
            hooks: { chatStyleSeat: controller.store },
            load: () => controller.load(sessionId),
            select: (presetId: string) => controller.select(sessionId, presetId),
            applyStaged: async () => {
              if (sessionId !== undefined) await controller.applyStaged(sessionId)
            },
          }),
        },
        (props: Record<string, unknown>) => (
          <ChatStyleSeat {...(props as unknown as Omit<ChatStyleSeatProps, 't'>)} t={t} />
        ),
      ),
    )
  })
}
