/**
 * 「清空会话」的客户端扩展。
 *
 * 两个入口配合完成清空：
 *   - 输入框最左侧（「添加文件 / 调用指令」的加号之前）的橡皮擦按钮，点击只写入
 *     当前对话的待确认请求；
 *   - 宿主浮层（`shell.overlay`）里的确认弹窗，用户选择是否保留旧对话后才执行。
 *
 * 按钮位置早于宿主输入框左侧插槽，因此按 DOM 注入实现；开关关闭时不安装任何
 * 观察器，页面保持宿主原样。
 */
import React from 'react'

import type { PluginContext, Translate, UiWorkspaceApi } from '../../types/plugin'
import { installClearButton } from './clear-button'
import { clearSession, findCurrentSession } from './clear-session'
import { ClearSessionDialog, type ClearSessionDialogProps } from './ClearSessionDialog'
import { clearSessionStore } from './dialog-store'
import { readClearSessionEnabled } from './storage'
import type { ClearSessionTarget } from './types'

/** 应用级浮层插槽；宿主自带的归档确认弹窗也注册在这里。 */
const OVERLAY_SLOT = 'shell.overlay'

/**
 * 安装清空入口。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表服务缺失时只跳过清空入口，设置页的开关仍可正常使用
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    // 切换主视图与归档都要工作区服务：服务缺失时不勾选「保留」的删除分支仍可用，
    // 但视图不会自动切换、归档会报错，因此这里只做订阅，不阻断按钮安装
    let uiWorkspace: UiWorkspaceApi | undefined
    scoped.inject(['uiWorkspace'], (withWorkspace) => {
      uiWorkspace = withWorkspace.uiWorkspace
      return () => {
        uiWorkspace = undefined
      }
    })

    /** 执行清空；每次调用都重新读 uiWorkspace，避免把安装期的空值缓存下来。 */
    const runClear = async (target: ClearSessionTarget, keepSource: boolean): Promise<unknown> => (
      clearSession({ sessions, uiWorkspace }, target, keepSource)
    )

    ctx.slots.inject(OVERLAY_SLOT, () =>
      ctx.slots.register(
        {
          name: OVERLAY_SLOT,
          id: 'clear-session-confirm',
          inject: () => ({
            hooks: { target: clearSessionStore },
            clear: runClear,
            settle: clearSessionStore.settle,
          }),
        },
        (props: Record<string, unknown>) => (
          <ClearSessionDialog
            {...(props as unknown as Omit<ClearSessionDialogProps, 't'>)}
            t={t}
          />
        ),
      ),
    )

    // 开关关闭时不安装任何观察器（与其它 feature「关闭即不安装」的契约一致）；
    // 开关变更本来就会整页刷新，安装期的读取足以决定是否生效
    if (!readClearSessionEnabled()) return

    ctx.effect(
      () => installClearButton({
        label: t('action'),
        runningHint: t('runningHint'),
        readTarget: () => findCurrentSession({ sessions, uiWorkspace }),
        onRequest: (target) => clearSessionStore.request(target),
      }),
      'clear-session: input button',
    )
  })
}
