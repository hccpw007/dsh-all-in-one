/**
 * 插件/工具行清单与选择。
 *
 * 可选项来自两处：标准预设的功能项，以及 profile 中已安装的 `dsh-plugin-*`。
 * 已安装插件可能已经在全局组合里加载，重复放进预设会造成重复注册，因此
 * 「全部使用」只覆盖标准项，已装插件必须显式勾选。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { PluginCatalogItem, ResourceRule } from '../types'

import { resolveDshHome } from './skill-catalog'
import { STANDARD_PLUGIN_ITEMS, type PresetRow, type StandardPluginItem } from './standard-rows'

/** 本插件自身不进入可选插件清单，避免预设重复加载设置页。 */
const SELF_PACKAGE = 'dsh-all-in-one'

/** 已安装插件项，id 用 `pkg:` 前缀与标准项区分。 */
interface InstalledPluginItem extends PluginCatalogItem {
  packageName: string
}

/**
 * 扫描 `$DSH_HOME/profiles/*` 中已安装的插件包。
 * @returns 去重后的插件包名，按字母排序
 */
async function findInstalledPlugins(): Promise<string[]> {
  const profilesRoot = join(resolveDshHome(), 'profiles')
  const names = new Set<string>()

  let profiles
  try {
    profiles = await readdir(profilesRoot, { withFileTypes: true })
  } catch (error) {
    // 没有 profile 目录说明当前是 headless 或尚未安装插件，按空处理
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    console.error('[chat-style] 读取 profile 目录失败:', profilesRoot, error)
    return []
  }

  for (const profile of profiles) {
    if (!profile.isDirectory()) continue

    // 先读 package.json 依赖，再补 node_modules 中实际存在的插件目录
    const manifestPath = join(profilesRoot, profile.name, 'package.json')
    try {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
        dependencies?: Record<string, string>
      }
      for (const name of Object.keys(manifest.dependencies ?? {})) {
        if (name.startsWith('dsh-plugin-') && name !== SELF_PACKAGE) names.add(name)
      }
    } catch (error) {
      console.error('[chat-style] 读取 profile 依赖失败:', manifestPath, error)
    }

    const modulesRoot = join(profilesRoot, profile.name, 'node_modules')
    try {
      const modules = await readdir(modulesRoot, { withFileTypes: true })
      for (const entry of modules) {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
        if (entry.name.startsWith('dsh-plugin-') && entry.name !== SELF_PACKAGE) {
          names.add(entry.name)
        }
      }
    } catch (error) {
      console.error('[chat-style] 读取 profile 插件目录失败:', modulesRoot, error)
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right))
}

/**
 * 把包名转成合法的组合行 id。
 * @param packageName 插件包名
 * @returns 只含字母数字与短横线的行 id
 */
function installedRowId(packageName: string): string {
  return `pkg-${packageName.replace(/[^A-Za-z0-9_-]/g, '-')}`
}

/**
 * 生成编辑页的插件清单。
 * @returns 标准项在前、已装插件在后
 */
export async function listPluginCatalog(): Promise<{
  standard: StandardPluginItem[]
  installed: InstalledPluginItem[]
}> {
  const installed = (await findInstalledPlugins()).map<InstalledPluginItem>((packageName) => ({
    id: `pkg:${packageName}`,
    label: packageName,
    description: '已安装插件。若它已在 profile 中全局加载，重复挂载可能冲突，请谨慎勾选。',
    kind: 'installed',
    packageName,
  }))

  return { standard: STANDARD_PLUGIN_ITEMS, installed }
}

/**
 * 把清单转成客户端可渲染的条目，不暴露组合行细节。
 * @returns 扁平化的插件条目
 */
export async function listPluginItems(): Promise<PluginCatalogItem[]> {
  const { standard, installed } = await listPluginCatalog()

  return [
    ...standard.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
    ...installed.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
  ]
}

/**
 * 按规则选择预设组合行。
 *
 * `all` 只包含标准项：已装插件默认全局加载，自动加入会把「全部使用」变成
 * 高风险操作。`include` 允许显式选择标准项或已装插件；`exclude` 从标准项
 * 全集里剔除勾选项。
 * @param rule 插件规则
 * @param installed 已安装插件清单
 * @returns 去重后的组合行，保持清单顺序
 */
export function selectPluginRows(
  rule: ResourceRule,
  installed: InstalledPluginItem[],
): PresetRow[] {
  const selected = new Set(rule.items)
  const rows: PresetRow[] = []

  const push = (item: StandardPluginItem): void => {
    for (const row of item.rows) {
      if (rows.some((existing) => existing.id === row.id)) continue
      rows.push(row)
    }
  }

  switch (rule.mode) {
    case 'all':
      for (const item of STANDARD_PLUGIN_ITEMS) push(item)
      break
    case 'exclude':
      for (const item of STANDARD_PLUGIN_ITEMS) {
        if (!selected.has(item.id)) push(item)
      }
      break
    case 'include':
      for (const item of STANDARD_PLUGIN_ITEMS) {
        if (selected.has(item.id)) push(item)
      }
      for (const item of installed) {
        if (!selected.has(item.id)) continue
        rows.push({ id: installedRowId(item.packageName), name: item.packageName })
      }
      break
    default:
      // 未知模式按不提供任何工具处理，避免静默启用用户未选择的插件
      break
  }

  return rows
}
