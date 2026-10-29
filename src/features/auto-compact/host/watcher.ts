/**
 * 「自动压缩会话」的触发逻辑。
 *
 * 宿主在一轮里每次派发模型请求前都会发出 `agent/pre-step`，这里在该时刻读取
 * 会话的 `contextPressure` 投影：上下文窗口占用达到阈值就把较早的历史压成
 * 摘要，然后让本轮继续。因此长会话在回合中间也会被压缩，不必等到整轮结束。
 */
import type {
  AgentLike,
  AgentPreStepEvent,
  CompactionApi,
  HostPluginContext,
  SessionProjectionsApi,
  TokenMeterApi,
} from '../../../types/host'
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

/** Cordis fiber 的最小结构：只需要它自己的作用域。 */
interface FiberLike {
  ctx?: HostPluginContext
}

/** Cordis 注册表的最小结构：每个插件 runtime 持有它的 fiber 列表。 */
interface RegistryLike {
  forEach?(callback: (runtime: { fibers?: Iterable<FiberLike> }) => void): void
}

/** 每个 agent 解析出的服务作用域缓存：服务归属固定，不必每步重扫。 */
const serviceScopeCache = new WeakMap<object, HostPluginContext>()

/**
 * 找到能读到指定服务的作用域。
 *
 * agent preset 会把 `compaction` 之类的能力 isolate 到自己的插件组里：插件根
 * 作用域与 agent 根作用域都读不到，只有该组内 fiber 的 ctx 能取到服务。该组与
 * agent 在 Cordis 里是兄弟分支，因此沿注册表查找可见服务的提供者，而不是在
 * 加载期用 `ctx.inject` 等一个永远不会出现在当前作用域的服务。
 * @param agent 触发本步的 Agent
 * @param name 服务名
 * @returns 可见该服务的作用域；找不到时返回 undefined
 */
function findServiceScope(agent: AgentLike, name: string): HostPluginContext | undefined {
  const root = agent.ctx as unknown as { fiber?: object; registry?: RegistryLike } | undefined
  const agentFiber = root?.fiber
  if (root?.registry?.forEach === undefined || agentFiber === undefined) return undefined

  const cached = serviceScopeCache.get(agentFiber)
  if (cached !== undefined) return cached

  let found: HostPluginContext | undefined
  root.registry.forEach((runtime) => {
    if (found !== undefined) return

    for (const fiber of runtime.fibers ?? []) {
      if (fiber.ctx?.get?.(name) === undefined) continue

      found = fiber.ctx
      return
    }
  })

  if (found !== undefined) serviceScopeCache.set(agentFiber, found)

  return found
}

/**
 * 在指定作用域读取服务，读不到或服务未就绪时返回 undefined。
 * @param scope 作用域
 * @param name 服务名
 * @returns 服务实例
 */
function readFromScope<T>(scope: HostPluginContext | undefined, name: string): T | undefined {
  if (scope === undefined) return undefined

  try {
    return scope.get(name) as T | undefined
  } catch (error) {
    console.error(`[auto-compact] 读取服务 ${name} 失败:`, error)
    return undefined
  }
}

/**
 * 按 Agent 解析宿主服务：先看 agent 自己的作用域，再看服务提供者所在的作用域。
 * @param agent 触发本步的 Agent
 * @param name 服务名
 * @returns 服务实例；不可见时返回 undefined
 */
function readService<T>(agent: AgentLike, name: string): T | undefined {
  return (
    readFromScope<T>(agent.ctx, name) ?? readFromScope<T>(findServiceScope(agent, name), name)
  )
}

/**
 * 读取会话当前的上下文窗口占用。
 * @param agent 触发本步的 Agent
 * @returns 占用比例与窗口容量；缺少窗口容量或用量时返回 undefined
 */
function readContextPressure(agent: AgentLike): ContextPressure | undefined {
  const projections = readService<SessionProjectionsApi>(agent, 'sessionProjections')
  if (projections === undefined) return undefined

  const values = projections.snapshot(agent.session, ['contextPressure']).values
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
    if (!settings.enabled) return

    const session = agent.session
    if (compacting.has(session.id)) return

    const pressure = readContextPressure(agent)
    if (pressure === undefined || pressure.ratio * 100 < settings.thresholdPercent) return

    const engine = readService<CompactionApi>(agent, 'compaction')
    const meter = readService<TokenMeterApi>(agent, 'tokenMeter')
    if (engine?.compactRegion === undefined || meter === undefined) {
      console.error('[auto-compact] 宿主未提供分段压缩能力，跳过本次检查')
      return
    }

    const lastAttempt = attemptedAt.get(session.id)
    if (lastAttempt !== undefined && Date.now() - lastAttempt < RETRY_COOLDOWN_MS) return

    compacting.add(session.id)
    attemptedAt.set(session.id, Date.now())

    try {
      const decision = await compactOlderHistory(
        engine,
        meter,
        agent,
        signal,
        pressure.contextWindow,
        settings.retainPercent,
      )
      if (decision.kind === 'skipped') {
        console.error('[auto-compact] 自动压缩已跳过:', decision.reason)
      }
    } catch (error) {
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
