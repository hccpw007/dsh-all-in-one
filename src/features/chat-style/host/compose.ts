/**
 * 把「模式」与「对话风格」合成一份组合行。
 *
 * 模式提供基础工具与提示词，风格在此基础上做三件事：接管技能提供者行、
 * 按三态规则筛选模式里的标准工具行、追加自己的提示词与 MCP 服务器。
 * 两个维度因此相互独立：换风格不会改变所选模式，换模式也不会丢掉风格。
 */
import type { ChatStyle, ResourceRule } from '../types'

import { installedRowId, type InstalledPluginItem } from './catalog'
import { buildStyleRows, SKILL_FILESYSTEM_ROW, TOOL_SKILL_ROW } from './composition'
import { STANDARD_PLUGIN_ITEMS, type PresetRow } from './standard-rows'

/** 技能相关行由风格接管，先于插件规则从模式里剔除，避免重复挂载。 */
const SKILL_ROW_NAMES = new Set([SKILL_FILESYSTEM_ROW, TOOL_SKILL_ROW])

/** 一个标准项在模式组合里可能出现的行标识。 */
interface RowKeys {
  ids: Set<string>
  names: Set<string>
}

/** 收集一组行的 id 与包名。 */
function collectKeys(rows: PresetRow[]): RowKeys {
  const keys: RowKeys = { ids: new Set(), names: new Set() }
  for (const row of rows) {
    keys.ids.add(row.id)
    keys.names.add(row.name)
  }

  return keys
}

/** 标准项标识到它对应行标识的映射，用于把勾选项还原成模式里的行。 */
const ITEM_KEYS = new Map<string, RowKeys>(
  STANDARD_PLUGIN_ITEMS.map((item) => [item.id, collectKeys(item.rows)]),
)

/** 全部标准项覆盖的行标识，用来判断某一行是否属于可筛选范围。 */
const ALL_KEYS = collectKeys(STANDARD_PLUGIN_ITEMS.flatMap((item) => item.rows))

/**
 * 判断一行是否属于标准工具项。
 *
 * 模式里还有模型、Agent 循环、提示词等非工具行，它们不参与筛选，
 * 否则「仅引用」会把一个预设拆得无法运行。
 * @param row 模式组合中的一行
 * @returns 属于标准工具项时返回 true
 */
function isStandardRow(row: PresetRow): boolean {
  return ALL_KEYS.ids.has(row.id) || ALL_KEYS.names.has(row.name)
}

/**
 * 判断一行是否命中规则勾选的标准项。
 * @param row 模式组合中的一行
 * @param selected 被勾选的标准项标识
 * @returns 命中时返回 true
 */
function isSelectedRow(row: PresetRow, selected: Set<string>): boolean {
  for (const itemId of selected) {
    const keys = ITEM_KEYS.get(itemId)
    if (keys === undefined) continue
    if (keys.ids.has(row.id) || keys.names.has(row.name)) return true
  }

  return false
}

/**
 * 按三态规则筛选模式提供的工具行。
 * @param rows 去掉技能行后的模式行
 * @param rule 风格的插件规则
 * @param installed 已安装插件清单
 * @returns 筛选后的行
 */
function filterByPluginRule(
  rows: PresetRow[],
  rule: ResourceRule,
  installed: InstalledPluginItem[],
): PresetRow[] {
  if (rule.mode === 'all') return rows

  const selected = new Set(rule.items)

  if (rule.mode === 'include') {
    const kept = rows.filter((row) => !isStandardRow(row) || isSelectedRow(row, selected))

    // 已装插件不在模式的行里，显式勾选时追加到组合末尾
    for (const item of installed) {
      if (selected.has(item.id)) kept.push({ id: installedRowId(item.packageName), name: item.packageName })
    }

    return kept
  }

  return rows.filter((row) => !isStandardRow(row) || !isSelectedRow(row, selected))
}

/**
 * 合成模式的组合行与风格追加行。
 * @param modeRows 模式预设的组合行
 * @param style 风格定义
 * @param installed 已安装插件清单
 * @returns 可直接注册为预设的完整行列表
 */
export function composeStyleRows(
  modeRows: PresetRow[],
  style: ChatStyle,
  installed: InstalledPluginItem[],
): PresetRow[] {
  const base = modeRows.filter((row) => !SKILL_ROW_NAMES.has(row.name))
  const rows = filterByPluginRule(base, style.plugins, installed)

  for (const row of buildStyleRows(style)) {
    if (rows.some((existing) => existing.id === row.id)) continue
    rows.push(row)
  }

  return rows
}
