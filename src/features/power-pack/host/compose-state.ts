/**
 * 「技能包 + 模式」组合的持久化记录。
 *
 * 组合预设只存在于宿主内存：dsh 重启后注册表为空，而会话里记录的是当时选中的
 * 组合预设 id，恢复会话会因为找不到该预设而失败。这里按使用顺序记下生成过的
 * 组合，插件启动时据此重建同名预设，让旧会话重新可恢复。
 *
 * 数据存放在 `$DSH_HOME/all-in-one/compose-state.json`：它属于本机运行状态，
 * 不写进技能包文档，避免影响可编辑配置的格式。
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { ComposedSelection } from '../types'

import { resolveDshHome } from '../../../common/dsh-home'
import { isValidPackId } from './store'

/** 记录文件的结构版本。 */
const STATE_VERSION = 1

/** 保留的组合上限：超出后丢弃最久未用的一条，避免文件无限增长。 */
const MAX_RECENT = 24

/**
 * 记录文件路径。
 * @returns `$DSH_HOME/all-in-one/compose-state.json`
 */
function composeStateFile(): string {
  return join(resolveDshHome(), 'all-in-one', 'compose-state.json')
}

/** 收窄一条组合记录，字段非法时返回 undefined。 */
function normalizeSelection(value: unknown): ComposedSelection | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { pack?: unknown; mode?: unknown }
  const pack = typeof candidate.pack === 'string' ? candidate.pack.trim() : ''
  const mode = typeof candidate.mode === 'string' ? candidate.mode.trim() : ''
  if (!isValidPackId(pack) || mode === '') return undefined

  return { pack, mode }
}

/**
 * 读取记录过的组合，按最近使用排序。
 * @returns 组合列表；文件缺失或损坏时返回空列表
 */
export async function readComposeState(): Promise<ComposedSelection[]> {
  const file = composeStateFile()

  try {
    const raw = await readFile(file, 'utf8')
    const parsed = JSON.parse(raw) as { recent?: unknown }
    const list = Array.isArray(parsed.recent) ? parsed.recent : []

    const seen = new Set<string>()
    const result: ComposedSelection[] = []
    for (const item of list) {
      const selection = normalizeSelection(item)
      if (selection === undefined) continue

      // 同一组合只保留第一次出现（即最近一次）的位置
      const key = `${selection.pack}@${selection.mode}`
      if (seen.has(key)) continue
      seen.add(key)
      result.push(selection)
    }

    return result
  } catch (error) {
    // 首次运行时文件不存在是正常情况；其它读取错误留下日志但仍按空记录处理
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[power-pack] 读取组合记录失败:', file, error)
    }
    return []
  }
}

/**
 * 原子写入组合记录：先写临时文件再改名，避免中断留下半份文件。
 * @param recent 组合列表，按最近使用排序
 */
export async function writeComposeState(recent: ComposedSelection[]): Promise<void> {
  const file = composeStateFile()
  const temp = `${file}.tmp`
  const document = { version: STATE_VERSION, recent: recent.slice(0, MAX_RECENT) }

  try {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(temp, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
    await rename(temp, file)
  } catch (error) {
    console.error('[power-pack] 写入组合记录失败:', file, error)
  }
}

/**
 * 记下一次成功注册的组合：置于队首并去重。
 * @param packId 技能包标识
 * @param modeId 模式预设标识
 */
export async function rememberComposed(packId: string, modeId: string): Promise<void> {
  const recent = await readComposeState()
  const key = `${packId}@${modeId}`
  const rest = recent.filter((item) => `${item.pack}@${item.mode}` !== key)

  await writeComposeState([{ pack: packId, mode: modeId }, ...rest])
}

/**
 * 技能包被删除后清掉它的全部组合记录。
 * @param packId 技能包标识
 */
export async function forgetComposedPack(packId: string): Promise<void> {
  const recent = await readComposeState()
  const kept = recent.filter((item) => item.pack !== packId)
  if (kept.length === recent.length) return

  await writeComposeState(kept)
}
