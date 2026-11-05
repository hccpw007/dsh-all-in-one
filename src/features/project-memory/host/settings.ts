/**
 * 「项目记忆」的设置持久化。
 *
 * 设置放在 `$DSH_HOME/all-in-one/project-memory.json`：它属于用户级配置，
 * 不写进 profile 的 patch，升级或切换 bundle 时不会被覆盖。
 *
 * 提示词注入在每次装配时都要读设置，因此读取结果按文件 mtime 缓存，
 * 开关与路径变更后下一次装配即可生效。
 */
import { join } from 'node:path'

import { createJsonSettingsStore } from '../../../common/json-settings'
import { resolveDshHome } from '../../../common/dsh-home'
import type { MemorySettings } from '../types'

/** 设置文件的默认内容：默认关闭，根目录使用插件默认目录。 */
const DEFAULT_SETTINGS: MemorySettings = { enabled: false, root: '' }

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

/** 设置存储：提示词每次装配都要读，读取结果按文件状态缓存。 */
const store = createJsonSettingsStore<MemorySettings>({
  file: memorySettingsFile,
  normalize: normalizeSettings,
  defaults: () => ({ ...DEFAULT_SETTINGS }),
  label: '[project-memory]',
})

/**
 * 读取设置；文件不存在时返回默认值。
 * @returns 当前设置
 */
export function readMemorySettings(): MemorySettings {
  return store.read()
}

/**
 * 原子写入设置。
 * @param next 新设置
 */
export function writeMemorySettings(next: MemorySettings): void {
  store.write(next)
}
