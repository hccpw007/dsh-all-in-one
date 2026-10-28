/**
 * 「技能包」的数据模型。
 *
 * 客户端编辑页与宿主侧预设生成共用同一份定义，避免两边各写一套字段。
 */

/** 资源规则的三态：全部使用、只引入勾选项、排除勾选项。 */
export type RuleMode = 'all' | 'include' | 'exclude'

/** 一类资源（技能 / 插件行 / MCP）的选择规则。 */
export interface ResourceRule {
  /** 规则模式；include 与 exclude 时 items 才有意义。 */
  mode: RuleMode
  /** 被勾选的标识：技能名、插件项 id 或 MCP 服务器 id。 */
  items: string[]
}

/** 一个可保存的技能包。 */
export interface PowerPack {
  /** 稳定标识，注册预设时加 `pack-` 前缀。 */
  id: string
  name: string
  description: string
  /** 追加到系统提示词末尾的技能包要求。 */
  systemPrompt: string
  skills: ResourceRule
  /**
   * 标准工具行与已装插件的取舍，勾选项同时包含两类标识：
   * 标准项 id（如 `tool-bash`）与已装插件 `pkg:<包名>`。
   *
   * 标准项决定预设行是否挂载；已装插件已在全局层加载，预设不重复挂载，
   * 取消勾选时由隔离行在会话内屏蔽它的工具与提示词注入。
   */
  plugins: ResourceRule
  /**
   * 已安装 MCP 服务器的取舍，勾选项是全局 MCP 的 `mcp:<服务器名>`。
   *
   * MCP 服务器由宿主的配置文件声明、启动时连接；预设层无法卸载已连接的服务器，
   * 因此这里只决定「是否在本技能包的会话里屏蔽它的工具与提示词注入」。
   */
  mcp: ResourceRule
}

/** 一组全局能力：一个已装插件的工具集合，或一台全局 MCP 服务器。 */
export interface GlobalToolGroup {
  /** 组标识：`pkg:<包名>` 或 `mcp:<服务器名>`。 */
  id: string
  /** 界面展示名。 */
  label: string
  kind: 'installed' | 'global-mcp'
  /** 该组在全局工具表里实际注册的工具名。 */
  tools: string[]
}

/** 存储文件的内容结构。 */
export interface PowerPackDocument {
  version: 1
  packs: PowerPack[]
  /** 新建会话默认预选的技能包 id；空字符串表示没有默认。 */
  defaultPackId: string
}

/** 插件/工具行的来源类别。 */
export type PluginItemKind = 'standard' | 'installed'

/** 插件/工具行清单里的一项。 */
export interface PluginCatalogItem {
  id: string
  label: string
  description: string
  kind: PluginItemKind
}

/** 可勾选的技能摘要。 */
export interface SkillCatalogItem {
  name: string
  description: string
}

/** 编辑页需要的清单数据。 */
export interface PowerPackCatalog {
  skills: SkillCatalogItem[]
  plugins: PluginCatalogItem[]
  /** 已在宿主全局组合里加载、只能靠掩码隔离的能力组。 */
  globalGroups: GlobalToolGroup[]
}

/** 生成过的「技能包 + 模式」组合，最近使用的在前。 */
export interface ComposedSelection {
  /** 技能包标识。 */
  pack: string
  /** 模式预设标识。 */
  mode: string
}

/** GET / POST 共用的响应负载。 */
export interface PowerPacksPayload {
  packs: PowerPack[]
  /** 新建会话默认预选的技能包 id；空字符串表示没有默认。 */
  defaultPackId: string
  /**
   * 记录过的组合，最近使用的在前。
   * 插件启动时按它重建组合预设，因此它同时决定新会话界面回填哪一个组合。
   */
  recentComposed: ComposedSelection[]
  catalog: PowerPackCatalog
  /** 存储文件路径，便于用户定位与备份。 */
  storagePath: string
}

/** 保存、删除、设置默认或合成组合预设的请求体。 */
export type PowerPackWriteRequest =
  | { action: 'save'; pack: PowerPack }
  | { action: 'delete'; id: string }
  | { action: 'setDefault'; id: string }
  | { action: 'compose'; pack: string; mode: string }

/** 合成组合预设的响应体。 */
export interface PowerPackComposeResponse {
  /** 已注册的组合预设 id，客户端直接用它选择会话预设。 */
  presetId: string
}
