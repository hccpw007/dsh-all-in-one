/**
 * 插件/工具行清单。
 *
 * 可选项来自两处：标准预设的功能行项，以及 profile 中已安装的插件包。
 * 已装插件在宿主启动时加载到全局层，预设里不能再挂一份；技能包对它只有
 * 「保留 / 屏蔽」两种选择，屏蔽由隔离行的工具掩码实现（见 global-catalog）。
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
 * 读取一个 profile 目录里已启用的插件包。
 *
 * 只认该目录的 `package.json`：既要在依赖里，也要在启用清单
 * （`dsh.profile.bundles`）里。node_modules 可能残留已卸载的包，不能作为依据。
 * @param dir profile 目录
 * @param names 收集结果的集合
 */
async function collectProfilePlugins(dir: string, names: Set<string>): Promise<void> {
  const manifestPath = join(dir, 'package.json')
  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
      dependencies?: Record<string, string>
      dsh?: { profile?: { bundles?: unknown } }
    }
    const enabled = Array.isArray(manifest.dsh?.profile?.bundles)
      ? new Set(manifest.dsh.profile.bundles as string[])
      : new Set<string>()

    for (const name of Object.keys(manifest.dependencies ?? {})) {
      // 官方 bundle 与本插件自身不计入可选插件，避免预设重复加载
      if (name.startsWith('@deepseek-ai/') || name === SELF_PACKAGE) continue
      if (enabled.has(name)) names.add(name)
    }
  } catch (error) {
    console.error('[power-pack] 读取 profile 依赖失败:', manifestPath, error)
  }
}

/**
 * 列出待扫描的 profile 目录：优先用启动本进程的 profile，宿主未提供时回退到全部 profile。
 * @param currentProfileDir 宿主报告的当前 profile 目录
 * @returns 待扫描目录
 */
export async function resolveProfileDirs(currentProfileDir?: string): Promise<string[]> {
  if (currentProfileDir !== undefined && currentProfileDir !== '') return [currentProfileDir]

  const profilesRoot = join(resolveDshHome(), 'profiles')
  try {
    const profiles = await readdir(profilesRoot, { withFileTypes: true })

    return profiles
      // 顶层 node_modules 是各 profile 的共享依赖目录，不是 profile
      .filter((profile) => profile.isDirectory() && profile.name !== 'node_modules')
      .map((profile) => join(profilesRoot, profile.name))
  } catch (error) {
    // 没有 profile 目录说明当前是 headless 或尚未安装插件，按空处理
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    console.error('[power-pack] 读取 profile 目录失败:', profilesRoot, error)
    return []
  }
}

/**
 * 扫描 profile 中已启用的插件包。
 * @param currentProfileDir 宿主报告的当前 profile 目录；缺省时扫描全部 profile
 * @returns 去重后的插件包名，按字母排序
 */
export async function findInstalledPlugins(currentProfileDir?: string): Promise<string[]> {
  const names = new Set<string>()

  for (const dir of await resolveProfileDirs(currentProfileDir)) {
    await collectProfilePlugins(dir, names)
  }

  return [...names].sort((left, right) => left.localeCompare(right))
}

/**
 * 生成编辑页的插件清单。
 * @param currentProfileDir 宿主报告的当前 profile 目录；缺省时扫描全部 profile
 * @returns 标准项在前、已装插件在后
 */
export async function listPluginCatalog(currentProfileDir?: string): Promise<{
  standard: StandardPluginItem[]
  installed: InstalledPluginItem[]
}> {
  const installed = (await findInstalledPlugins(currentProfileDir)).map<InstalledPluginItem>(
    (packageName) => ({
      id: `pkg:${packageName}`,
      label: packageName,
      description: '已在 profile 中全局加载。勾选表示保留在技能包会话里，取消勾选会屏蔽它的工具与提示词注入。',
      kind: 'installed',
      packageName,
    }),
  )

  return { standard: STANDARD_PLUGIN_ITEMS, installed }
}

/**
 * 把清单转成客户端可渲染的条目，不暴露组合行细节。
 * @param currentProfileDir 宿主报告的当前 profile 目录；缺省时扫描全部 profile
 * @returns 扁平化的插件条目
 */
export async function listPluginItems(currentProfileDir?: string): Promise<PluginCatalogItem[]> {
  const { standard, installed } = await listPluginCatalog(currentProfileDir)

  return [
    ...standard.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
    ...installed.map(({ id, label, description, kind }) => ({ id, label, description, kind })),
  ]
}
