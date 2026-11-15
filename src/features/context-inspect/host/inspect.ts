/**
 * 「上下文详情」的读取实现：从会话事件日志里取出当前发给模型的三份内容。
 *
 * 宿主把系统提示词物化成表面首位的 `system/message` 事件，把每次请求的完整工具集
 * 写进 `request/header` 事件的 header，其余消息按 `surfaceOp` 追加或替换进表面。
 * 三者都是追加日志，因此：
 *   - 系统提示词取最后一条非空 `system/message`：规范化重写会清空更早的节点，
 *     最后一条非空就是模型当前看到的渲染结果；
 *   - 工具定义取最后一条 `request/header` 的 `header.tools`：它是完整快照而非增量
 *     （增量只体现在 developer/message 的 tool-addition / tool-removal 里）；
 *   - 对话消息按表面折叠后的顺序给出：压缩产生的 `replace` 会把旧节点换成摘要，
 *     折叠后剩下的才是模型当前可见的那一份。
 *
 * 读取成本只在日志变化时发生：先用 `stat` 的 revision 比对，未变化直接复用上次
 * 结果，窗口的自动刷新因此几乎是零开销；同一会话的并发读取合并成一次。
 */
import type {
  SessionPersistenceApi,
  SessionPersistenceHandleLike,
} from '../../../types/host'
import type {
  ContextInspectPayload,
  InspectMessage,
  InspectMessageRole,
  InspectToolSchema,
} from '../types'

/** 缓存条目上限：会话很多时只保留最近读过的这些，避免按会话数无界增长。 */
const CACHE_LIMIT = 16

/** 单条消息保留的最大字符数：工具结果可能极长，超出部分对判断上下文构成没有帮助。 */
const MAX_MESSAGE_CHARS = 8000

/** 对话消息的总字符预算：长会话全量回传会让每两秒一次的校验变得很重。 */
const MAX_TOTAL_CHARS = 300_000

/** 对话消息的条数上限：与字符预算一起限制，二者先到者生效。 */
const MAX_MESSAGES = 300

/** 工具调用参数在正文里的展示长度上限。 */
const MAX_TOOL_ARGS_CHARS = 300

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

/** 表面替换操作：用当前节点替换 `startSeq` 到 `endSeq` 之间的节点。 */
interface SurfaceReplaceOp {
  op: 'replace'
  startSeq: number
  endSeq: number
}

/** 事件日志里本功能关心的最小形状。 */
interface InspectEventLike {
  type?: unknown
  seq?: unknown
  surfaceOp?: unknown
  data?: {
    message?: { content?: InspectBlockLike[] }
    header?: { tools?: unknown }
  }
}

/** 消息内容块里本功能用到的字段。 */
interface InspectBlockLike {
  type?: unknown
  text?: unknown
  name?: unknown
  arguments?: unknown
  toolName?: unknown
}

/**
 * 把一条事件的文本块拼成正文。
 * @param event 待读事件
 * @returns 拼接后的文本；没有文本块时返回空串
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
 * 判断事件是否落在模型可见表面上，并带合法的替换操作。
 * @param value 表面操作字段
 * @returns 是 `replace` 时返回该操作，否则返回 undefined
 */
function replaceOpOf(value: unknown): SurfaceReplaceOp | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { op?: unknown; startSeq?: unknown; endSeq?: unknown }
  if (candidate.op !== 'replace') return undefined
  if (typeof candidate.startSeq !== 'number' || typeof candidate.endSeq !== 'number') return undefined

  return { op: 'replace', startSeq: candidate.startSeq, endSeq: candidate.endSeq }
}

/**
 * 把一条事件的可读文本折成一段正文。
 *
 * 正文、工具调用、工具声明与附件都折进同一段，用户看的是「这条消息在对话里
 * 说了什么」；思考块不进正文，它不是模型可见的对话内容。
 * @param blocks 消息内容块
 * @returns 折好的正文；没有可展示内容时返回空串
 */
function foldBlocks(blocks: readonly InspectBlockLike[]): string {
  const parts: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'text':
        if (typeof block.text === 'string' && block.text !== '') parts.push(block.text)
        break
      case 'tool-call': {
        const name = typeof block.name === 'string' ? block.name : '未知工具'
        const args = typeof block.arguments === 'string' ? block.arguments : ''
        const shown = args.length > MAX_TOOL_ARGS_CHARS ? `${args.slice(0, MAX_TOOL_ARGS_CHARS)}…` : args
        parts.push(`→ ${name}${shown === '' ? '' : `(${shown})`}`)
        break
      }
      case 'tool-addition':
        if (typeof block.toolName === 'string') parts.push(`+ 工具 ${block.toolName}`)
        break
      case 'tool-removal':
        if (typeof block.toolName === 'string') parts.push(`- 工具 ${block.toolName}`)
        break
      case 'image':
        parts.push('[图片]')
        break
      case 'file':
        parts.push('[文件]')
        break
      default:
        break
    }
  }

  return parts.join('\n')
}

/**
 * 事件类型到消息角色的映射；系统提示词与其它事件不进入对话消息列表。
 * @param type 事件类型
 * @returns 对应的角色；不是对话消息时返回 undefined
 */
function roleOf(type: unknown): InspectMessageRole | undefined {
  switch (type) {
    case 'user/message':
      return 'user'
    case 'assistant/message':
      return 'assistant'
    case 'tool/result':
      return 'tool'
    case 'developer/message':
      return 'developer'
    default:
      return undefined
  }
}

