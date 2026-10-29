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
  /** 在依赖服务就绪后执行回调，回调拿到带对应服务的子上下文。 */
  inject(names: string[], callback: (ctx: HostPluginContext) => void): void
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
  /** 启动本进程的 profile；缺失时相关功能回退为扫描全部 profile。 */
  profileContext?: ProfileContext
}

/** `agent/pre-step` 事件负载：一轮里每次派发模型请求前发出。 */
export interface AgentPreStepEvent {
  agent: AgentLike
  /** 本轮取消信号；压缩过程也跟随它取消。 */
  signal: AbortSignal
}

/** 在线 Agent 的最小形状：会话与 Agent 一一对应。 */
export interface AgentLike {
  session: SessionLike
}

/** 会话的最小形状：读投影、选择压缩范围都需要它。 */
export interface SessionLike {
  /** 会话标识，与 Agent 标识相同。 */
  id: string
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
  /** 整份请求的估算占用。 */
  totalTokens: number
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
  /** 本扩展依赖的宿主服务，壳子合并去重后作为插件的 inject。 */
  inject?: string[]
  /** 注册本扩展的宿主能力。 */
  apply(ctx: HostPluginContext): void
}
