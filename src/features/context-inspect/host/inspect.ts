/**
 * 「上下文详情」的读取实现：从会话事件日志里取出当前发给模型的两份内容。
 *
 * 宿主把系统提示词物化成表面首位的 `system/message` 事件，把每次请求的完整工具集
 * 写进 `request/header` 事件的 header。两者都是追加日志，因此：
 *   - 系统提示词取最后一条非空 `system/message`：规范化重写会清空更早的节点，
 *     最后一条非空就是模型当前看到的渲染结果；
 *   - 工具定义取最后一条 `request/header` 的 `header.tools`：它是完整快照而非增量
 *     （增量只体现在 developer/message 的 tool-addition / tool-removal 里）。
 *
 * 读取成本只在日志变化时发生：先用 `stat` 的 revision 比对，未变化直接复用上次
 * 结果，窗口的自动刷新因此几乎是零开销；同一会话的并发读取合并成一次。
 */
import type {
  SessionPersistenceApi,
  SessionPersistenceHandleLike,
} from '../../../types/host'
import type { ContextInspectPayload, InspectToolSchema } from '../types'

/** 缓存条目上限：会话很多时只保留最近读过的这些，避免按会话数无界增长。 */
const CACHE_LIMIT = 16

/** 一个会话的读取缓存：revision 相同即视为日志未变。 */
interface CacheEntry {
  /** 上次读取时的变化令牌。 */
  revision: string
  /** 上次读取的结果。 */
  payload: ContextInspectPayload
}

/** 会话 id → 最近一次读取结果；Map 保持插入顺序，用于淘汰最旧条目。 */
const cache = new Map<string, CacheEntry>()

/** 会话 id → 进行中的读取；并发请求共用同一个 Promise。 */
const inflight = new Map<string, Promise<ContextInspectPayload | null>>()

/** 事件日志里本功能关心的最小形状。 */
interface InspectEventLike {
  type?: unknown
  data?: {
    message?: { content?: Array<{ type?: unknown; text?: unknown }> }
    header?: { tools?: unknown }
  }
}

/**
 * 把一条 `system/message` 事件的文本块拼成正文。
 * @param event 待读事件
 * @returns 拼接后的文本；不是系统消息或没有文本块时返回空串
 */
function systemTextOf(event: InspectEventLike): string {
  const blocks = event.data?.message?.content
  if (!Array.isArray(blocks)) return ''

  return blocks
    .filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text as string)
    .join('')
}

/**
 * 判断值是否为可展示的工具定义。
 * @param value 请求头里的一个工具项
 * @returns 形状合法时返回 true
 */
function isToolSchema(value: unknown): value is InspectToolSchema {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as { name?: unknown; description?: unknown; parameters?: unknown }

  return typeof candidate.name === 'string'
    && typeof candidate.parameters === 'object'
    && candidate.parameters !== null
}

/**
 * 从事件日志里提取系统提示词与工具定义。
 *
 * 只做一次反向遍历：最后一条非空系统消息与最后一条请求头分别在首次命中时固定，
 * 两者都找到即可提前结束。
 * @param events 会话事件日志，顺序与日志一致
 * @returns 提取结果；两项都缺失时返回空正文与空数组
 */
function extractInspect(events: readonly unknown[]): {
  system: string
  tools: InspectToolSchema[]
} {
  let system: string | undefined
  let tools: InspectToolSchema[] | undefined

  // 反向遍历：越靠后的日志越接近当前请求
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index] as InspectEventLike | undefined
    if (typeof event !== 'object' || event === null) continue

    // 系统提示词：跳过被规范化清空的旧节点，取最后一条有正文的
    if (system === undefined && event.type === 'system/message') {
      const text = systemTextOf(event)
      if (text.trim() !== '') system = text
    }

    // 工具定义：请求头里的 tools 是完整快照，没有该字段表示本次请求不带工具
    if (tools === undefined && event.type === 'request/header') {
      const declared = event.data?.header?.tools
      if (Array.isArray(declared)) tools = declared.filter(isToolSchema)
    }

    if (system !== undefined && tools !== undefined) break
  }

  return { system: system ?? '', tools: tools ?? [] }
}

/**
 * 把读取结果写进缓存，并在超出上限时淘汰最旧的一条。
 * @param sessionId 会话标识
 * @param entry 本次读取的令牌与结果
 */
function remember(sessionId: string, entry: CacheEntry): void {
  cache.delete(sessionId)
  cache.set(sessionId, entry)

  // 超出上限时删最早插入的一条；Map 的键顺序即插入顺序
  while (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value
    if (oldest === undefined) break

    cache.delete(oldest)
  }
}

/**
 * 打开只读句柄读取整份日志。
 * @param persistence 会话持久化服务
 * @param sessionId 会话标识
 * @returns 日志事件数组
 */
async function readEvents(
  persistence: SessionPersistenceApi,
  sessionId: string,
): Promise<readonly unknown[]> {
  let handle: SessionPersistenceHandleLike | undefined

  try {
    handle = await persistence.open(sessionId, 'read')
    const result = await handle.read()

    return result.events
  } finally {
    // 句柄必须在读完后释放，否则每次打开都会留下一个只读通道
    if (handle !== undefined) {
      try {
        await handle.close()
      } catch (error) {
        console.error('[context-inspect] 关闭会话读取句柄失败:', sessionId, error)
      }
    }
  }
}

/**
 * 读取一条会话的上下文详情。
 *
 * 会话不存在时返回 null；其余错误向上抛出，由路由转成 500 并记录日志。
 * @param persistence 会话持久化服务
 * @param sessionId 已校验的会话标识
 * @returns 详情负载；会话不存在时为 null
 */
export async function readContextInspect(
  persistence: SessionPersistenceApi,
  sessionId: string,
): Promise<ContextInspectPayload | null> {
  const pending = inflight.get(sessionId)
  if (pending !== undefined) return pending

  const task = (async (): Promise<ContextInspectPayload | null> => {
    const snapshot = await persistence.stat(sessionId)
    if (snapshot === undefined) return null

    const revision = String(snapshot.revision)
    const cached = cache.get(sessionId)
    // 令牌相同即日志未变，直接复用上次结果，不必再解压读取；
    // 读取时间换成此刻，窗口据此显示「这次校验仍然是最新内容」
    if (cached !== undefined && cached.revision === revision) {
      return { ...cached.payload, readAt: Date.now() }
    }

    const events = await readEvents(persistence, sessionId)
    const extracted = extractInspect(events)
    const payload: ContextInspectPayload = {
      session: sessionId,
      readAt: Date.now(),
      system: extracted.system,
      tools: extracted.tools,
    }

    remember(sessionId, { revision, payload })

    return payload
  })()

  inflight.set(sessionId, task)

  try {
    return await task
  } finally {
    inflight.delete(sessionId)
  }
}
