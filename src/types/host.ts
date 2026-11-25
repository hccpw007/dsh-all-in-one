/**
 * 宿主侧插件 API 的最小类型声明。
 *
 * 宿主只提供运行时代码，这里按本插件实际用到的能力声明，
 * 避免在业务代码里散落 `any`。
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

/** index.html 注入行；本插件只使用 head 里的内联脚本。 */
export interface IndexInjectRow {
  kind: 'script'
  placement: 'head'
  text: string
}

/** `webserver/index-inject` 的事件负载：按顺序写入 index.html 的行表。 */
export type IndexInjectTable = IndexInjectRow[]

/** 工具注册表的宿主侧投影：只声明本插件实际用到的能力。 */
export interface ToolsApi {
  /** 一个作用域可见的工具 schema（模型侧投影，不含执行函数）；省略作用域时读取全局层。 */
  schemas(scope?: unknown): { name: string; description?: string }[]
  /** 一个作用域可见的工具定义；省略作用域时按全局层解析。 */
  get(name: string, scope?: unknown): unknown
  /** 对当前作用域的继承工具施加允许/拒绝掩码，返回解除函数。 */
  restrict(filter: { allow?: string[]; deny?: string[] }): () => void
  /** 注册一个工具，返回注销函数；定义形状与宿主 `defineTool` 的产物一致。 */
  register?(definition: ToolDefinitionLike): () => void
}

/** 注册工具所需的最小定义形状；参数与输出均为 JSON Schema 子集。 */
export interface ToolDefinitionLike {
  name: string
  description: string
  parameters: Record<string, unknown>
  output: {
    schema: Record<string, unknown>
    render: (
      args: Record<string, unknown>,
      value: Record<string, unknown>,
    ) => Array<{ type: 'text'; text: string }>
  }
  execute: (
    args: Record<string, unknown>,
    exec: ToolExecLike,
  ) => Promise<Record<string, unknown>>
}

/** 工具执行上下文：只声明本插件用到的字段。 */
export interface ToolExecLike {
  /** 调用该工具的 Agent；记忆按 Agent 所属项目定位目录。 */
  agent?: unknown
}

/** 宿主侧插件上下文：只声明本插件实际依赖的能力。 */
export interface HostPluginContext {
  /** 注册随插件生命周期自动清理的副作用，回调返回清理函数。 */
  effect(effect: () => () => void, label?: string): void
  /** 订阅 index.html 注入事件，返回取消订阅函数。 */
  on(event: 'webserver/index-inject', listener: (table: IndexInjectTable) => void): () => void
  /**
   * 订阅每次向模型派发请求前的钩子；自动压缩在该时刻检查上下文占用。
   *
   * 这是 waterfall 事件：listener 必须在最后调用 `next()` 把流程交回宿主，
   * 在调用之前可以异步做自己的事（例如压缩），宿主会等它完成再发请求。
   */
  on(
    event: 'agent/pre-step',
    listener: (payload: AgentPreStepEvent, next: () => Promise<unknown>) => Promise<unknown>,
  ): () => void
  /**
   * 订阅询问应答的 waterfall 事件。
   *
   * 只有注册在 Agent 作用域（`agent.ctx`）上的监听器才会收到该 Agent 的请求：
   * 宿主派发时按 Agent 作用域过滤。listener 直接返回答案即短路用户交互，
   * 调用 `next()` 则交回宿主原有的界面回答流程。
   *
   * `prepend` 把监听器排到同事件的最前面：宿主的界面转发应答器在插件加载时就已注册，
   * 且它会一直等到用户点选才返回；不前置的话，后来的监听器根本没有机会短路它。
   */
  on(
    event: 'user-questions/request',
    listener: (
      request: UserQuestionRequestLike,
      next: () => Promise<unknown>,
    ) => Promise<unknown>,
    options?: { prepend?: boolean },
  ): () => void
  /**
   * 订阅 Agent 创建事件：Agent 作用域在此时已就绪，可以立刻注册该 Agent 的监听器。
   */
  on(
    event: 'agent/created',
    listener: (payload: AgentCreatedEvent) => unknown,
    options?: { prepend?: boolean },
  ): () => void
  /**
   * 订阅工具调用前的闸门 waterfall。
   *
   * listener 返回 `allow` 或调用 `next()` 放行，返回 `deny` 则按理由物化成模型
   * 看到的工具结果、且不执行工具本体；宿主的调度、超时与权限不受影响。
   */
  on(
    event: 'tools/pre-execute',
    listener: (exec: ToolPreExecuteEvent, next: () => Promise<unknown>) => Promise<unknown>,
  ): () => void
  /** 在依赖服务就绪后执行回调，回调拿到带对应服务的子上下文。 */
  inject(names: string[], callback: (ctx: HostPluginContext) => void): void
  /** 按名称读取服务；服务在当前作用域不可见时返回 undefined。 */
  get(name: string, strict?: boolean): unknown
  /** Agent 预设服务；插件声明依赖后可用。 */
  agentPresets?: AgentPresetApi
  /** Web 服务器服务；通过 inject 取得后可用。 */
  webServer?: WebServerApi
  /** 工具注册表；插件声明依赖后可用，用于枚举全局工具。 */
  tools?: ToolsApi
  /** 系统提示词服务；插件声明依赖后可用，用于注册段落与安装最外层包装。 */
  systemPrompt?: SystemPromptApi
  /** 压缩服务；声明依赖后可用，用于把较早的历史替换成摘要。 */
  compaction?: CompactionApi
  /** token 计价服务；声明依赖后可用，用于按表面节点测量占用。 */
  tokenMeter?: TokenMeterApi
  /** 会话投影服务；声明依赖后可用，用于读取上下文占用。 */
  sessionProjections?: SessionProjectionsApi
  /** 会话控制器；声明依赖后可用，用于停止正在执行的轮次。 */
  sessionController?: SessionControllerApi
  /** 启动本进程的 profile；缺失时相关功能回退为扫描全部 profile。 */
  profileContext?: ProfileContext
  /** 会话持久化服务；插件声明依赖后可用，用于按会话 id 只读事件日志。 */
  sessionPersistence?: SessionPersistenceApi
}

