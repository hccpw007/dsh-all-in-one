/**
 * 会话的派生记录清理。
 *
 * 删除会话时，除了会话目录本身，宿主还在 `storages` 下派生了两类记录：
 *   - `session_projcache/sessions/<会话>.json`：标题、统计等投影缓存，
 *     它保存着会话标题与消息规模，属于需要一起清掉的元数据；
 *   - `workspace.json`：工作区的会话排序、归档与置顶集合，只保存会话 id。
 *
 * 批量删除时工作区注册表只读一次、写一次：此前每条会话都全量读改写整份文件，
 * 成本随「会话数 × 文件大小」增长（实测 300 条 × 10,000 id 需要 1.1 秒）。
 *
 * 搜索索引不在这里处理：`session-query` 每次查询前都与磁盘对比并自行删掉
 * 已消失的会话，重复实现只会和它抢同一份状态。
 */
import { randomBytes } from 'node:crypto'
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
 * 从 id 列表中删掉给定会话，并按会话统计删除次数。
 * @param value 待处理列表，可能缺失或形状不对
 * @param sessionIds 要删除的会话集合
 * @param counts 按会话累计的删除项数
 * @returns 处理后的列表与是否真的删掉了元素
 */
function dropIds(
  value: unknown,
  sessionIds: ReadonlySet<string>,
  counts: Map<string, number>,
): { list: unknown; removed: boolean } {
  if (!Array.isArray(value)) return { list: value, removed: false }

  const next: unknown[] = []
  let removed = false

  for (const item of value) {
    if (typeof item === 'string' && sessionIds.has(item)) {
      removed = true
      counts.set(item, (counts.get(item) ?? 0) + 1)
      continue
    }

    next.push(item)
  }

  return { list: next, removed }
}

/**
 * 批量删除投影缓存记录。
 *
 * 记录文件名有两种历史写法：`session-<uuid>.json` 与只留 `<uuid>.json`，
 * 两种都要尝试，避免旧记录继续留在磁盘上。
 * @param dshHome DSH 主目录
 * @param sessionIds 会话标识集合
 * @returns 每个会话删掉的记录数
 */
async function forgetProjectionCaches(
  dshHome: string,
  sessionIds: ReadonlySet<string>,
): Promise<Map<string, number>> {
  const dir = join(dshHome, 'storages', 'session_projcache', 'sessions')
  const counts = new Map<string, number>()

  await Promise.all(
    [...sessionIds].map(async (sessionId) => {
      const plainId = sessionId.replace(/^session-/, '')
      const candidates = new Set([`${sessionId}.json`, `${plainId}.json`])

      for (const name of candidates) {
        try {
          await unlink(join(dir, name))
          counts.set(sessionId, (counts.get(sessionId) ?? 0) + 1)
        } catch (error) {
          // 没有这条缓存属正常情况（例如会话刚创建、尚未写入检查点）
          if (isEnoent(error)) continue

          // 单条缓存删不掉不应中断整批删除：会话正文已经处理过，留下日志即可
          console.error('[delete-session] 删除投影缓存失败:', name, error)
        }
      }
    }),
  )

  return counts
}

/**
 * 批量从工作区注册表里摘掉会话 id。
 *
 * 注册表由宿主进程持有：它在归档、置顶、排序变更时整体重写。这里只读一次文件、
 * 删掉全部目标 id、写一次临时文件；写 temp 之后再确认目标文件在读写之间没有被宿主
 * 改写，最后原子替换。一旦发现文件已被改写就放弃本次清理，宁可留下无害的 id，
 * 也不覆盖宿主的新状态。
 * @param dshHome DSH 主目录
 * @param sessionIds 会话标识集合
 * @returns 每条会话清理掉的列表项数量
 */
async function forgetWorkspaceAccounts(
  dshHome: string,
  sessionIds: ReadonlySet<string>,
): Promise<Map<string, number>> {
  const counts = new Map<string, number>()
  const file = join(dshHome, ...WORKSPACE_STORAGE_PATH)
  let before: Stats

  try {
    before = await stat(file)
  } catch (error) {
    if (isEnoent(error)) return counts

    console.error('[delete-session] 读取工作区注册表状态失败:', error)
    throw error
  }

  let document: unknown

  try {
    document = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    console.error('[delete-session] 解析工作区注册表失败:', file, error)
    return counts
  }

  if (!isRecord(document)) {
    console.warn('[delete-session] 工作区注册表结构不是对象，跳过清理:', file)
    return counts
  }

  let removed = 0

  const global = isRecord(document['global']) ? document['global'] : undefined
  if (global !== undefined) {
    for (const key of GLOBAL_SESSION_LISTS) {
      const result = dropIds(global[key], sessionIds, counts)
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

      const result = dropIds(record['sessionIds'], sessionIds, counts)
      if (!result.removed) continue

      record['sessionIds'] = result.list
      removed += 1
    }
  }

  if (removed === 0) return counts

  const temporary = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`

  try {
    await writeFile(temporary, `${JSON.stringify(document, null, 2)}\n`, {
      encoding: 'utf8',
      mode: before.mode,
    })

    // 写入 temp 之后再核对一次：把「宿主在本次读写之间改过文件」的窗口压到最小
    const latest = await stat(file)
    if (latest.mtimeMs !== before.mtimeMs || latest.size !== before.size) {
      console.warn('[delete-session] 工作区注册表刚被宿主改写，跳过本次清理:', file)
      await rm(temporary, { force: true })

      return new Map()
    }

    await rename(temporary, file)
  } catch (error) {
    console.error('[delete-session] 写回工作区注册表失败:', file, error)
    await rm(temporary, { force: true })

    return new Map()
  }

  return counts
}

/**
 * 清理一批会话的派生记录。
 * @param dshHome DSH 主目录
 * @param sessionIds 会话标识集合
 * @returns 每条会话清理掉的记录数
 */
export async function forgetSessionRecordsBatch(
  dshHome: string,
  sessionIds: ReadonlySet<string>,
): Promise<Map<string, number>> {
  const caches = await forgetProjectionCaches(dshHome, sessionIds)
  // 工作区清理失败不应让已完成的投影缓存清理回滚；沿用「只记日志」的旧约定
  let accounts = new Map<string, number>()
  try {
    accounts = await forgetWorkspaceAccounts(dshHome, sessionIds)
  } catch (error) {
    console.error('[delete-session] 清理工作区注册表失败:', error)
  }

  const merged = new Map(caches)
  for (const [sessionId, count] of accounts) {
    merged.set(sessionId, (merged.get(sessionId) ?? 0) + count)
  }

  return merged
}

/**
 * 清理一个会话的全部派生记录。
 * @param dshHome DSH 主目录
 * @param sessionId 会话标识
 * @returns 清理掉的记录数
 */
export async function forgetSessionRecords(dshHome: string, sessionId: string): Promise<number> {
  const counts = await forgetSessionRecordsBatch(dshHome, new Set([sessionId]))

  return counts.get(sessionId) ?? 0
}
