/**
 * 全局能力隔离计划。
 *
 * 已装插件与全局 MCP 在编辑页里就归在「插件与工具」「MCP 服务器」两块中，和标准
 * 工具行、技能包自有 MCP 共用同一套三态规则。区别只在落地方式：标准工具行与自有
 * MCP 靠「预设里不挂那一行」实现，已装插件与全局 MCP 在宿主启动时就注册进全局层，
 * 只能由预设作用域的掩码与提示词过滤屏蔽。
 */
import type { GlobalToolGroup, PowerPack, ResourceRule } from '../types'

import type { IsolatePlan } from './composition'

/**
 * 判断一个能力标识是否被规则排除。
 * @param rule 技能包规则
 * @param id 能力组标识
 * @returns 需要屏蔽时返回 true
 */
function isDenied(rule: ResourceRule, id: string): boolean {
  const selected = rule.items.includes(id)

  switch (rule.mode) {
    case 'include':
      // 「仅应用」：没有勾选的组都要屏蔽
      return !selected
    case 'exclude':
      return selected
    default:
      return false
  }
}

/**
 * 由插件包名派生提示词段名前缀。
 *
 * 约定成俗的段名以包名或去前缀的短名打头（`dsh-purge`、`purge:*`），按前缀
 * 过滤即可命中；完全不按约定命名的插件由严格模式兜底。
 * @param packageName 插件包名
 * @returns 小写前缀，去重
 */
function sectionPrefixes(packageName: string): string[] {
  const short = packageName.replace(/^dsh-plugin-/, '').replace(/^dsh-/, '')

  return [...new Set([packageName, short].filter((item) => item !== '').map((item) => item.toLowerCase()))]
}

/**
 * 生成预设隔离行的配置。
 * @param pack 技能包定义
 * @param groups 宿主枚举出的全局能力组
 * @returns 需要隔离时返回计划；无事可做时返回 undefined
 */
export function planIsolation(
  pack: PowerPack,
  groups: GlobalToolGroup[],
): IsolatePlan | undefined {
  // 已装插件看「插件与工具」规则，全局 MCP 看「MCP 服务器」规则
  const denied = groups.filter((group) =>
    isDenied(group.id.startsWith('mcp:') ? pack.mcp : pack.plugins, group.id),
  )
  const denyTools = [...new Set(denied.flatMap((group) => group.tools))].sort((left, right) =>
    left.localeCompare(right),
  )

  const hideSections = new Set<string>()
  for (const group of denied) {
    if (!group.id.startsWith('pkg:')) continue
    for (const prefix of sectionPrefixes(group.id.slice(4))) hideSections.add(prefix)
  }

  if (denyTools.length === 0 && hideSections.size === 0) return undefined

  return {
    denyTools,
    hideSections: [...hideSections].sort((left, right) => left.localeCompare(right)),
    // 被排除的已装插件会改写系统提示词，工具掩码之外还要丢弃它的注入
    strict: denied.some((group) => group.kind === 'installed'),
  }
}