/** 会话存储：本功能只按 id 读在线会话。 */
export interface SessionStoreApi {
  /**
   * 取一条在线会话。
   * @param id 会话标识
   * @returns 会话不在线时返回 undefined
   */
  get(id: string): SessionLike | undefined
}

/** 默认模型服务：新会话尚未记录模型选择时的回退来源。 */
export interface AgentDefaultModelApi {
  /** @returns 当前默认的 provider、model 与可选推理档位。 */
  currentSelection(): {
    readonly provider: string
    readonly model: string
    readonly reasoningEffort?: string
  }
}

/** 一次模型调用的路由与控制项；与宿主的 `LlmCallConfig` 同形。 */
export interface LlmCallConfigLike {
  provider: string
  model: string
  reasoningEffort?: string
  temperature?: number
  maxTokens?: number
  stop?: string[]
}

/** 模型元数据中本功能用到的字段。 */
export interface LlmModelInfoLike {
  /** 可选推理档位；本功能取最低一档，避免为改写提示词付出额外思考成本。 */
  readonly reasoning?: {
    readonly efforts: ReadonlyArray<{ readonly id: string }>
    readonly defaultEffort?: string
  }
}

/**
 * 调用前的控制项选择函数。
 *
 * 宿主在解析出模型元数据后同步调用一次，返回的控制项会再经过默认值与校验，
 * 因此这里可以按模型能力收窄输出上限与推理档位。返回值只能携带控制项：
 * provider 与 model 由宿主在解析出的路由上补回。
 */
export type ConfigureCallLike = (
  controls: Readonly<{ reasoningEffort?: string; maxTokens?: number }>,
  model: Readonly<LlmModelInfoLike>,
) => { reasoningEffort?: string; maxTokens?: number }

/** 一次已解析的模型调用：配置固定，流只能派发一次。 */
export interface PreparedLlmCallLike {
  /** 补齐默认值并校验过的最终配置；派发时的请求必须与它一致。 */
  readonly config: LlmCallConfigLike
  /** 发起流式请求。 */
  stream(options: LlmGenerateOptionsLike): AsyncIterable<LlmStreamChunkLike>
}

/** 一次性模型请求的消息：本功能只发一条纯文本用户消息。 */
export interface LlmGenerateOptionsLike extends LlmCallConfigLike {
  messages: Array<{ role: 'user'; content: Array<{ type: 'text'; text: string }> }>
  /** 系统提示词；一次性调用由调用方自行提供。 */
  system?: string
  signal?: AbortSignal
  /** 计费与路由用的会话身份；没有在线会话时省略。 */
  sessionId?: string
  /** 辅助请求的用途标记，宿主据此把这类请求与对话请求区分开。 */
  purpose?: string
}

/** 流式分块中本功能读取的字段。 */
export interface LlmStreamChunkLike {
  type: string
  /** 块在响应里的序号；文本增量与块结束都用它对位。 */
  index?: number
  /** `text-delta` 的增量正文。 */
  text?: string
  /** `block-start` 声明的块类型。 */
  blockType?: string
  /** `block-end` 的完整块。 */
  block?: { type?: string; text?: string }
  /** `finish` 的终止原因。 */
  reason?: { kind?: string; failure?: { message?: string } }
}

