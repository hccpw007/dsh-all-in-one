/**
 * 已装插件的工具归属扫描。
 *
 * 全局工具表只有名字，没有「谁注册的」。要按技能包屏蔽某个插件的工具，必须先把
 * 名字归到插件上：包名前缀能覆盖大多数约定，剩下的再按构建产物里的字符串字面量与
 * 已知工具名求交。两者都只做保守匹配，宁可漏判也不误伤其他插件的工具。
 *
 * 扫描成本 ≈ 文件总字节 × 候选名数，必须控制在毫秒级：预算在读取之前判断，
 * 单文件只读头部窗口，候选名合并成一条正则一次扫完。
 */
import { open, readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { logPerf } from '../../../common/perf'
import { resolveProfileDirs } from './catalog'
import { createReadCache } from './read-cache'

/** 静态扫描预算：插件包体积差异很大，按文件数与字节数双重限制。 */
const SCAN_MAX_FILES = 120
const SCAN_MAX_BYTES = 4 * 1024 * 1024

/** 单个文件最多读取的字节数；只读头部，避免把 6.7MB 级 bundle 整个读进内存。 */
const SCAN_MAX_FILE_BYTES = 512 * 1024

/** 只扫描这些后缀的构建产物；源码与 Source Map 不含运行时名字。 */
const SCAN_SUFFIXES = ['.js', '.mjs', '.cjs']

/** 一条正则可容纳的候选名数；过长的 alternation 会让 JS 引擎构建匹配状态变慢。 */
const MATCH_CHUNK_SIZE = 100

/** 归属扫描结果缓存时长：插件产物在进程生命周期内不会变化。 */
const OWNED_TOOLS_TTL_MS = 30_000

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

/** 转义正则元字符；工具名理论上只含安全字符，这里仍按不可信输入处理。 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 把候选名编译成按块分组的一次性匹配函数。
 *
 * 此前对每个候选名做一次全文 `includes`，成本是「字节数 × 名字数」；这里把名字
 * 合成 alternation，每个文件只扫一遍（400 个名字时相当于 4 次正则遍历，而不是 400 次）。
 * 名字按长度倒序排列，让长名优先命中，避免短名把长名吃掉。
 * @param names 候选工具名
 * @returns 把命中的名字写入集合的函数
 */
function buildMatcher(names: string[]): (text: string, owned: Set<string>) => void {
  const ordered = [...names].sort((left, right) => right.length - left.length)
  const patterns: RegExp[] = []

  for (let offset = 0; offset < ordered.length; offset += MATCH_CHUNK_SIZE) {
    const chunk = ordered.slice(offset, offset + MATCH_CHUNK_SIZE).map(escapeRegExp)
    patterns.push(new RegExp(chunk.join('|'), 'g'))
  }

  return (text, owned) => {
    for (const pattern of patterns) {
      pattern.lastIndex = 0

      for (let match = pattern.exec(text); match !== null; match = pattern.exec(text)) {
        owned.add(match[0])
      }
    }
  }
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
  const match = buildMatcher(candidates)
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
      // 预算判断在读取之前：超限后不再打开任何文件，外层也直接停止
      if (files >= SCAN_MAX_FILES || bytes >= SCAN_MAX_BYTES) break
      if (!entry.isFile()) continue
      if (!SCAN_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) continue

      const file = join(entry.parentPath ?? root, entry.name)

      try {
        const info = await stat(file)
        if (!info.isFile() || info.size === 0) continue

        // 单文件预算只读头部窗口；剩余总预算不足时读多少算多少
        const limit = Math.min(info.size, SCAN_MAX_FILE_BYTES, SCAN_MAX_BYTES - bytes)
        if (limit <= 0) break

        const handle = await open(file, 'r')
        let text = ''

        try {
          const buffer = Buffer.allocUnsafe(limit)
          const { bytesRead } = await handle.read(buffer, 0, limit, 0)
          files += 1
          bytes += bytesRead
          text = buffer.subarray(0, bytesRead).toString('utf8')
        } finally {
          await handle.close()
        }

        match(text, owned)
      } catch (error) {
        console.error('[power-pack] 读取插件产物失败:', file, error)
      }
    }
  }

  return [...owned]
}

/** 归属扫描结果的读取缓存，键为 profile × 包名 × 候选名。 */
const ownedToolsCache = createReadCache<string[]>(OWNED_TOOLS_TTL_MS)

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

  const scanned = remaining.length === 0
    ? []
    : await ownedToolsCache.read(
      `${profileDir ?? '*'}\n${packageName}\n${remaining.join('\n')}`,
      async () => {
        const startedAt = performance.now()
        const roots: string[] = []
        for (const dir of await resolveProfileDirs(profileDir)) {
          roots.push(...await resolveScanRoots(join(dir, 'node_modules', packageName), packageName))
        }

        const found = await scanOwnedTools(roots, remaining)
        logPerf('ownedTools', startedAt, {
          package: packageName,
          roots: roots.length,
          candidates: remaining.length,
          matches: found.length,
        })

        return found
      },
    )

  return [...new Set([...byPrefix, ...scanned])].sort((left, right) => left.localeCompare(right))
}
