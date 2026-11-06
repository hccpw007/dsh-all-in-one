/**
 * 「自动压缩会话」的压缩范围选择。
 *
 * 目标是「保留最近、压掉更早」：从表面尾部往前累计 token，凑够保留预算后的
 * 那个位置就是切点，比它更早的历史交给宿主压成摘要。这样每次触发只吃掉最早
 * 的一段，最近几轮对话始终逐字留在上下文里。
 *
 * 两个硬约束来自宿主的压缩事务：
 *   1. 表面第一个节点若是系统提示词，不能进入压缩范围；
 *   2. 切点必须落在工具调用与结果之间之外，否则会拆散一次调用的配对。
 */

import type {
  AgentLike,
  CompactionApi,
  SessionEventLike,
  SessionLike,
  TokenMeterMeasurement,
} from '../../../types/host'

/**
 * 目标不可达时仍为最近历史保留的窗口份额。
 *
 * 工具定义这类开销不随压缩变化，保留目标低于它时再怎么压也到不了目标；此时
 * 仍给最近历史留一小段，避免把会话压成只剩摘要的空壳。
 */
const UNREACHABLE_FLOOR_SHARE = 0.01

/** 一个表面节点的计价结果。 */
interface PricedNode {
  seq: number
  tokens: number
}

/** 一次压缩决策：选中了哪段历史，以及需要告知调用方的补充信息。 */
export type CompactionDecision =
  | { kind: 'compacted'; note?: string }
  | { kind: 'skipped'; reason: string }

/**
 * 读一个表面事件对「未配对工具调用数」的影响。
 * @param event 表面节点事件
 * @returns 助手消息增加其工具调用数，工具结果减少 1，其余事件不影响
 */
function toolCallDelta(event: SessionEventLike): number {
  if (event.type === 'tool/result') return -1
  if (event.type !== 'assistant/message') return 0

  const content = event.data?.message?.content ?? []

  return content.filter((block) => block.type === 'tool-call').length
}

/**
 * 计算每个「切在节点之前」的位置是否已完成工具配对。
 * @param session 会话
 * @param nodes 表面节点序号
 * @returns 长度比 `nodes` 多 1 的布尔表，第 i 项表示在 `nodes[i]` 之前切开是否安全
 */
function balancedCuts(session: SessionLike, nodes: number[]): boolean[] {
  const cuts: boolean[] = [true]
  let open = 0

  for (const seq of nodes) {
    const event = session.eventAt(seq)
    open += event === undefined ? 0 : toolCallDelta(event)
    // 表面按定义不会出现无配对的结果事件；真出现时保守地视为不可切
    if (open < 0) open = 0
    cuts.push(open === 0)
  }

  return cuts
}

/**
 * 选出「最早、可安全切开、且能保留足够近期尾部」的一段表面历史。
 * @param session 会话
 * @param priced 逐表面节点的计价结果，顺序与表面一致
 * @param retainTokens 近期尾部要逐字保留的 token 预算
 * @returns 含首尾的节点序号区间；没有可压缩范围时返回 null
 */
function selectRange(
  session: SessionLike,
  priced: PricedNode[],
  retainTokens: number,
): { start: number; end: number } | null {
  const surfaceNodes = session.surface.nodes
  if (priced.length !== surfaceNodes.length) {
    throw new Error(
      `[auto-compact] 表面计价与当前表面不一致：${priced.length} 个节点对 ${surfaceNodes.length} 个表面节点`,
    )
  }
  if (surfaceNodes.length === 0) return null

  // 系统提示词固定在表面首位，压缩范围必须从它之后开始
  const head = session.eventAt(surfaceNodes[0])
  const firstIdx = head?.type === 'system/message' ? 1 : 0

  let accumulated = 0
  let keepFromIdx = priced.length
  for (let index = priced.length - 1; index >= 0; index -= 1) {
    accumulated += priced[index].tokens
    keepFromIdx = index
    if (accumulated >= retainTokens) break
  }

  if (keepFromIdx <= firstIdx) return null

  // 切点若落在一次工具调用中间，向前（更早）挪到最近的配对边界
  const cuts = balancedCuts(session, surfaceNodes)
  while (keepFromIdx > firstIdx && !cuts[keepFromIdx]) keepFromIdx -= 1
  if (keepFromIdx <= firstIdx) return null

  return { start: surfaceNodes[firstIdx], end: surfaceNodes[keepFromIdx - 1] }
}

