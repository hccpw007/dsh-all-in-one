/**
 * 「会话历史左侧」的客户端扩展。
 *
 * 主开关打开时安装轮次导航处理：把右侧导航条挪到左侧；第二开关打开时，
 * 在每一轮旁显示用户输入。第二开关只在主开关打开后出现在设置页，
 * 所以这里以主开关为准，关闭时不安装任何监听。
 */
import type { PluginContext, SessionsApi } from '../../types/plugin'
import { readSessionHistoryEnabled, readShowInputsEnabled } from './storage'
import { installTurnNav } from './turn-nav'

/**
 * 取当前正在浏览的会话 id。
 * @param sessions 宿主客户端会话列表服务
 * @returns 会话 id；没有任何会话被主视图持有时返回 undefined
 */
function resolveCurrentSessionId(sessions: SessionsApi): string | undefined {
  const snapshot = sessions.list.getSnapshot()

  for (const [id, summary] of Object.entries(snapshot.byId)) {
    if ((summary?.retainedBy?.mainView ?? 0) > 0) return id
  }

  return undefined
}

/**
 * 安装轮次导航处理。
 * @param ctx 客户端插件上下文
 */
export function apply(ctx: PluginContext): void {
  if (!readSessionHistoryEnabled()) return

  const showInputs = readShowInputsEnabled()
  // 会话服务缺失时导航条照常移动，只是拿不到轮次文本
  let resolveSessionId = (): string | undefined => undefined

  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions
    if (sessions === undefined) return

    resolveSessionId = () => resolveCurrentSessionId(sessions)

    return () => {
      resolveSessionId = () => undefined
    }
  })

  // 服务就绪后才会替换上面的实现，这里必须每次重新读取，不能捕获旧函数
  ctx.effect(
    () => installTurnNav({ showInputs, resolveSessionId: () => resolveSessionId() }),
    'session-history: turn-nav',
  )
}
