/**
 * 「自动压缩会话」的触发逻辑。
 *
 * 宿主每轮结束时会把 Agent 状态切回 idle，这里在该时刻读取会话的
 * `contextPressure` 投影：上下文窗口占用达到阈值就执行 `/compact`，由宿主
 * 自己完成历史压缩。压缩动作放在空闲之后，避免打断正在执行的回合。
 */
import type { AgentLike, HostPluginContext, SessionLike } from '../../../types/host'
import type { ContextPressureView } from '../types'
import { readAutoCompactSettings } from './settings'

/**
 * 读取会话当前的上下文窗口占用比例。
 * @param ctx 宿主插件上下文
 * @param session 会话
 * @returns 占用比例；缺少窗口容量或用量时返回 undefined
 */
function readPressureRatio(ctx: HostPluginContext, session: SessionLike): number | undefined {
  const projections = ctx.sessionProjections
  if (projections === undefined) return undefined

  const values = projections.snapshot(session, ['contextPressure']).values
  const pressure = values.contextPressure as ContextPressureView | undefined
  // 优先使用推算的下一轮占用，取不到时回退到最近一次请求的实际用量
  const used = pressure?.projectedTokens ?? pressure?.pressureTokens
  const contextWindow = pressure?.contextWindow
  if (used === undefined || contextWindow === undefined || contextWindow <= 0) return undefined

  return used / contextWindow
}

/**
 * 执行一次 `/compact`；失败只记日志，不影响后续回合。
 * @param ctx 宿主插件上下文
 * @param agent 要压缩的会话所属 Agent
 */
async function runCompact(ctx: HostPluginContext, agent: AgentLike): Promise<void> {
  const commands = ctx.commands
  if (commands === undefined) return

  try {
    const execution = await commands.execute(agent, '/compact', [], new AbortController().signal)
    if (execution === undefined) {
      console.error('[auto-compact] 宿主未注册 /compact 命令，自动压缩未执行')
      return
    }

    // 宿主拒绝时（压缩忙、没有可压缩历史等）只记录原因，下一轮再判断
    if (execution.result.kind === 'error') {
      console.error('[auto-compact] 自动压缩未完成:', execution.result.text ?? '未知原因')
    }
  } catch (error) {
    console.error('[auto-compact] 自动压缩失败:', error)
  }
}

/**
 * 注册空闲时机检查，返回取消订阅函数。
 * @param ctx 宿主插件上下文
 * @returns 取消订阅函数
 */
export function installAutoCompactWatcher(ctx: HostPluginContext): () => void {
  // 正在压缩的会话：压缩过程本身也会触发状态切换，必须挡住重复触发
  const compacting = new Set<string>()
  // 最近一次尝试触发时的会话日志序号：同一轮只尝试一次，失败也等下一轮
  const attemptedSeq = new Map<string, number>()

  const dispose = ctx.on('agent/status', (event) => {
    if (event.status !== 'idle') return

    const settings = readAutoCompactSettings()
    if (!settings.enabled) return

    const session = event.agent.session
    if (compacting.has(session.id)) return
    if (attemptedSeq.get(session.id) === session.seq) return

    const ratio = readPressureRatio(ctx, session)
    if (ratio === undefined || ratio * 100 < settings.thresholdPercent) return

    compacting.add(session.id)
    attemptedSeq.set(session.id, session.seq)

    void runCompact(ctx, event.agent).finally(() => {
      compacting.delete(session.id)
    })
  })

  return () => {
    dispose()
    compacting.clear()
    attemptedSeq.clear()
  }
}