/**
 * 估算表面真实 token 相对表面计价的比例。
 *
 * 宿主按固定字符启发式给表面计价，中文与 JSON 会系统性低估；用「真实总量 −
 * 工具定义」与表面计价相比得到换算比例。比例小于 1 时按 1 处理：表面估高时
 * 没有理由多压，宁可少压。
 * @param totalTokens 整份请求的真实占用
 * @param surfaceTokens 表面计价总量
 * @param toolsTokens 工具定义的启发式占用
 * @returns 真实占用相对计价的换算比例
 */
function surfaceScale(totalTokens: number, surfaceTokens: number, toolsTokens: number): number {
  if (surfaceTokens <= 0) return 1

  const realSurface = Math.max(0, totalTokens - toolsTokens)

  return Math.max(1, realSurface / surfaceTokens)
}

/**
 * 把较早的历史压缩成摘要，保留最近约 `retainPercent` 的上下文。
 *
 * 保留比例是「压缩后总占用的目标」：请求里工具定义这类固定开销不随压缩变化，
 * 先从目标里扣掉它，剩下的才是留给原文尾部的预算。预算按真实 token 计算，再用
 * `surfaceScale` 换算成选择范围时的表面计价：宿主的表面计价对中文系统性偏低，
 * 不换算会把「保留 10%」执行成实际保留 18%。
 *
 * 工具定义本身就超过保留目标时目标不可达：压到最小尾部并把原因带回调用方，
 * 而不是像过去那样把保留预算保底在目标的 75%，让压缩看起来没有效果。
 * @param engine 压缩服务
 * @param measurement 本次检查的表面计价（调用方已测量，压缩前后都用它判断）
 * @param agent 会话所属 Agent
 * @param signal 本轮取消信号
 * @param contextWindow 当前模型的上下文窗口容量
 * @param retainPercent 压缩后要保留的窗口百分比
 * @param toolsTokens 工具定义的启发式占用；投影缺失时为 undefined
 * @returns 压缩结果，或跳过原因
 */
export async function compactOlderHistory(
  engine: CompactionApi,
  measurement: TokenMeterMeasurement,
  agent: AgentLike,
  signal: AbortSignal,
  contextWindow: number,
  retainPercent: number,
  toolsTokens: number | undefined,
): Promise<CompactionDecision> {
  const session = agent.session
  const targetTokens = Math.floor((contextWindow * retainPercent) / 100)

  // 读不到工具定义时把整份差额当作固定开销：宁可少压，也不能把估算偏差当成
  // 可压缩预算而把历史压光
  const fixedTokens =
    toolsTokens ?? Math.max(0, measurement.totalTokens - measurement.surfaceTokens)
  const scale = surfaceScale(measurement.totalTokens, measurement.surfaceTokens, fixedTokens)
  const retainReal = targetTokens - fixedTokens

  // 固定开销高于保留目标：压到最小尾部，并说明设定值不可达
  const unreachable = retainReal <= 0
  const retainBudget = Math.max(
    1,
    Math.round((unreachable ? contextWindow * UNREACHABLE_FLOOR_SHARE : retainReal) / scale),
  )
  const range = selectRange(session, measurement.nodes, retainBudget)
  if (range === null) return { kind: 'skipped', reason: '没有可安全压缩的历史' }

  await engine.compactRegion?.(range.start, range.end, agent, signal)

  // 不可达时把原因带回调用方：日志里能看出压缩已到底，而不是配置没生效
  return unreachable
    ? { kind: 'compacted', note: `保留 ${retainPercent}% 低于不可压缩的工具定义开销，已压到最小尾部` }
    : { kind: 'compacted' }
}
