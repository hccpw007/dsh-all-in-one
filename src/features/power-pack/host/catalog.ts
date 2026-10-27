/**
 * 插件/工具行清单。
 *
 * 可选项来自两处：标准预设的功能项，以及 profile 中已安装的 `dsh-plugin-*`。
 * 已装插件可能已经在全局组合里加载，因此在技能包规则里必须显式勾选才会追加。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { PluginCatalogItem } from '../types'

import { resolveDshHome } from './skill-catalog'
import { STANDARD_PLUGIN_ITEMS, type StandardPluginItem } from './standard-rows'

/** 本插件自身不进入可选插件清单，避免预设重复加载设置页。 */
const SELF_PACKAGE = 'dsh-all-in-one'

/** 已安装插件项，id 用 `pkg:` 前缀与标准项区分。 */
export interface InstalledPluginItem extends PluginCatalogItem {
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
    console.error('[power-pack] 读取 profile 目录失败:', profilesRoot, error)
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
      console.error('[power-pack] 读取 profile 依赖失败:', manifestPath, error)
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
      console.error('[power-pack] 读取 profile 插件目录失败:', modulesRoot, error)
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right))
}

/**
 * 把包名转成合法的组合行 id。
 * @param packageName 插件包名
 * @returns 只含字母数字与短横线的行 id
 */
export function installedRowId(packageName: string): string {
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
