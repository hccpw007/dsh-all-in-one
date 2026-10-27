/**
 * 「对话风格」的数据模型。
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

/** 风格内维护的 MCP 服务器定义，对应宿主 mcp-client 的一行。 */
export interface McpServerConfig {
  /** 稳定标识，同时用于行 id 与 serverName。 */
  id: string
  /** 界面展示名。 */
  label: string
  transport: 'stdio' | 'streamable-http'
  /** stdio 启动命令。 */
  command: string
  args: string[]
  env: Record<string, string>
  /** streamable-http 地址。 */
  url: string
  headers: Record<string, string>
}

/** 一个可保存的对话风格。 */
export interface ChatStyle {
  /** 稳定标识，注册预设时加 `style-` 前缀。 */
  id: string
  name: string
  description: string
  /** 追加到系统提示词末尾的风格要求。 */
  systemPrompt: string
  skills: ResourceRule
  plugins: ResourceRule
  mcp: ResourceRule
  mcpServers: McpServerConfig[]
}

/** 存储文件的内容结构。 */
export interface ChatStyleDocument {
  version: 1
  styles: ChatStyle[]
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
export interface ChatStyleCatalog {
  skills: SkillCatalogItem[]
  plugins: PluginCatalogItem[]
}

/** GET / POST 共用的响应负载。 */
export interface ChatStylesPayload {
  styles: ChatStyle[]
  catalog: ChatStyleCatalog
  /** 存储文件路径，便于用户定位与备份。 */
  storagePath: string
}

/** 保存或删除风格的请求体。 */
export type ChatStyleWriteRequest =
  | { action: 'save'; style: ChatStyle }
  | { action: 'delete'; id: string }