/** LLM 服务：本功能只用到一次性调用的准备与派发。 */
export interface LlmApi {
  /**
   * 解析一次调用的最终配置。
   * @param config 路由与初始控制项
   * @param signal 取消信号
   * @param configure 按模型元数据选择控制项；可选
   * @returns 配置固定的调用句柄
   */
  prepareCall(
    config: LlmCallConfigLike,
    signal?: AbortSignal,
    configure?: ConfigureCallLike,
  ): Promise<PreparedLlmCallLike>
}

/**
 * 会话持久化服务：只声明本功能用到的只读能力。
 *
 * 宿主把每条会话保存成 append-only 事件日志，系统提示词与请求头（含完整工具
 * 定义）都在日志里；按会话 id 打开只读句柄即可读到当前内容，不必自己解析
 * 磁盘上的压缩格式，也不会与宿主争抢写所有权。
 */
export interface SessionPersistenceApi {
  /**
   * 打开一条已存会话。
   * @param id 会话标识，与前端会话列表里的 id 一致
   * @param access 访问模式；只读模式不取得写所有权
   */
  open(id: string, access: 'read' | 'write'): Promise<SessionPersistenceHandleLike>
  /**
   * 只观察会话元数据，不读事件日志；用它的 `revision` 判断日志是否变化。
   * @param id 会话标识
   * @returns 会话不存在时返回 undefined
   */
  stat(id: string): Promise<SessionPersistenceSnapshotLike | undefined>
}

/** 会话持久化句柄：只声明读取与释放。 */
export interface SessionPersistenceHandleLike {
  /** 读取一段连续事件；省略参数时读取整个日志。 */
  read(offset?: number, length?: number): Promise<{ events: readonly unknown[] }>
  /** 释放句柄；只读句柄不写盘，也不影响宿主继续追加。 */
  close(): Promise<void>
}

/** 会话元数据快照：本功能只用变化令牌。 */
export interface SessionPersistenceSnapshotLike {
  /** 不透明变化令牌：同一服务实例内相等即可视为日志未变。 */
  revision: unknown
}

/** `agent/pre-step` 事件负载：一轮里每次派发模型请求前发出。 */
export interface AgentPreStepEvent {
  agent: AgentLike
  /** 本轮取消信号；压缩过程也跟随它取消。 */
  signal: AbortSignal
}

/** `agent/created` 事件负载：Agent 与其作用域已就绪。 */
export interface AgentCreatedEvent {
  agent: AgentLike
  /** 会话级取消信号；Agent 结束时会触发。 */
  signal?: AbortSignal
}

/**
 * 工具调用前的闸门事件负载。
 *
 * 宿主还会给出调用标识、取消信号等字段；本插件只按工具名、参数与发起者决定放行。
 */
export interface ToolPreExecuteEvent {
  /** 模型请求的工具名。 */
  name: string
  /** 已解析的工具参数。 */
  arguments: unknown
  /** 发起调用的 Agent；系统调用或诊断场景可能缺省。 */
  agent?: unknown
}

/**
 * 询问请求中本插件用到的字段。
 *
 * 宿主还带 `agent`、`wait` 等字段，自动应答只在需要构造答案时读取问题本身，
 * 因此只声明这部分，其余保持未知。
 */
export interface UserQuestionRequestLike {
  questions: UserQuestionItemLike[]
}

/** 一道询问题：选项、多选标记与可选的表现意图。 */
export interface UserQuestionItemLike {
  /** 题目标识，答案必须原样带回。 */
  id: string
  /** 题面；自动应答不读取它。 */
  question: string
  /** 可选答案项，宿主约定首项为推荐项。 */
  options?: Array<{ label: string; description?: string }>
  /** 是否允许多选；自动应答只选一项。 */
  multiSelect?: boolean
  /**
   * 表现意图：计划审阅用 `approve` 声明批准标签，权限审批整类不自动作答。
   */
  intent?: {
    kind: string
    approve?: string
    reject?: string
    always?: string
  }
}

/** 询问答案：每道题恰好一项。 */
export interface UserQuestionAnswerLike {
  answers: Array<{
    /** 题目标识。 */
    id: string
    /** 选中的选项标签；没有选项时为空数组。 */
    selected: string[]
    /** 自由文本答复，仅在没有选项时使用。 */
    custom?: string
  }>
}

