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

/** 宿主侧插件上下文：只声明本插件实际依赖的能力。 */
export interface HostPluginContext {
  /** 注册随插件生命周期自动清理的副作用，回调返回清理函数。 */
  effect(effect: () => () => void, label?: string): void
  /** 订阅 index.html 注入事件，返回取消订阅函数。 */
  on(event: 'webserver/index-inject', listener: (table: IndexInjectTable) => void): () => void
  /** 在依赖服务就绪后执行回调，回调拿到带对应服务的子上下文。 */
  inject(names: string[], callback: (ctx: HostPluginContext) => void): void
  /** Agent 预设服务；插件声明依赖后可用。 */
  agentPresets?: AgentPresetApi
  /** Web 服务器服务；通过 inject 取得后可用。 */
  webServer?: WebServerApi
  /** 启动本进程的 profile；缺失时相关功能回退为扫描全部 profile。 */
  profileContext?: ProfileContext
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

/** 系统提示词服务：按作用域追加有序段落。 */
export interface SystemPromptApi {
  /**
   * 注册一个提示词段落。
   * @returns 注销函数
   */
  section(section: {
    name: string
    order: number
    text: string
    interpolate?: boolean
  }): () => void
}

/** preset 内提示词插件收到的宿主上下文。 */
export interface PresetPromptContext {
  effect(effect: () => () => void, label?: string): void
  systemPrompt: SystemPromptApi
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
