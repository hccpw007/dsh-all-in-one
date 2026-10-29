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
  HostPluginContext,
  SessionEventLike,
  SessionLike,
} from '../../../types/host'

/** 一个表面节点的计价结果。 */
interface PricedNode {
  seq: number
  tokens: number
}

/** 一次压缩决策：选中了哪段历史，以及不压缩时的原因。 */
export type CompactionDecision =
  | { kind: 'compacted' }
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
 * 把较早的历史压缩成摘要，保留最近约 `retainPercent` 的上下文。
 * @param ctx 宿主插件上下文
 * @param agent 会话所属 Agent
 * @param signal 本轮取消信号
 * @param contextWindow 当前模型的上下文窗口容量
 * @param retainPercent 压缩后要保留的窗口百分比
 * @returns 压缩结果，或跳过原因
 */
export async function compactOlderHistory(
  ctx: HostPluginContext,
  agent: AgentLike,
  signal: AbortSignal,
  contextWindow: number,
  retainPercent: number,
): Promise<CompactionDecision> {
  const engine = ctx.compaction
  const meter = ctx.tokenMeter
  if (engine?.compactRegion === undefined || meter === undefined) {
    return { kind: 'skipped', reason: '宿主未提供分段压缩能力' }
  }

  const session = agent.session
  const measurement = meter.measure(session)
  const retainTokens = Math.floor((contextWindow * retainPercent) / 100)
  const range = selectRange(session, measurement.nodes, retainTokens)
  if (range === null) return { kind: 'skipped', reason: '没有可安全压缩的历史' }

  await engine.compactRegion(range.start, range.end, agent, signal)

  return { kind: 'compacted' }
}
