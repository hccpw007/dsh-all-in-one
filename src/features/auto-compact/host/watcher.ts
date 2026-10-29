/**
 * 「自动压缩会话」的触发逻辑。
 *
 * 宿主在一轮里每次派发模型请求前都会发出 `agent/pre-step`，这里在该时刻读取
 * 会话的 `contextPressure` 投影：上下文窗口占用达到阈值就把较早的历史压成
 * 摘要，然后让本轮继续。因此长会话在回合中间也会被压缩，不必等到整轮结束。
 */
import { appendFileSync } from 'node:fs'

import type { AgentLike, AgentPreStepEvent, HostPluginContext } from '../../../types/host'
import type { ContextPressureView } from '../types'
import { compactOlderHistory } from './region'
import { readAutoCompactSettings } from './settings'

/** 同一会话两次压缩尝试之间的最短间隔；压缩失败时避免每一步都重试。 */
const RETRY_COOLDOWN_MS = 30_000

/** 一次检查读到的上下文占用。 */
interface ContextPressure {
  /** 占用比例，0-1。 */
  ratio: number
  /** 模型上下文窗口容量。 */
  contextWindow: number
}

/**
 * 读取会话当前的上下文窗口占用。
 * @param ctx 宿主插件上下文
 * @param session 会话
 * @returns 占用比例与窗口容量；缺少窗口容量或用量时返回 undefined
 */
function readContextPressure(
  ctx: HostPluginContext,
  session: AgentLike['session'],
): ContextPressure | undefined {
  const projections = ctx.sessionProjections
  if (projections === undefined) return undefined

  const values = projections.snapshot(session, ['contextPressure']).values
  const pressure = values.contextPressure as ContextPressureView | undefined
  // 优先使用推算的下一轮占用，取不到时回退到最近一次请求的实际用量
  const used = pressure?.projectedTokens ?? pressure?.pressureTokens
  const contextWindow = pressure?.contextWindow
  if (used === undefined || contextWindow === undefined || contextWindow <= 0) return undefined

  return { ratio: used / contextWindow, contextWindow }
}

/**
 * 注册每步前的检查，返回取消订阅函数。
 * @param ctx 宿主插件上下文
 * @returns 取消订阅函数
 */
export function installAutoCompactWatcher(ctx: HostPluginContext): () => void {
  // 正在压缩的会话：压缩过程本身会推进会话，必须挡住重复触发
  const compacting = new Set<string>()
  // 每个会话最近一次尝试的时间，用于失败冷却
  const attemptedAt = new Map<string, number>()

  /**
   * 达到阈值时压缩一段较早的历史；任何失败都只记日志，不影响本轮继续。
   * @param agent 触发本步的 Agent
   * @param signal 本轮取消信号
   */
  const check = async (agent: AgentLike, signal: AbortSignal): Promise<void> => {
    const settings = readAutoCompactSettings()
    // 临时调试：把每步检查结果写文件，确认宿主侧能力是否就绪
    appendFileSync(
      '/tmp/ac-debug.log',
      `${new Date().toISOString()} pid=${process.pid} session=${agent.session.id} enabled=${settings.enabled} threshold=${settings.thresholdPercent} retain=${settings.retainPercent} engine=${String(ctx.compaction?.compactRegion !== undefined)} meter=${String(ctx.tokenMeter !== undefined)} projections=${String(ctx.sessionProjections !== undefined)} pressure=${JSON.stringify(readContextPressure(ctx, agent.session))}\n`,
    )
    if (!settings.enabled) return

    const session = agent.session
    if (compacting.has(session.id)) return

    const pressure = readContextPressure(ctx, session)
    if (pressure === undefined || pressure.ratio * 100 < settings.thresholdPercent) return

    const lastAttempt = attemptedAt.get(session.id)
    if (lastAttempt !== undefined && Date.now() - lastAttempt < RETRY_COOLDOWN_MS) return

    compacting.add(session.id)
    attemptedAt.set(session.id, Date.now())

    try {
      const decision = await compactOlderHistory(
        ctx,
        agent,
        signal,
        pressure.contextWindow,
        settings.retainPercent,
      )
      appendFileSync('/tmp/ac-debug.log', `${new Date().toISOString()} decision=${JSON.stringify(decision)}\n`)
      if (decision.kind === 'skipped') {
        console.error('[auto-compact] 自动压缩已跳过:', decision.reason)
      }
    } catch (error) {
      appendFileSync('/tmp/ac-debug.log', `${new Date().toISOString()} error=${String(error)}\n`)
      console.error('[auto-compact] 自动压缩失败:', error)
    } finally {
      compacting.delete(session.id)
    }
  }

  const dispose = ctx.on('agent/pre-step', async ({ agent, signal }: AgentPreStepEvent, next) => {
    if (!signal.aborted) await check(agent, signal)

    return next()
  })

  return () => {
    dispose()
    compacting.clear()
    attemptedAt.clear()
  }
}