/**
 * 把一条表面事件折成可展示的对话消息。
 * @param event 表面事件
 * @returns 消息；不是对话消息或没有可展示内容时返回 null
 */
function messageOf(event: InspectEventLike): InspectMessage | null {
  const role = roleOf(event.type)
  if (role === undefined) return null
  if (typeof event.seq !== 'number') return null

  const blocks = event.data?.message?.content
  const text = Array.isArray(blocks) ? foldBlocks(blocks) : ''
  if (text.trim() === '') return null

  return {
    seq: event.seq,
    role,
    // 超长单条截断：保留开头，尾部标记说明已截断
    text: text.length > MAX_MESSAGE_CHARS ? `${text.slice(0, MAX_MESSAGE_CHARS)}\n…（已截断）` : text,
  }
}

/**
 * 按宿主的表面语义折叠事件日志。
 *
 * `append` 落到表面尾部；`replace` 用当前节点替换它指向的区间（压缩就是这样把
 * 较早的历史换成摘要的）。区间端点不在当前表面上时说明日志与本次折叠不一致，
 * 跳过该次替换而不是抛出：这只是只读展示，宁可少一条也不让窗口报错。
 * @param events 会话事件日志
 * @returns 模型可见表面上的事件，顺序与表面一致
 */
function foldSurface(events: readonly unknown[]): InspectEventLike[] {
  const surface: InspectEventLike[] = []

  for (const value of events) {
    const event = value as InspectEventLike
    if (typeof event !== 'object' || event === null) continue

    const op = event.surfaceOp
    if (op === undefined) continue

    // 追加：直接落到表面尾部
    if (op === 'append') {
      surface.push(event)
      continue
    }

    // 替换：用当前节点盖住它指向的区间
    const replace = replaceOpOf(op)
    if (replace === undefined) continue

    const from = surface.findIndex((node) => node.seq === replace.startSeq)
    const to = surface.findIndex((node) => node.seq === replace.endSeq)
    if (from === -1 || to === -1 || to < from) continue

    surface.splice(from, to - from + 1, event)
  }

  return surface
}

/**
 * 按字符与条数预算裁出最近的一段对话消息。
 * @param surface 折叠后的表面事件
 * @returns 时间顺序的消息、实际总条数与是否被截断
 */
function collectMessages(surface: readonly InspectEventLike[]): {
  messages: InspectMessage[]
  total: number
  truncated: boolean
} {
  const all: InspectMessage[] = []

  // 先按表面顺序收集，保证角色与内容与模型看到的一致
  for (const event of surface) {
    const message = messageOf(event)
    if (message !== null) all.push(message)
  }

  // 从最新往回取，直到条数或字符预算用完；用户最关心的是最近的对话
  const kept: InspectMessage[] = []
  let chars = 0
  for (let index = all.length - 1; index >= 0; index -= 1) {
    const message = all[index]
    if (kept.length >= MAX_MESSAGES) break
    if (kept.length > 0 && chars + message.text.length > MAX_TOTAL_CHARS) break

    kept.push(message)
    chars += message.text.length
  }

  kept.reverse()

  return { messages: kept, total: all.length, truncated: kept.length < all.length }
}

/**
 * 从事件日志里提取系统提示词、工具定义与对话消息。
 *
 * 系统提示词与工具定义只做一次反向遍历：最后一条非空系统消息与最后一条请求头
 * 分别在首次命中时固定，两者都找到即可提前结束；对话消息单独走一次表面折叠。
 * @param events 会话事件日志，顺序与日志一致
 * @returns 三份内容
 */
function extractInspect(events: readonly unknown[]): {
  system: string
  tools: InspectToolSchema[]
  messages: InspectMessage[]
  messagesTotal: number
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

    // 工具定义：请求头里的 tools 是完整快照。字段缺失或不是数组都表示本次请求
    // 不带工具；一旦命中请求头就定稿，继续往前找会拿到更早一次请求的工具集
    if (tools === undefined && event.type === 'request/header') {
      const declared = event.data?.header?.tools
      tools = Array.isArray(declared) ? declared.filter(isToolSchema) : []
    }

    if (system !== undefined && tools !== undefined) break
  }

  const collected = collectMessages(foldSurface(events))

  return {
    system: system ?? '',
    tools: tools ?? [],
    messages: collected.messages,
    messagesTotal: collected.total,
  }
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
 * 把宿主的变化令牌转成可比较的键。
 *
 * 令牌在类型上是不透明的 `unknown`；直接用 `String()` 转换会让对象退化成
 * `'[object Object]'`，所有会话共用一个键，缓存将永远命中、详情不再更新。
 * @param revision 宿主返回的变化令牌
 * @returns 可用于相等比较的字符串键
 */
function revisionKey(revision: unknown): string {
  if (revision === null || revision === undefined) return ''
  if (typeof revision !== 'object') return String(revision)

  try {
    return JSON.stringify(revision) ?? ''
  } catch (error) { // 令牌不该含循环引用；真出现时退回固定标记，不阻断详情读取
    console.error('[context-inspect] 变化令牌无法序列化:', error)

    return '[unserializable]'
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

    const revision = revisionKey(snapshot.revision)
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
      messages: extracted.messages,
      messagesTotal: extracted.messagesTotal,
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
