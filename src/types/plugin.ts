/**
 * 宿主客户端 API 的最小类型声明。
 *
 * 宿主包只发布运行时代码，没有对外类型，这里按本插件实际用到的能力声明，
 * 避免在业务代码里散落 `any`。
 */
import type { ComponentType } from 'react'

/** 宿主注入的翻译函数，按语言包 key 取当前语言的文案。 */
export type Translate = (key: string) => string

/** 宿主 locale 服务：本插件只用到注册字典与绑定命名空间。 */
export interface LocaleApi {
  /** 注册某命名空间的语言字典，返回注销函数。 */
  register(namespace: string, locale: string, dictionary: Record<string, string>): () => void
  /** 绑定命名空间，得到只查该命名空间的翻译函数。 */
  bind(namespace: string): Translate
}

/** 插槽描述：label 用于设置页导航，priority 用于覆盖同一 single 插槽的注册。 */
export interface SlotDescriptor {
  name: string
  id?: string
  order?: number
  /** 同一 single 插槽内优先级最低者渲染；默认 0。 */
  priority?: number
  label?: () => string
  /** 语言命名空间，插槽组件会收到绑定该命名空间的 `t`。 */
  locale?: string
  /** 按会话 id 计算注入给组件的 props 与 hooks。 */
  inject?: (sessionId?: string) => Record<string, unknown>
}

/** 宿主 slot 服务：插槽就绪时执行工厂并注册组件。 */
export interface SlotsApi {
  /** 在插槽可用后执行工厂，返回的注销函数随插件卸载调用。 */
  inject(slot: string, factory: () => () => void): void
  /** 把组件注册进插槽，返回注销函数。 */
  register(descriptor: SlotDescriptor, component: ComponentType<Record<string, unknown>>): () => void
}

/** 远程调用的统一结果。 */
export interface RemoteResult<T> {
  ok: boolean
  value?: T
  error?: { message?: string; code?: string }
}

/** 预设摘要，字段与宿主 `agentPresets.list` 的返回一致。 */
export interface AgentPresetSummary {
  id: string
  name?: string
  description?: string
  isDefault?: boolean
  /** 存在时表示该预设无法挂载。 */
  broken?: string
}

/** 宿主 Agent 预设远程接口。 */
export interface AgentPresetsRemote {
  list(): Promise<RemoteResult<{ presets: AgentPresetSummary[] }>>
  select(sessionId: string, agentPreset: string): Promise<RemoteResult<string>>
}

/** 会话摘要中本插件用到的字段。 */
export interface SessionSummary {
  id: string
  blank?: boolean
  /** Agent 是否正在执行任务；运行中的会话不能删除。 */
  running?: boolean
  /** 最近一次活动时间（毫秒时间戳）；宿主默认按它倒序排列会话。 */
  updatedAt?: number
  /** 当前被哪些界面持有；`mainView` 大于 0 表示这是正在浏览的对话。 */
  retainedBy?: { mainView?: number }
  /** 会话工作目录；工作区不可用时用它把新对话建在同一项目里。 */
  cwd?: string
  projectionValues?: { agentPreset?: unknown }
}

/** 工作区条目中本插件用到的字段。 */
export interface WorkspaceSummary {
  workspaceId: string
  /** 归属于该工作空间的会话标识，顺序由宿主维护。 */
  sessionIds: string[]
}

/** 工作区服务：宿主用它决定主视图打开哪一条会话。 */
export interface UiWorkspaceApi {
  /**
   * 打开默认工作区的新会话页面：新建或复用一条空白会话并切到主视图。
   * 宿主没有任何可用工作区时回到新会话屏幕。
   */
  startSession?(workspaceId?: string): void
  /** 把指定会话打开到主视图，不新建会话。 */
  openSession?(sessionId: string): void
  /**
   * 取工作区的空白会话：宿主复用第一条可用的空白成员，没有才新建。
   * 宿主版本不带该能力时省略。
   */
  connectWorkspace?(workspaceId: string): Promise<string>
  /**
   * 工作区列表快照。宿主用它维护会话分组与归档集合，
   * 这里只读取「会话属于哪个工作空间」与归档状态。
   */
  workspaces?: {
    list: {
      getSnapshot(): {
        items: WorkspaceSummary[]
        /** 已归档的会话；默认视图不展示它们。 */
        archivedSessionIds?: string[]
      }
      /** 工作区快照变化通知，返回注销函数；宿主版本不带该能力时省略。 */
      subscribe?(listener: () => void): () => void
    }
  }
}

