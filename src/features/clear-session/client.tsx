/**
 * 「新会话入口」的客户端扩展。
 *
 * 输入框最左侧（「添加文件 / 调用指令」的加号之前）注入两个圆钮：
 *   - `+`：直接开新会话，当前会话原样保留，与点击工作区上的「新会话」按钮同一入口；
 *   - `-`：只写入当前对话的待确认请求，由宿主浮层里的确认弹窗删除当前会话再开新会话。
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
 * 安装新会话按钮组。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表服务缺失时只跳过输入框入口，设置页的开关仍可正常使用
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    // 切主视图、开新会话与删除都要工作区服务：服务缺失时仍能安装按钮，
    // 只是加号无法切到新对话，因此这里只做订阅，不阻断按钮安装
    let uiWorkspace: UiWorkspaceApi | undefined
    scoped.inject(['uiWorkspace'], (withWorkspace) => {
      uiWorkspace = withWorkspace.uiWorkspace
      return () => {
        uiWorkspace = undefined
      }
    })

    /** 执行删除；每次调用都重新读 uiWorkspace，避免把安装期的空值缓存下来。 */
    const runClear = async (target: ClearSessionTarget): Promise<unknown> => (
      clearSession({ sessions, uiWorkspace, stopTimeoutMessage: t('stopTimeout') }, target)
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

    /**
     * 加号：与工作区行上的「新会话」按钮走同一个宿主入口（复用该工作区的空白会话并切过去）。
     * 当前没有对话时把工作区交给宿主决定，落到当前或最近工作区的新会话页面。
     * @param target 当前对话；空白的新会话页面为 undefined
     */
    const startNew = (target: ClearSessionTarget | undefined): void => {
      const workspace = uiWorkspace
      if (workspace?.startSession === undefined) {
        console.error('[clear-session] 宿主未提供 startSession，无法开启新会话')
        return
      }

      workspace.startSession(target?.workspaceId)
    }

    // 开关关闭时不安装任何观察器（与其它 feature「关闭即不安装」的契约一致）；
    // 开关变更本来就会整页刷新，安装期的读取足以决定是否生效
    if (!readClearSessionEnabled()) return

    ctx.effect(
      () => installClearButton({
        newLabel: t('newAction'),
        deleteLabel: t('deleteAction'),
        readTarget: () => findCurrentSession({ sessions, uiWorkspace }),
        onNew: startNew,
        onDelete: (target) => clearSessionStore.request(target),
      }),
      'clear-session: input buttons',
    )
  })
}
