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
    }
  }
}

/** 会话服务：读取列表快照，并在删除后让快照丢掉对应行。 */
export interface SessionsApi {
  list: {
    getSnapshot(): { ids: string[]; byId: Record<string, SessionSummary> }
  }
  /**
   * 本地摘掉一条会话（宿主列表快照层的移除入口）。
   * 宿主不提供时调用方跳过即可，其它功能不受影响。
   */
  handleSessionRemoved?(sessionId: string): void
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