/**
 * 待发送消息里的一个内容块。
 *
 * 队列投影是宿主事件折叠出来的 wire 数据，块字段随类型出现：文本块带 `text`，
 * 图片与文件块带 `attachment`；这里按读取到的最小形状声明，不复制宿主联合类型。
 */
export interface QueueContentBlock {
  readonly type: string
  readonly text?: string
  readonly attachment?: AttachmentRef
}

/** 宿主持久化附件（图片与文件共用外层标识）。 */
export interface AttachmentRef {
  readonly attachmentId: string
  readonly mediaType?: string
  readonly name?: string
  /** 编码后的字节数；图片块带该字段。 */
  readonly bytes?: number
  /** 图片固有宽度；图片块带该字段。 */
  readonly width?: number
  /** 图片固有高度；图片块带该字段。 */
  readonly height?: number
}

/** 宿主持久化图片的可选尺寸与字节信息；readAttachment 需要完整引用，这里只作说明。 */
export interface ImageAttachmentRef extends AttachmentRef {
  readonly mediaType: string
  readonly bytes: number
  readonly width: number
  readonly height: number
}

/** 队列投影里的一条待发送消息。 */
export interface QueuedMessage {
  readonly id: string
  readonly content: readonly QueueContentBlock[]
  /** 下发来源；本地下发回显靠 `rpcId` 与请求标识对应。 */
  readonly source?: { readonly kind?: string; readonly rpcId?: string }
}

/** 会话快照里本插件用到的字段。 */
export interface SessionSnapshotApi {
  /** 非空表示这是子代理会话，图片不再走宿主上传通道。 */
  readonly subagent: unknown
  /** 已提交但尚未进入队列或正文的本地回显。 */
  readonly pendingSubmissions: readonly {
    readonly requestId: string
    readonly placement: 'queued' | 'transcript'
  }[]
}

/** 会话投影读取面（宿主 `useProjection` 的底层入口）。 */
export interface SessionProjectionsApi {
  faceOf(key: string): { getSnapshot(): unknown }
}

/** 客户端会话对象中本插件用到的能力。 */
export interface SessionApi {
  getSnapshot(): SessionSnapshotApi
  readonly projections: SessionProjectionsApi
  /** 读取宿主持久化图片的字节，用于把排队消息里的图片放回输入框。 */
  readAttachment(
    attachment: ImageAttachmentRef,
  ): Promise<RemoteResult<{ attachment: ImageAttachmentRef; data: Uint8Array }>>
}

/** 一条被持有的会话绑定：会话对象与它的作用域上下文。 */
export interface SessionBindingApi {
  readonly session: SessionApi
  readonly ctx: unknown
}

/**
 * 会话作用域上下文。
 *
 * 宿主按调用方上下文解析服务：同一个服务对象从会话作用域里取出来，方法内部的
 * `ctx` 就是那个会话，队列与取消这类按会话寻址的操作才能落到正确的会话上。
 */
export interface SessionScopeApi {
  get(name: string): unknown
}

/** 浏览器侧草稿附件标识。 */
export type DraftAttachmentId = string

/** 会话输入框的公开状态。 */
export interface InputStateApi {
  /** 已放进草稿的附件标识，按发送顺序排列。 */
  readonly attachmentIds: readonly DraftAttachmentId[]
  /** 提交阶段；非 `plain` 时输入框只读，不能改写草稿。 */
  readonly phase: 'plain' | 'adjudicating' | 'claimed' | 'submitting' | 'sending'
}

