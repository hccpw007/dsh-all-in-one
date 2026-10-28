/**
 * 会话的派生记录清理。
 *
 * 删除会话时，除了会话目录本身，宿主还在 `storages` 下派生了两类记录：
 *   - `session_projcache/sessions/<会话>.json`：标题、统计等投影缓存，
 *     它保存着会话标题与消息规模，属于需要一起清掉的元数据；
 *   - `workspace.json`：工作区的会话排序、归档与置顶集合，只保存会话 id。
 *
 * 搜索索引不在这里处理：`session-query` 每次查询前都与磁盘对比并自行删掉
 * 已消失的会话，重复实现只会和它抢同一份状态。
 */
import type { Stats } from 'node:fs'

import { readFile, rename, rm, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** 工作区注册表文件：保存工作区顺序、归档集合与各工作区的会话顺序。 */
const WORKSPACE_STORAGE_PATH = ['storages', 'workspace.json']

/** 工作区注册表里按会话 id 记录的三处列表。 */
const GLOBAL_SESSION_LISTS = ['archivedSessionIds', 'pinnedSessionIds']

/**
 * 判断错误是否为「文件不存在」。
 * @param error 捕获到的错误
 * @returns 只有 ENOENT 返回 true
 */
function isEnoent(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === 'ENOENT'
}

/**
 * 判断值是否为可索引的普通对象。
 * @param value 待判定值
 * @returns 是对象且非 null 时返回 true
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 从 id 列表中删掉指定会话。
 * @param value 待处理列表，可能缺失或形状不对
 * @param sessionId 会话标识
 * @returns 处理后的列表与是否真的删掉了元素
 */
function dropId(value: unknown, sessionId: string): { list: unknown; removed: boolean } {
  if (!Array.isArray(value)) return { list: value, removed: false }

  const next = value.filter((item) => item !== sessionId)
  return { list: next, removed: next.length !== value.length }
}

/**
 * 删除该会话的投影缓存记录。
 *
 * 记录文件名有两种历史写法：`session-<uuid>.json` 与只留 `<uuid>.json`，
 * 两种都要尝试，避免旧记录继续留在磁盘上。
 * @param dshHome DSH 主目录
 * @param sessionId 会话标识
 * @returns 删除的记录数
 */
async function forgetProjectionCache(dshHome: string, sessionId: string): Promise<number> {
  const dir = join(dshHome, 'storages', 'session_projcache', 'sessions')
  const plainId = sessionId.replace(/^session-/, '')
  const candidates = new Set([`${sessionId}.json`, `${plainId}.json`])
  let removed = 0

  for (const name of candidates) {
    try {
      await unlink(join(dir, name))
      removed += 1
    } catch (error) {
      // 没有这条缓存属正常情况（例如会话刚创建、尚未写入检查点）
      if (isEnoent(error)) continue

      console.error('[delete-session] 删除投影缓存失败:', name, error)
      throw error
    }
  }

  return removed
}

/**
 * 从工作区注册表里摘掉该会话的 id。
 *
 * 注册表由宿主进程持有：它在归档、置顶、排序变更时整体重写。这里先读出文件、
 * 就地删掉 id，再确认文件在读写之间没有被宿主改写，最后用临时文件加 rename
 * 原子替换；一旦发现文件已被改写就跳过，宁可留下无害的 id，也不覆盖宿主的
 * 新状态。任何一步失败都不会让删除请求失败——会话正文已经删掉了。
 * @param dshHome DSH 主目录
 * @param sessionId 会话标识
 * @returns 清理掉的列表项数量
 */
async function forgetWorkspaceAccount(dshHome: string, sessionId: string): Promise<number> {
  const file = join(dshHome, ...WORKSPACE_STORAGE_PATH)
  let before: Stats

  try {
    before = await stat(file)
  } catch (error) {
    if (isEnoent(error)) return 0

    console.error('[delete-session] 读取工作区注册表状态失败:', error)
    throw error
  }

  let document: unknown

  try {
    document = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    console.error('[delete-session] 解析工作区注册表失败:', file, error)
    return 0
  }

  if (!isRecord(document)) {
    console.warn('[delete-session] 工作区注册表结构不是对象，跳过清理:', file)
    return 0
  }

  let removed = 0

  const global = isRecord(document['global']) ? document['global'] : undefined
  if (global !== undefined) {
    for (const key of GLOBAL_SESSION_LISTS) {
      const result = dropId(global[key], sessionId)
      if (!result.removed) continue

      global[key] = result.list
      removed += 1
    }
  }

  const tables = isRecord(document['tables']) ? document['tables'] : undefined
  const workspaces = tables !== undefined && isRecord(tables['workspaces']) ? tables['workspaces'] : undefined
  if (workspaces !== undefined) {
    for (const record of Object.values(workspaces)) {
      if (!isRecord(record)) continue

      const result = dropId(record['sessionIds'], sessionId)
      if (!result.removed) continue

      record['sessionIds'] = result.list
      removed += 1
    }
  }

  if (removed === 0) return 0

  const after = await stat(file)
  if (after.mtimeMs !== before.mtimeMs || after.size !== before.size) {
    console.warn('[delete-session] 工作区注册表刚被宿主改写，跳过本次清理:', file)
    return 0
  }

  const temporary = `${file}.${process.pid}.tmp`

  try {
    await writeFile(temporary, `${JSON.stringify(document, null, 2)}\n`, {
      encoding: 'utf8',
      mode: before.mode,
    })
    await rename(temporary, file)
  } catch (error) {
    console.error('[delete-session] 写回工作区注册表失败:', file, error)
    await rm(temporary, { force: true })
    return 0
  }

  return removed
}

/**
 * 清理该会话的全部派生记录。
 * @param dshHome DSH 主目录
 * @param sessionId 会话标识
 * @returns 清理掉的记录数
 */
export async function forgetSessionRecords(dshHome: string, sessionId: string): Promise<number> {
  const cache = await forgetProjectionCache(dshHome, sessionId)
  const account = await forgetWorkspaceAccount(dshHome, sessionId)

  return cache + account
}
