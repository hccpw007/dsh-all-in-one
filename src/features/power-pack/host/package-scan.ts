/**
 * 已装插件的工具归属扫描。
 *
 * 全局工具表只有名字，没有「谁注册的」。要按技能包屏蔽某个插件的工具，必须先把
 * 名字归到插件上：包名前缀能覆盖大多数约定，剩下的再按构建产物里的字符串字面量与
 * 已知工具名求交。两者都只做保守匹配，宁可漏判也不误伤其他插件的工具。
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { resolveProfileDirs } from './catalog'

/** 静态扫描预算：插件包体积差异很大，按文件数与字节数双重限制。 */
const SCAN_MAX_FILES = 120
const SCAN_MAX_BYTES = 4 * 1024 * 1024
const SCAN_MAX_FILE_BYTES = 512 * 1024

/** 只扫描这些后缀的构建产物；源码与 Source Map 不含运行时名字。 */
const SCAN_SUFFIXES = ['.js', '.mjs', '.cjs']

/**
 * 由包名派生可能的工具名前缀。
 *
 * 插件注册的工具通常以包名或去前缀的短名开头（如 `dsh-purge` → `purge_status`），
 * 短横线与下划线两种写法都要试，因为工具名只能用下划线。
 * @param packageName 插件包名
 * @returns 去重后的前缀候选
 */
function toolPrefixes(packageName: string): string[] {
  const short = packageName.replace(/^dsh-plugin-/, '').replace(/^dsh-/, '')
  const candidates = [packageName, short, short.replace(/-/g, '_'), short.replace(/_/g, '-')]

  return [...new Set(candidates.filter((item) => item !== ''))]
}

/**
 * 判断工具名是否以某个前缀开头（整名相等也算）。
 * @param name 工具名
 * @param prefixes 前缀候选
 * @returns 命中时返回 true
 */
function hasPrefix(name: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => name === prefix || name.startsWith(`${prefix}_`) || name.startsWith(`${prefix}-`) || name.startsWith(`${prefix}.`),
  )
}

/**
 * 在包目录里定位参与运行的构建产物目录。
 * @param dir 包目录
 * @param packageName 包名，用于产出候选路径
 * @returns 已存在的扫描根目录
 */
async function resolveScanRoots(dir: string, packageName: string): Promise<string[]> {
  const roots = new Set<string>([join(dir, 'lib'), join(dir, 'dist')])

  try {
    const manifest = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8')) as { main?: unknown }
    if (typeof manifest.main === 'string' && manifest.main !== '') {
      roots.add(join(dir, manifest.main.replace(/\/[^/]+$/, '')))
    }
  } catch (error) {
    // 缺少或损坏 package.json 时回退到约定目录，仍可能扫到构建产物
    console.error('[power-pack] 读取插件清单失败:', packageName, error)
  }

  const existing: string[] = []
  for (const root of roots) {
    try {
      await readdir(root)
      existing.push(root)
    } catch (error) {
      // 目录不存在是常态：不同插件用不同产物布局
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('[power-pack] 读取插件产物目录失败:', root, error)
      }
    }
  }

  return existing
}

/**
 * 把一组构建产物里的字符串字面量候选与已知工具名求交。
 *
 * 不做语法解析：构建产物布局千差万别，用「文件里出现过这个已知工具名」判断
 * 归属已足够——工具名本身是唯一的，交集再小也不会误伤别的插件。
 * @param roots 扫描根目录
 * @param candidates 已知全局工具名
 * @returns 归属该插件的工具名
 */
async function scanOwnedTools(roots: string[], candidates: string[]): Promise<string[]> {
  if (roots.length === 0 || candidates.length === 0) return []

  const owned = new Set<string>()
  let files = 0
  let bytes = 0

  for (const root of roots) {
    let entries
    try {
      entries = await readdir(root, { recursive: true, withFileTypes: true })
    } catch (error) {
      console.error('[power-pack] 递归读取插件产物失败:', root, error)
      continue
    }

    for (const entry of entries) {
      if (files >= SCAN_MAX_FILES || bytes >= SCAN_MAX_BYTES) break
      if (!entry.isFile()) continue
      if (!SCAN_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) continue

      const file = join(entry.parentPath ?? root, entry.name)
      try {
        const text = await readFile(file, { encoding: 'utf8' })
        files += 1
        bytes += text.length
        if (text.length > SCAN_MAX_FILE_BYTES) continue

        for (const name of candidates) {
          if (!owned.has(name) && text.includes(name)) owned.add(name)
        }
      } catch (error) {
        console.error('[power-pack] 读取插件产物失败:', file, error)
      }
    }
  }

  return [...owned]
}

/**
 * 枚举一个已装插件在全局层注册的工具。
 * @param packageName 插件包名
 * @param globalNames 全局工具名
 * @param profileDir 当前 profile 目录；缺省时扫描全部 profile
 * @returns 归属该插件的工具名
 */
export async function ownedTools(
  packageName: string,
  globalNames: string[],
  profileDir?: string,
): Promise<string[]> {
  const prefixes = toolPrefixes(packageName)
  const byPrefix = globalNames.filter((name) => hasPrefix(name, prefixes))
  // 前缀已覆盖的工具不必再扫产物，减少编辑页打开时的磁盘读取
  const remaining = globalNames.filter((name) => !byPrefix.includes(name))

  const roots: string[] = []
  for (const dir of await resolveProfileDirs(profileDir)) {
    roots.push(...await resolveScanRoots(join(dir, 'node_modules', packageName), packageName))
  }

  const scanned = await scanOwnedTools(roots, remaining)

  return [...new Set([...byPrefix, ...scanned])].sort((left, right) => left.localeCompare(right))
}