/** 单条会话的输入框操作面。 */
export interface SessionInputApi {
  /** 用一段纯文本替换整个草稿，同时清掉草稿里的引用芯片。 */
  setDraft(text: string): void
  /** 按顺序追加草稿附件；输入框处于提交阶段时返回 false。 */
  addAttachments(ids: readonly DraftAttachmentId[]): boolean
  /** 从草稿里移除一个附件。 */
  removeAttachment(id: DraftAttachmentId): boolean
  /** 在输入框上方给出一条提示。 */
  notify(level: 'info' | 'error', text: string): void
  /** 把输入框交还给键盘。 */
  focus(): void
  readonly state: { getSnapshot(): InputStateApi }
}

/** 会话服务：读取列表快照，并在删除后让快照丢掉对应行。 */
export interface SessionsApi {
  list: {
    getSnapshot(): { ids: string[]; byId: Record<string, SessionSummary> }
    /** 会话快照变化通知，返回注销函数；宿主版本不带该能力时省略。 */
    subscribe?(listener: () => void): () => void
  }
  /**
   * 新建一条会话。宿主版本不带该能力时省略；
   * 传入 `workspaceId` 时新会话归属该工作区，否则按 `cwd` 或宿主默认目录创建。
   */
  create?(options: { workspaceId?: string; cwd?: string }): Promise<string>
  /**
   * 本地摘掉一条会话（宿主列表快照层的移除入口）。
   * 宿主不提供时调用方跳过即可，其它功能不受影响。
   */
  handleSessionRemoved?(sessionId: string): void
  /**
   * 取一条会话的作用域上下文，输入框注册表按它定位。
   * 会话未被持有或宿主版本不带该能力时返回 undefined。
   */
  scope?(sessionId: string): SessionScopeApi | undefined
  /** 取一条会话的绑定（会话对象与其作用域）；会话未被持有时返回 undefined。 */
  binding?(sessionId: string): SessionBindingApi | undefined
}

/** 宿主会话对话服务：输入框注册表与排队消息操作。 */
export interface ConversationApi {
  /** 按会话作用域解析该会话的输入框操作面。 */
  readonly input: { for(actx: unknown): SessionInputApi }
  /** 撤回一条排队消息；宿主拒绝或网络失败时抛出。 */
  updateQueue(itemId: string, action: { kind: 'remove' }): Promise<void>
  /** 把浏览器文件登记为草稿附件，返回按入参顺序排列的附件标识。 */
  createDrafts(
    sessionId: string,
    files: readonly File[],
    uploadImages: boolean,
  ): readonly { readonly id: DraftAttachmentId }[]
  /** 释放一个草稿附件占用的预览地址。 */
  releaseDraftAttachment(id: DraftAttachmentId): void
}

/** 插件上下文：只声明本插件实际依赖的宿主能力。 */
export interface PluginContext {
  /** 注册随插件生命周期自动清理的副作用，回调返回清理函数。 */
  effect(effect: () => () => void, label?: string): void
  /** 在依赖服务就绪后执行回调；服务缺失时回调不会执行，也不阻断插件主体。 */
  inject(names: string[], callback: (ctx: PluginContext) => void | (() => void)): void
  locale: LocaleApi
  slots: SlotsApi
  /** 会话列表服务；声明依赖后可用。 */
  sessions?: SessionsApi
  /** 会话对话服务；声明 `conversation` 依赖后可用。 */
  conversation?: ConversationApi
  /** 工作区服务；声明依赖后可用。 */
  uiWorkspace?: UiWorkspaceApi
  /** 远程服务；声明 `remote.agentPresets` 依赖后可用。 */
  remote?: { agentPresets?: AgentPresetsRemote }
}

/** 客户端插件定义，作为 ModuleLoader 工厂的默认导出。 */
export interface ClientPlugin {
  inject: string[]
  apply(ctx: PluginContext): void
}
