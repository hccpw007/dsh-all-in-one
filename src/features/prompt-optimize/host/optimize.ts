/**
 * 提示词优化的一次模型调用。
 *
 * 与宿主内置的辅助请求（例如会话标题）同一套路：按会话当前选定的模型准备调用、
 * 只取最低推理档位、限制输出长度、设端到端超时，然后把流拼成整段文本。
 * 走宿主 LLM 服务而不是自带 HTTP 客户端，模型凭据、重试与计量都由宿主统一处理。
 */
import type {
  AgentDefaultModelApi,
  ConfigureCallLike,
  HostPluginContext,
  LlmApi,
  LlmModelInfoLike,
  LlmStreamChunkLike,
  SessionProjectionsApi,
  SessionStoreApi,
} from '../../../types/host'
import { MAX_OUTPUT_CHARS } from '../types'
import { optimizeSystemPrompt } from './prompt'

/** 单次优化的端到端超时；关闭思考后通常一两秒返回，超时说明上游异常。 */
const TIMEOUT_MS = 30000

/** 输出 token 上限：改写输出本就短，给足余量只为防止模型 runaway。 */
const MAX_OUTPUT_TOKENS = 4096

/** 本次请求的用途标记，宿主据此把辅助请求与对话请求区分开。 */
const PURPOSE = 'prompt-optimize'

/** 一次优化请求的输入。 */
export interface OptimizeRequest {
  /** 用户在输入框里写的原文。 */
  readonly text: string
  /** 会话标识；新会话尚未创建时缺省，此时用默认模型。 */
  readonly sessionId?: string
}

/** 优化结果。 */
export type OptimizeOutcome =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly message: string }

/** 解析出的模型路由。 */
interface Route {
  provider: string
  model: string
  reasoningEffort?: string
}

/**
 * 按名称读取一个可选服务。
 *
 * 这些服务不进入插件级 inject：壳子会把各 feature 的 inject 合并成整个插件的
 * 硬依赖，把可选能力写进去会让插件在缺少它的 profile 里整体不装配。宿主的
 * `get` 在服务不可见时返回 undefined，正好用于这种「有就用、没有就降级」的场景。
 * @param ctx 宿主插件上下文
 * @param name 服务名
 * @returns 服务实例；不可用时返回 undefined
 */
function serviceOf<T>(ctx: HostPluginContext, name: string): T | undefined {
  try {
    const service = ctx.get(name)

    return typeof service === 'object' && service !== null ? service as T : undefined
  } catch (error) {
    console.error(`[prompt-optimize] 读取服务 ${name} 失败:`, error)

    return undefined
  }
}

/**
 * 读出会话当前选定的模型。
 *
 * 投影里的 `next` 是「用户选了下一次要用、但还没真正发过请求」的选择，因此它比
 * `lastUsed` 更贴近用户此刻的意图：刚切换模型就点优化，用新模型才符合预期。
 * @param ctx 宿主插件上下文
 * @param sessionId 会话标识
 * @returns 会话选定的路由；没有会话或读不到选择时返回 undefined
 */
function routeOfSession(ctx: HostPluginContext, sessionId: string): Route | undefined {
  const sessions = serviceOf<SessionStoreApi>(ctx, 'sessions')
  const projections = serviceOf<SessionProjectionsApi>(ctx, 'sessionProjections')
  if (sessions === undefined || projections === undefined) return undefined

  const session = sessions.get(sessionId)
  if (session === undefined) return undefined

  try {
    const snapshot = projections.snapshot(session, ['modelSelection'])

    return readSelection(snapshot.values.modelSelection)
  } catch (error) {
    // 投影读失败不该阻断优化：下面还有默认模型可以回退
    console.error('[prompt-optimize] 读取会话模型选择失败:', error)

    return undefined
  }
}

/**
 * 把投影值收窄成模型路由。
 * @param value 投影里的 `modelSelection` 值
 * @returns 下一次请求将使用的路由；字段不全时返回 undefined
 */
