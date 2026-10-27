/**
 * 全局能力清单。
 *
 * 预设行只能「增加」能力：profile bundles 与全局 cordis 补丁里的插件、MCP
 * 服务器在宿主启动时加载到全局层，任何会话都会继承，预设无法靠不挂载来去掉。
 * 要让技能包能排除这类能力，先在宿主侧把它们枚举成可勾选的组（一个已装插件
 * 的工具集合，或一台全局 MCP 服务器），再由预设隔离行按名字屏蔽。
 */
import type { ToolsApi } from '../../../types/host'
import type { GlobalToolGroup } from '../types'

import { findInstalledPlugins } from './catalog'
import { ownedTools } from './package-scan'

/** MCP 工具名格式：`mcp__<serverName>__<rawName>`。 */
const MCP_TOOL_NAME = /^mcp__([A-Za-z0-9_-]{1,32})__/

/**
 * 收集全局层的工具名。
 *
 * `schemas()` 省略作用域即读取全局层，返回的是预设行之外、每个会话都会
 * 继承的工具；宿主未注入工具服务时返回空表。
 * @param tools 宿主工具注册表
 * @returns 全局工具名，已去重
 */
function collectGlobalToolNames(tools?: ToolsApi): string[] {
  if (tools === undefined) return []

  try {
    const schemas = tools.schemas()
    const names = new Set<string>()
    for (const schema of schemas) {
      if (typeof schema?.name === 'string' && schema.name !== '') names.add(schema.name)
    }

    return [...names]
  } catch (error) {
    console.error('[power-pack] 读取全局工具清单失败:', error)
    return []
  }
}

/**
 * 生成编辑页的全局能力分组。
 *
 * 只列出确实注册了工具的能力：没有工具的组无从隔离，列出来只会误导。
 * @param tools 宿主工具注册表
 * @param profileDir 宿主报告的当前 profile 目录；缺省时扫描全部 profile
 * @returns 已装插件组在前、全局 MCP 组在后
 */
export async function listGlobalToolGroups(
  tools?: ToolsApi,
  profileDir?: string,
): Promise<GlobalToolGroup[]> {
  const names = collectGlobalToolNames(tools)

  const mcpTools = new Map<string, string[]>()
  const localTools: string[] = []
  for (const name of names) {
    const match = MCP_TOOL_NAME.exec(name)
    if (match) {
      const server = match[1]
      const list = mcpTools.get(server) ?? []
      list.push(name)
      mcpTools.set(server, list)
    } else {
      localTools.push(name)
    }
  }

  const groups: GlobalToolGroup[] = []
  for (const packageName of await findInstalledPlugins(profileDir)) {
    const owned = await ownedTools(packageName, localTools, profileDir)
    if (owned.length === 0) continue

    groups.push({
      id: `pkg:${packageName}`,
      label: packageName,
      kind: 'installed',
      tools: owned,
    })
  }

  for (const [server, serverTools] of [...mcpTools].sort(([left], [right]) => left.localeCompare(right))) {
    groups.push({
      id: `mcp:${server}`,
      label: `MCP · ${server}`,
      kind: 'global-mcp',
      tools: serverTools.sort((left, right) => left.localeCompare(right)),
    })
  }

  return groups
}
