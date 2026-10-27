/**
 * 把一个对话风格翻译成宿主的预设组合。
 *
 * 组合按「风格系统提示词 → 插件/工具行 → 技能提供者 → MCP 服务器」排列。
 * 技能提供者与 `tool-skill` 是固定行：没有它们，风格里勾选的技能既不会进入
 * 系统提示词，也没有加载工具可用。
 */
import type { ChatStyle, McpServerConfig } from '../types'

import { listPluginCatalog, selectPluginRows } from './catalog'
import { styleSkillDir } from './skill-links'
import type { PresetRow } from './standard-rows'

/** 风格提示词行的包内子入口，注册为 preset 的一行。 */
const PROMPT_ROW_NAME = 'dsh-all-in-one/preset-style'

/** 技能提供者行，按规则扫描用户根或风格专属目录。 */
const SKILL_FILESYSTEM_ROW = '@deepseek-ai/dsh-skill-filesystem'

/** 模型侧的技能目录与加载工具行。 */
const TOOL_SKILL_ROW = '@deepseek-ai/dsh-tool-skill'

/** MCP 客户端行。 */
const MCP_CLIENT_ROW = '@deepseek-ai/dsh-mcp-client'

/** 生成 MCP 客户端行的配置；空字段不写入，避免覆盖宿主默认值。 */
function mcpRowConfig(server: McpServerConfig): Record<string, unknown> {
  const base = { serverName: server.id }

  if (server.transport === 'stdio') {
    return {
      ...base,
      transport: 'stdio',
      command: server.command,
      args: server.args.filter((arg) => arg !== ''),
      ...Object.keys(server.env).length > 0 ? { env: server.env } : {},
    }
  }

  return {
    ...base,
    transport: 'streamable-http',
    url: server.url,
    ...Object.keys(server.headers).length > 0 ? { headers: server.headers } : {},
  }
}

/**
 * 按三态规则选出该风格启用的 MCP 服务器。
 * @param style 风格定义
 * @returns 启用的服务器
 */
function selectMcpServers(style: ChatStyle): McpServerConfig[] {
  const selected = new Set(style.mcp.items)

  switch (style.mcp.mode) {
    case 'all':
      return style.mcpServers
    case 'include':
      return style.mcpServers.filter((server) => selected.has(server.id))
    case 'exclude':
      return style.mcpServers.filter((server) => !selected.has(server.id))
    default:
      return []
  }
}

/**
 * 组装一个风格的完整预设行列表。
 * @param style 风格定义
 * @returns 可直接注册为 Agent 预设的 plugins
 */
export async function buildPresetRows(style: ChatStyle): Promise<PresetRow[]> {
  const rows: PresetRow[] = []

  // 风格提示词追加在系统提示词末尾；为空时不注册，保持继承部署人设
  if (style.systemPrompt.trim() !== '') {
    rows.push({
      id: 'chat-style-prompt',
      name: PROMPT_ROW_NAME,
      config: { text: style.systemPrompt },
    })
  }

  const { installed } = await listPluginCatalog()
  rows.push(...selectPluginRows(style.plugins, installed))

  // 技能规则为「全部」时直接扫描用户根，其余模式只扫描风格专属链接目录
  const skillConfig =
    style.skills.mode === 'all'
      ? { includeDefaultRoots: true }
      : { includeDefaultRoots: false, customSkillDirs: [styleSkillDir(style.id)] }

  rows.push({ id: 'skill-filesystem', name: SKILL_FILESYSTEM_ROW, config: skillConfig })
  rows.push({ id: 'tool-skill', name: TOOL_SKILL_ROW })

  for (const server of selectMcpServers(style)) {
    rows.push({ id: `mcp-${server.id}`, name: MCP_CLIENT_ROW, config: mcpRowConfig(server) })
  }

  return rows
}