/** 在线 Agent 的最小形状：会话与 Agent 一一对应。 */
export interface AgentLike {
  session: SessionLike
  /**
   * Agent 自己的作用域。
   *
   * 压缩、计价与投影服务随 agent preset 挂载；预设会用 isolate 把它们隔离在
   * agent 作用域内，插件根作用域拿不到，只能在运行期从这里解析。
   */
  ctx?: HostPluginContext
}

/** 会话的最小形状：读投影、选择压缩范围都需要它。 */
export interface SessionLike {
  /** 会话标识，与 Agent 标识相同。 */
  id: string
  /**
   * 父会话标识：子 Agent 的会话由此指回委派它的会话。
   *
   * 可选——只有宿主版本提供时才存在。自动模式据此让子 Agent 继承父会话的开关，
   * 否则子 Agent 会以「未开启自动模式」的身份弹出提问，把整条委派链卡住。
   * 与 `header.origin` 配合使用：只有委派子会话才算继承关系，普通 fork 不算。
   */
  parentSession?: string
  /**
   * 会话头部：父会话标识在部分宿主版本里只出现在头部，上面字段读不到时回退到这里。
   *
   * `origin` 为 `'subagent'` 时才是委派出来的子会话；历史 fork 也可能保留
   * `parentSession`，缺了 `origin` 就不该继承开关。
   */
  header?: { parentSession?: unknown, origin?: unknown }
  /** 当前日志序号。 */
  seq: number
  /** 当前会话表面：参与模型请求的日志序号序列，索引即位置。 */
  surface: SessionSurfaceLike
  /** 按序号读取日志事件；序号越界时返回 undefined。 */
  eventAt(seq: number): SessionEventLike | undefined
}

/** 会话表面：`nodes` 的顺序就是模型看到的历史顺序。 */
export interface SessionSurfaceLike {
  nodes: number[]
}

/** 自动压缩只需要判读事件类型与助手消息里的工具调用块。 */
export interface SessionEventLike {
  type: string
  data?: {
    message?: {
      content?: Array<{ type?: string }>
    }
  }
}

/** 一次表面计价：总占用与逐节点估值。 */
export interface TokenMeterMeasurement {
  /** 整份请求的估算占用，含工具定义等不随压缩变化的部分。 */
  totalTokens: number
  /** 表面原文的计价总和，不含工具定义。 */
  surfaceTokens: number
  /** 逐表面节点的估值，顺序与 `session.surface.nodes` 一致。 */
  nodes: Array<{ seq: number; tokens: number }>
}

/** token 计价服务。 */
export interface TokenMeterApi {
  measure(session: SessionLike): TokenMeterMeasurement
}

/**
 * 压缩服务。
 *
 * 只有基础引擎（`dsh-compaction-basic`）实现了 `compactRegion`；换成其他
 * 后端时该能力缺失，自动压缩会跳过并记录原因。
 */
export interface CompactionApi {
  /**
   * 把一段表面区间替换成摘要。
   * @param start 区间首个表面节点序号（含）
   * @param end 区间末个表面节点序号（含）
   * @param agent 会话所属 Agent，摘要调用用它解析模型
   * @param signal 取消信号
   */
  compactRegion?(
    start: number,
    end: number,
    agent: AgentLike,
    signal?: AbortSignal,
  ): Promise<unknown>
}

/** 会话投影服务：按会话读取已注册的投影值。 */
export interface SessionProjectionsApi {
  snapshot(session: SessionLike, keys?: string[]): { values: Record<string, unknown> }
}

/** 宿主报告的 profile 信息。 */
export interface ProfileContext {
  /** profile 名，如 desktop、web。 */
  name?: string
  /** profile 目录的绝对路径。 */
  dir?: string
}

/** 宿主 Agent 预设定义，字段与 `@deepseek-ai/dsh-agent-preset` 的配置一致。 */
export interface AgentPresetDefinition {
  id: string
  name?: string
  description?: string
  order?: number
  /** 预设挂载的 cordis 组合行。 */
  plugins: Record<string, unknown>[]
}

/** Agent 预设注册服务。 */
export interface AgentPresetApi {
  /**
   * 注册并立即激活一个预设。
   * @returns 注销函数，随插件卸载或技能包更新时调用
   */
  register(definition: AgentPresetDefinition): Promise<() => Promise<void>>
  /**
   * 解析预设身份；会话创建与恢复时调用。
   *
   * 以下四个读取方法都是宿主版本敏感的可选项：宿主改签名时包装层会跳过它们。
   */
  resolve?(id?: string): Promise<{ id: string }>
  /** 取一个预设修订的临时作用域；读取冷会话的技能等能力时调用。 */
  acquireScope?(id?: string): Promise<unknown>
  /** 把尚未开始的会话切到指定预设。 */
  select?(agent: unknown, id: string): Promise<string>
  /** 为未发布的 Agent 绑定预设。 */
  mount?(ctx: unknown, id?: string): Promise<{ id: string }>
  /** 以带 `isDefault` 的结构读出预设名单；宿主对客户端的正式入口。 */
  remoteExportList?(): Promise<unknown>
  /** 读出预设名单的原始形态；不带默认标记。 */
  list?(): Promise<unknown>
}

