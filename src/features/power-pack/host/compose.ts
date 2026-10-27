/**
 * 把「模式」与「技能包」合成一份组合行。
 *
 * 模式提供基础工具与提示词，技能包在此基础上做四件事：接管技能提供者行、
 * 按三态规则筛选模式里的标准工具行、追加自己的提示词与 MCP 服务器、登记隔离行。
 * 两个维度因此相互独立：换技能包不会改变所选模式，换模式也不会丢掉技能包。
 *
 * 已在全局组合里的插件不在模式行中，预设无法卸载，因此它们的取舍交给隔离行
 * 的掩码与提示词过滤，不进入这里的行筛选。
 */
import type { GlobalToolGroup, PowerPack, ResourceRule } from '../types'

import { buildPackRows, SKILL_FILESYSTEM_ROW, TOOL_SKILL_ROW } from './composition'
import { planIsolation } from './isolation'
import { STANDARD_PLUGIN_ITEMS, type PresetRow } from './standard-rows'

/** 技能相关行由技能包接管，先于插件规则从模式里剔除，避免重复挂载。 */
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
 * 否则「仅应用」会把一个预设拆得无法运行。
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
 *
 * 只管模式自己的行：已装插件在全局层，预设里不重复挂载（会冲突），它们的
 * 取舍由隔离行的工具掩码负责。
 * @param rows 去掉技能行后的模式行
 * @param rule 技能包的插件规则
 * @returns 筛选后的行
 */
function filterByPluginRule(rows: PresetRow[], rule: ResourceRule): PresetRow[] {
  if (rule.mode === 'all') return rows

  const selected = new Set(rule.items)

  if (rule.mode === 'include') {
    return rows.filter((row) => !isStandardRow(row) || isSelectedRow(row, selected))
  }

  return rows.filter((row) => !isStandardRow(row) || !isSelectedRow(row, selected))
}

/**
 * 合成模式的组合行与技能包追加行。
 * @param modeRows 模式预设的组合行
 * @param pack 技能包定义
 * @param groups 宿主枚举出的全局能力组，用于生成隔离行
 * @returns 可直接注册为预设的完整行列表
 */
export function composePackRows(
  modeRows: PresetRow[],
  pack: PowerPack,
  groups: GlobalToolGroup[],
): PresetRow[] {
  const base = modeRows.filter((row) => !SKILL_ROW_NAMES.has(row.name))
  const rows = filterByPluginRule(base, pack.plugins)
  const isolate = planIsolation(pack, groups)

  for (const row of buildPackRows(pack, isolate)) {
    if (rows.some((existing) => existing.id === row.id)) continue
    rows.push(row)
  }

  return rows
}
