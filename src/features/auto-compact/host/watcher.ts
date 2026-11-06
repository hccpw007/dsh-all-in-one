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
  TokenMeterMeasurement,
} from '../../../types/host'
import type { ContextBreakdownView, ContextPressureView } from '../types'
import { compactOlderHistory } from './region'
import { readAutoCompactSettings } from './settings'

/** 同一会话两次压缩尝试之间的最短间隔；压缩失败时避免每一步都重试。 */
const RETRY_COOLDOWN_MS = 30_000

/** 服务解析失败的负缓存时长：服务可能随会话建立后才就绪，过期后再重试。 */
const SCOPE_MISS_TTL_MS = 30_000

/** 同一会话两次全量计量的最小间隔：长会话里按表面节点数线性增长的测量会被压到 0.5 次/秒。 */
const MEASURE_INTERVAL_MS = 2000

/** 上下文窗口的缓存时长：模型切换不频繁，没必要每一步读一次投影。 */
const CONTEXT_WINDOW_TTL_MS = 30_000

/**
 * 每个会话在本模块里最多保留的跟踪条目。
 *
 * 长进程会经历大量历史会话，缓存不能按会话数无界增长；超出后淘汰最早插入的一条
 * （Map 保持插入顺序），被淘汰的会话再次访问时重新计算即可。
 */
const MAX_TRACKED_SESSIONS = 500

/** 一个「agent × 服务名」的解析结果缓存。 */
interface ScopeCacheEntry {
  /** 提供该服务的作用域；解析失败时为空。 */
  scope?: HostPluginContext
  /** 失效时间；命中结果用 Infinity 表示不再过期。 */
  expiresAt: number
}

/** Cordis fiber 的最小结构：只需要它自己的作用域。 */
interface FiberLike {
  ctx?: HostPluginContext
}

/** Cordis 注册表的最小结构：每个插件 runtime 持有它的 fiber 列表。 */
interface RegistryLike {
  forEach?(callback: (runtime: { fibers?: Iterable<FiberLike> }) => void): void
}

/**
 * 每个 agent、每个服务名的解析结果缓存。
 *
 * 服务归属固定，连「解析不到」也要缓存：宿主每步都会触发检查，不缓存 miss 就会
 * 每一步把整个注册表扫一遍（agent 数 × fiber 数），会话越长 CPU 占用越高。
 */
const serviceScopeCache = new WeakMap<object, Map<string, ScopeCacheEntry>>()

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

  const cached = serviceScopeCache.get(agentFiber)?.get(name)
  if (cached !== undefined && cached.expiresAt > Date.now()) return cached.scope

  let found: HostPluginContext | undefined
  root.registry.forEach((runtime) => {
    if (found !== undefined) return

    for (const fiber of runtime.fibers ?? []) {
      if (fiber.ctx?.get?.(name) === undefined) continue

      found = fiber.ctx
      return
    }
  })

  const entries = serviceScopeCache.get(agentFiber) ?? new Map<string, ScopeCacheEntry>()
  entries.set(
    name,
    found === undefined
      ? { expiresAt: Date.now() + SCOPE_MISS_TTL_MS }
      : { scope: found, expiresAt: Number.POSITIVE_INFINITY },
  )
  serviceScopeCache.set(agentFiber, entries)

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
 * 读取会话当前模型的上下文窗口容量。
 * @param agent 触发本步的 Agent
 * @returns 窗口容量；投影里没有有效容量时返回 undefined
 */
function readContextWindow(agent: AgentLike): number | undefined {
  const projections = readService<SessionProjectionsApi>(agent, 'sessionProjections')
  if (projections === undefined) return undefined

  const values = projections.snapshot(agent.session, ['contextPressure']).values
  const pressure = values.contextPressure as ContextPressureView | undefined
  const contextWindow = pressure?.contextWindow
  if (contextWindow === undefined || contextWindow <= 0) return undefined

  return contextWindow
}

/**
 * 读取启发式工具定义占用：不随历史压缩变化的固定开销。
 * @param agent 触发本步的 Agent
 * @returns 工具定义占用；投影缺失或值非法时返回 undefined
 */