function readSelection(value: unknown): Route | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const viewed = value as { lastUsed?: unknown; next?: unknown }
  const selection = readRoute(viewed.next) ?? readRoute(viewed.lastUsed)

  return selection
}

/**
 * 收窄一个选择对象。
 * @param value 候选值
 * @returns 合法路由；provider 或 model 缺失时返回 undefined
 */
function readRoute(value: unknown): Route | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { provider?: unknown; model?: unknown; reasoningEffort?: unknown }
  if (typeof candidate.provider !== 'string' || candidate.provider === '') return undefined
  if (typeof candidate.model !== 'string' || candidate.model === '') return undefined

  const effort = typeof candidate.reasoningEffort === 'string' && candidate.reasoningEffort !== ''
    ? candidate.reasoningEffort
    : undefined

  return { provider: candidate.provider, model: candidate.model, reasoningEffort: effort }
}

/**
 * 解析本次请求使用的模型路由。
 *
 * 优先会话选择，其次宿主默认模型：新会话还没有任何模型记录，此时默认模型是唯一
 * 可用的答案。
 * @param ctx 宿主插件上下文
 * @param sessionId 会话标识
 * @returns 可用的路由；宿主没有装配任何模型服务时返回 undefined
 */
function resolveRoute(ctx: HostPluginContext, sessionId: string | undefined): Route | undefined {
  if (sessionId !== undefined) {
    const selected = routeOfSession(ctx, sessionId)
    if (selected !== undefined) return selected
  }

  const fallback = serviceOf<AgentDefaultModelApi>(ctx, 'agentDefaultModel')
  if (fallback === undefined) return undefined

  try {
    const selection = fallback.currentSelection()

    return { provider: selection.provider, model: selection.model, reasoningEffort: selection.reasoningEffort }
  } catch (error) {
    console.error('[prompt-optimize] 读取默认模型失败:', error)

    return undefined
  }
}

/** 关闭思考的档位 id；宿主声明的基础档位里 `off` 即此项。 */
const OFF_EFFORT = 'off'

/**
 * 显式要求「尽量少思考」的档位 id。
 *
 * 某些渠道（pi-ai 路径）把 `off` 翻译成「不发送 reasoning 参数」，模型于是走自己的
 * 默认档继续思考——实测传了 `off` 仍收到推理块，响应要 3~10 秒。`minimal` 与之不同：
 * 它是真实下发的低档位，能真正压住思考。所以这里优先 `minimal`，再退 `off`。
 */
const MINIMAL_EFFORT = 'minimal'

/**
 * 选一个最不费思考的推理档位。
 *
 * 优先 `minimal`（真实下发、能压住思考），其次 `off`（不思考即省略参数，但上游可能
 * 仍按默认档思考），最后退回模型自己最低的一档。宿主会校验档位必须在该模型声明的
 * efforts 里，所以只能用模型声明过的 id。
 * @param model 模型元数据
 * @returns 档位 id；模型不提供推理档位时返回 undefined
 */
function quietEffort(model: Readonly<LlmModelInfoLike>): string | undefined {
  const efforts = model.reasoning?.efforts
  if (efforts === undefined) return undefined

  // 按偏好顺序显式查找：各适配器声明顺序不一致，不能靠下标
  for (const preferred of [MINIMAL_EFFORT, OFF_EFFORT]) {
    const match = efforts.find((effort) => effort.id === preferred)
    if (match !== undefined) return match.id
  }

  return efforts[0]?.id
}

/**
 * 在解析出的模型元数据上选择控制项。
 *
 * 推理档位取「不思考」：本功能只是把一句话补成几条要求，思考只会拖慢返回；
 * 输出上限固定，避免模型被推理 token 挤占正文预算。
 * @param controls 宿主给出的初始控制项
 * @param model 模型元数据
 * @returns 收窄后的控制项
 */
const configure: ConfigureCallLike = (controls, model) => {
  const effort = quietEffort(model)

  return {
    ...controls,
    maxTokens: MAX_OUTPUT_TOKENS,
    ...effort === undefined ? {} : { reasoningEffort: effort },
  }
}

