/**
 * 「对话风格」的客户端扩展：在新会话界面注入独立的风格选择器。
 *
 * 覆盖宿主的预设位（single 插槽，低 priority 生效），但渲染两个并排的独立
 * 下拉：左「模式」只列宿主预设，右「对话风格」只列本插件定义的风格。两者
 * 互不覆盖，风格非空时由宿主侧合成为组合预设。
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
            selectMode: (presetId: string) => controller.selectMode(sessionId, presetId),
            selectStyle: (styleId: string) => controller.selectStyle(sessionId, styleId),
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