/** Web 服务器的一条路由。 */
export interface WebServerRoute {
  kind: 'exact' | 'prefix'
  path: string
  handler: (request: IncomingMessage, response: ServerResponse) => unknown
}

/** Web 服务器服务：注册具名路由，返回注销函数。 */
export interface WebServerApi {
  register(route: WebServerRoute): () => void
}

/** 会话控制器；本插件只用到「停止当前轮次」这一个入口。 */
export interface SessionControllerApi {
  /**
   * 停止一条会话正在执行的轮次，宿主保留待发队列，不丢消息。
   * @param request 要停止的会话
   * @returns `accepted` 表示取消已交给存活的 Agent，不保证轮次已立即结束
   */
  cancel(request: { sessionId: string }): { accepted: true }
}

/** 提示词文本：常量，或按本次装配的上下文计算（用于按会话注入不同内容）。 */
export type PromptText = string | ((context: PromptAssemblyContext) => string)

/** 系统提示词服务：按作用域注册有序段落。 */
export interface SystemPromptApi {
  /**
   * 注册一个提示词段落；`text` 可以按每次装配的上下文求值，用于按会话注入内容。
   * @returns 注销函数
   */
  section(section: {
    name: string
    order: number
    text: PromptText
    interpolate?: boolean
  }): () => void
  /** 装配方法；本插件只在技能包里读取它做最外层包装。 */
  assemble?: unknown
}

/** preset 内提示词插件收到的宿主上下文。 */
export interface PresetPromptContext {
  effect(effect: () => () => void, label?: string): void
  systemPrompt: SystemPromptApi
}

/** preset 隔离行用到的工具注册表能力。 */
export interface PresetToolsApi {
  /** 一个作用域可见的工具定义；省略作用域时按全局层解析。 */
  get(name: string, scope?: unknown): unknown
  /**
   * 可见工具的名字清单；省略作用域时按全局层解析。
   * MCP 工具是异步发现的，隔离行要靠它在运行期重算掩码，而不是固化注册那一刻的名单。
   */
  schemas(scope?: unknown): Array<{ name?: unknown }>
  /** 对当前作用域的继承工具施加允许/拒绝掩码，返回解除函数。 */
  restrict(filter: { allow?: string[]; deny?: string[] }): () => void
}

/** 装配 waterfall 的一段：section 与 context 均为已求值文本。 */
export interface AssemblySection {
  name: string
  text: string
  interpolate?: boolean
}

/** `system-prompt/assemble` 事件里流转的装配结果。 */
export interface PromptAssembly {
  sections: AssemblySection[]
  contexts: AssemblySection[]
  tools: unknown[]
  variables: Record<string, string>
}

/** `system-prompt/assemble` 的回调上下文；`scope` 是触发装配的 Agent 作用域。 */
export interface PromptAssemblyContext {
  /** 触发装配的 Agent；会话内装配时存在。 */
  agent?: unknown
  /** 作用域对象，与 `agent` 指向同一对象。 */
  scope?: unknown
  [key: string]: unknown
}

/** preset 隔离行收到的宿主上下文：工具注册表加装配 waterfall。 */
export interface PresetIsolateContext {
  effect(effect: () => () => void, label?: string): void
  /** 订阅装配 waterfall 或工具变更事件。 */
  on(
    event: string,
    listener: (...args: unknown[]) => unknown,
    options?: { prepend?: boolean; global?: boolean },
  ): () => void
  tools: PresetToolsApi
}


/**
 * feature 提供的宿主侧扩展。
 *
 * 由 src/features/host.ts 聚合，src/index.ts 只做统一注册，
 * 壳子不承载任何具体功能实现。
 */
export interface FeatureHostExtension {
  /** 功能标识，与 feature 目录名一致；启动失败时用于定位是哪个功能。 */
  id: string
  /** 本扩展依赖的宿主服务，壳子合并去重后作为插件的 inject。 */
  inject?: string[]
  /** 注册本扩展的宿主能力。 */
  apply(ctx: HostPluginContext): void
}