/**
 * 从流里收集最终的文本。
 *
 * 只保留正文块：推理块是模型的草稿，不属于可回写的需求文本。块被 `block-end`
 * 收尾后以完整块为准，避免增量与终值重复累加。
 * @param chunks 流式分块，逐个喂入
 * @returns 拼好的正文
 */
async function collectText(chunks: AsyncIterable<LlmStreamChunkLike>): Promise<string> {
  /** 已收尾的正文块，按 index 存放，最终按出现顺序拼接。 */
  const closed = new Map<number, string>()
  /** 尚未收尾的增量，block-end 缺失时用它兜底。 */
  const open = new Map<number, string>()
  /** 正文块的 index，保持出现顺序。 */
  const order: number[] = []
  let failure: string | undefined

  for await (const chunk of chunks) {
    switch (chunk.type) {
      case 'block-start': {
        // 只登记正文块：推理块与工具块不参与回写
        if (chunk.blockType === 'text' && chunk.index !== undefined && !order.includes(chunk.index)) {
          order.push(chunk.index)
        }
        break
      }
      case 'text-delta': {
        if (chunk.index === undefined || typeof chunk.text !== 'string') break
        const previous = open.get(chunk.index) ?? ''
        open.set(chunk.index, previous + chunk.text)
        if (!order.includes(chunk.index)) order.push(chunk.index)
        break
      }
      case 'block-end': {
        if (chunk.index === undefined || chunk.block?.type !== 'text') break
        closed.set(chunk.index, chunk.block.text ?? '')
        open.delete(chunk.index)
        if (!order.includes(chunk.index)) order.push(chunk.index)
        break
      }
      case 'finish': {
        const kind = chunk.reason?.kind
        // 超长被截断仍然可用（正文是完整的半截需求）；中止与出错则没有可用结果
        if (kind === 'aborted' || kind === 'error') {
          failure = chunk.reason?.failure?.message ?? kind
        }
        break
      }
      default:
        break
    }
  }

  if (failure !== undefined) throw new Error(failure)

  return order
    .map((index) => closed.get(index) ?? open.get(index) ?? '')
    .join('')
    .trim()
}

/**
 * 处理一次提示词优化。
 * @param ctx 宿主插件上下文
 * @param request 待优化的原文与会话标识
 * @returns 优化后的文本或可直接展示的失败原因
 */
export async function optimizePrompt(
  ctx: HostPluginContext,
  request: OptimizeRequest,
): Promise<OptimizeOutcome> {
  const llm = serviceOf<LlmApi>(ctx, 'llm')
  if (llm === undefined) return { ok: false, message: '宿主未提供模型服务' }

  const route = resolveRoute(ctx, request.sessionId)
  if (route === undefined) return { ok: false, message: '没有可用的模型，请先在输入框中选择模型' }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const call = await llm.prepareCall({ ...route, maxTokens: MAX_OUTPUT_TOKENS }, controller.signal, configure)

    // 派发时的配置必须与解析结果完全一致，否则宿主会直接拒绝这次请求
    const text = await collectText(call.stream({
      ...call.config,
      messages: [{ role: 'user', content: [{ type: 'text', text: request.text }] }],
      system: optimizeSystemPrompt(),
      signal: controller.signal,
      ...request.sessionId === undefined ? {} : { sessionId: request.sessionId },
      // 用途标记让宿主的日志与计费能把这笔消耗与对话请求分开
      purpose: PURPOSE,
    }))

    if (text === '') return { ok: false, message: '模型没有返回内容，请重试' }
    if (text.length > MAX_OUTPUT_CHARS) return { ok: false, message: '优化结果异常偏长，请重试' }

    return { ok: true, text }
  } catch (error) {
    // 超时会被 AbortController 转成中止错误，单独给一句可读提示
    if (controller.signal.aborted) {
      console.error('[prompt-optimize] 优化请求超时:', error)

      return { ok: false, message: `优化超时（${Math.round(TIMEOUT_MS / 1000)} 秒），请重试` }
    }

    console.error('[prompt-optimize] 优化请求失败:', error)

    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timer)
  }
}