function readToolsTokens(agent: AgentLike): number | undefined {
  const projections = readService<SessionProjectionsApi>(agent, 'sessionProjections')
  if (projections === undefined) return undefined

  const values = projections.snapshot(agent.session, ['contextBreakdown']).values
  const breakdown = values.contextBreakdown as ContextBreakdownView | undefined
  const toolsTokens = breakdown?.breakdown?.toolsTokens
  // 缺失或非法值交给调用方回退到「整份差额当固定开销」的保守口径
  if (toolsTokens === undefined || !Number.isFinite(toolsTokens) || toolsTokens < 0) return undefined

  return toolsTokens
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
  // 已告警过「缺少分段压缩能力」的会话：每步都打一条会把日志与 CPU 一起拖满
  const warnedSessions = new Set<string>()
  // 最近的计量结果，用于把「按表面节点数增长」的测量节流
  const measurements = new Map<string, { at: number; value: TokenMeterMeasurement }>()
  // 最近的上下文窗口，用于跳过每一步的投影读取
  const windows = new Map<string, { at: number; value: number | undefined }>()

  /** 触发一次，把最早插入的条目挤出去。 */
  const evictOldest = (map: Map<string, unknown>): void => {
    if (map.size <= MAX_TRACKED_SESSIONS) return

    const oldest = map.keys().next()
    if (!oldest.done) map.delete(oldest.value)
  }

  /**
   * 读取会话的上下文窗口，按会话缓存一段时间。
   * @param agent 触发本步的 Agent
   * @returns 窗口容量；投影里没有有效容量时返回 undefined
   */
  const contextWindowFor = (agent: AgentLike): number | undefined => {
    const id = agent.session.id
    const cached = windows.get(id)
    const now = Date.now()
    if (cached !== undefined && now - cached.at < CONTEXT_WINDOW_TTL_MS) return cached.value

    const value = readContextWindow(agent)
    windows.set(id, { at: now, value })
    evictOldest(windows)

    return value
  }

  /**
   * 读取会话占用并节流。
   *
   * `measure` 的成本随表面节点数线性增长，流式长会话每一步都全量测量会持续抬高
   * 稳态 CPU。间隔内的重复检查直接复用上一次结果：它只用于判断「是否达到阈值」，
   * 真正的压缩前会重新测量一次。
   * @param meter 计价服务
   * @param agent 触发本步的 Agent
   * @param force 是否必须重新测量
   * @returns 计量结果
   */
  const measureFor = (
    meter: TokenMeterApi,
    agent: AgentLike,
    force: boolean,
  ): { measurement: TokenMeterMeasurement; fresh: boolean } => {
    const id = agent.session.id
    const cached = measurements.get(id)
    const now = Date.now()

    if (!force && cached !== undefined && now - cached.at < MEASURE_INTERVAL_MS) {
      return { measurement: cached.value, fresh: false }
    }

    const value = meter.measure(agent.session)
    measurements.set(id, { at: now, value })
    evictOldest(measurements)

    return { measurement: value, fresh: true }
  }

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

    // 冷却期内不必读取窗口与计价：上一次尝试刚失败，本步也只会被再次拒绝
    const lastAttempt = attemptedAt.get(session.id)
    if (lastAttempt !== undefined && Date.now() - lastAttempt < RETRY_COOLDOWN_MS) return

    const contextWindow = contextWindowFor(agent)
    if (contextWindow === undefined) return

    const engine = readService<CompactionApi>(agent, 'compaction')
    const meter = readService<TokenMeterApi>(agent, 'tokenMeter')
    if (engine?.compactRegion === undefined || meter === undefined) {
      if (!warnedSessions.has(session.id)) {
        warnedSessions.add(session.id)
        if (warnedSessions.size > MAX_TRACKED_SESSIONS) {
          const oldest = warnedSessions.values().next()
          if (!oldest.done) warnedSessions.delete(oldest.value)
        }
        console.error('[auto-compact] 宿主未提供分段压缩能力，跳过本次检查')
      }

      return
    }

    // 占用与预算都取自这一次测量：上下文投影里的推算是本轮请求前的旧值，
    // 压缩后它仍停留在压缩前，照着它判断会立刻再压一次并把预算算得过小。
    const cached = measureFor(meter, agent, false)
    if ((cached.measurement.totalTokens / contextWindow) * 100 < settings.thresholdPercent) return

    // 达到阈值才付全量测量的成本：缓存结果可能已落后于当前表面，
    // 用它去选压缩范围会因节点数不一致而失败
    const { measurement } = cached.fresh ? cached : measureFor(meter, agent, true)
    if ((measurement.totalTokens / contextWindow) * 100 < settings.thresholdPercent) return

    compacting.add(session.id)
    attemptedAt.set(session.id, Date.now())
    evictOldest(attemptedAt)

    try {
      const decision = await compactOlderHistory(
        engine,
        measurement,
        agent,
        signal,
        contextWindow,
        settings.retainPercent,
        readToolsTokens(agent),
      )
      if (decision.kind === 'skipped') {
        console.error('[auto-compact] 自动压缩已跳过:', decision.reason)
      } else if (decision.note !== undefined) {
        console.error('[auto-compact] 自动压缩完成:', decision.note)
      }
    } catch (error) {
      console.error('[auto-compact] 自动压缩失败:', error)
    } finally {
      compacting.delete(session.id)
      // 压缩会改写表面，旧测量立即失效
      measurements.delete(session.id)
    }
  }

  const dispose = ctx.on('agent/pre-step', async ({ agent, signal }: AgentPreStepEvent, next) => {
    // 这是 waterfall 事件：监听器必须保证 next() 被执行，否则当轮模型请求会被卡住。
    // 因此检查里的任何异常都在这里兜住，只记日志。
    try {
      if (!signal.aborted) await check(agent, signal)
    } catch (error) {
      console.error('[auto-compact] 每步检查失败:', error)
    }

    return next()
  })

  return () => {
    dispose()
    compacting.clear()
    attemptedAt.clear()
    warnedSessions.clear()
    measurements.clear()
    windows.clear()
  }
}
