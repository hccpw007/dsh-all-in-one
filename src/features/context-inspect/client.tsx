/**
 * 「上下文详情」的客户端扩展。
 *
 * 开关打开时接管上下文气泡里的前两行：点击「系统提示词」或「工具定义」就打开
 * 本功能的详情窗口。开关关闭时不安装任何观察器，宿主气泡保持原样。
 * 扩展只读会话数据，不修改任何会话内容，也不发起写请求。
 */
import type { PluginContext, SessionsApi, Translate } from '../../types/plugin'

import { requestContextInspect } from './api'
import { openContextInspectDialog, type ContextDialogLabels } from './dialog'
import { installMeterRows } from './meter-rows'
import { readContextInspectEnabled } from './storage'

/**
 * 取当前正在浏览的会话标识。
 *
 * 宿主在会话摘要上标记它被哪些界面持有，`mainView` 大于 0 即主视图里打开的
 * 那条会话；上下文气泡本来就属于它，因此这里按同一标记定位。
 * @param sessions 会话服务
 * @returns 会话标识；没有打开的会话时返回 undefined
 */
function currentSessionId(sessions: SessionsApi): string | undefined {
  const state = sessions.list.getSnapshot()

  return state.ids.find((id) => (state.byId[id]?.retainedBy?.mainView ?? 0) > 0)
}

/**
 * 安装上下文弹层的行接管。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  if (!readContextInspectEnabled()) return

  // 没有会话服务就定位不到当前会话，详情窗口也就无从读取
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    const labels: ContextDialogLabels = {
      dialogTitle: t('dialogTitle'),
      dialogHint: t('dialogHint'),
      tabSystem: t('tabSystem'),
      tabTools: t('tabTools'),
      tabMessages: t('tabMessages'),
      loading: t('loading'),
      loadFailed: t('loadFailed'),
      retry: t('retry'),
      refresh: t('refresh'),
      copy: t('copy'),
      copied: t('copied'),
      close: t('close'),
      emptySystem: t('emptySystem'),
      emptyTools: t('emptyTools'),
      emptyMessages: t('emptyMessages'),
      noSession: t('noSession'),
      updatedAt: t('updatedAt'),
      toolCount: t('toolCount'),
      charCount: t('charCount'),
      paramCount: t('paramCount'),
      noDescription: t('noDescription'),
      messageCount: t('messageCount'),
      messagesTruncated: t('messagesTruncated'),
      roleUser: t('roleUser'),
      roleAssistant: t('roleAssistant'),
      roleTool: t('roleTool'),
      roleDeveloper: t('roleDeveloper'),
    }

    ctx.effect(
      () => installMeterRows({
        labels: {
          systemHint: t('systemHint'),
          toolsHint: t('toolsHint'),
          messagesHint: t('messagesHint'),
        },
        open: (section) => {
          openContextInspectDialog({
            section,
            labels,
            load: async (signal) => {
              const sessionId = currentSessionId(sessions)
              if (sessionId === undefined) return null

              return requestContextInspect(sessionId, signal)
            },
          })
        },
      }),
      'context-inspect: meter rows',
    )
  })
}
