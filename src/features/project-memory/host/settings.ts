/**
 * 「项目记忆」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/project-memory.json`：它属于用户级配置，
 * 不写进 profile 的 patch，升级或切换 bundle 时不会被覆盖。
 *
 * 提示词注入在每次装配时都要读设置，因此读取结果按文件 mtime 缓存，
 * 开关与路径变更后下一次装配即可生效。
 */
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import type { MemorySettings } from '../types'

/** 设置文件的默认内容：默认关闭，根目录使用插件默认目录。 */
const DEFAULT_SETTINGS: MemorySettings = { enabled: false, root: '' }

/** 缓存的解析结果，与文件的 mtime、大小一并记录，文件未变时直接复用。 */
interface SettingsCache {
  mtimeMs: number
  size: number
  value: MemorySettings
}

let cache: SettingsCache | undefined

/**
 * 设置文件路径。
 * @returns `$DSH_HOME/all-in-one/project-memory.json`
 */
export function memorySettingsFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'project-memory.json')
}

/**
 * 校验并补全设置文档；字段类型不对时回退默认值，避免损坏文件让功能整体失效。
 * @param value 解析后的 JSON
 * @returns 规范化后的设置
 */
function normalizeSettings(value: unknown): MemorySettings {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_SETTINGS }

  const candidate = value as { enabled?: unknown; root?: unknown }

  return {
    enabled: candidate.enabled === true,
    root: typeof candidate.root === 'string' ? candidate.root : '',
  }
}

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readMemorySettings(): MemorySettings {
  const file = memorySettingsFile()

  try {
    const info = statSync(file)
    if (cache !== undefined && cache.mtimeMs === info.mtimeMs && cache.size === info.size) {
      return cache.value
    }

    const value = normalizeSettings(JSON.parse(readFileSync(file, 'utf8')) as unknown)
    cache = { mtimeMs: info.mtimeMs, size: info.size, value }

    return value
  } catch (error) {
    // 首次运行时文件不存在是正常情况，按默认关闭处理
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 读取记忆设置失败:', file, error)
    }

    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * 原子写入设置：先写临时文件再改名，避免写入中断留下半份配置。
 * @param next 新设置
 */
export function writeMemorySettings(next: MemorySettings): void {
  const file = memorySettingsFile()
  const temp = `${file}.tmp`

  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
    renameSync(temp, file)
    // 文件已被替换，缓存失效；下一次读取会重新解析
    cache = undefined
  } catch (error) {
    console.error('[project-memory] 写入记忆设置失败:', file, error)
    throw error
  }
}
