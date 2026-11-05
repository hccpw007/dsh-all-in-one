/**
 * 会话删除。
 *
 * 宿主只提供归档（把会话 id 记进归档集合），不提供删除，因此这里直接按宿主
 * 的存储布局删掉两处内容：
 *   - 会话目录 `$DSH_HOME/sessions/<项目 slug>/session-<uuid>/`，对话正文在此；
 *   - 该会话的派生记录（投影缓存、工作区排序与归档集合），见 session-records。
 *
 * 目录名来自会话 id，必须先按宿主的 id 形状校验，避免请求把路径带到别处。
 *
 * 批量删除先把全部项目目录各列一次、建立「会话 → 目录」映射，再并发删目录，
 * 最后一次性清理派生记录：复杂度从「N 会话 × P 项目次 stat + N 次全量读改写」
 * 降到「P 次 readdir + N 次删除 + 一次读改写」。
 */
import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { logPerf } from '../../../common/perf'
import { forgetSessionRecords, forgetSessionRecordsBatch } from './session-records'

/** 会话标识语法：宿主一律用 `session-<uuid>` 作为目录名。 */
const SESSION_ID_PATTERN = /^session-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/** 批量删除目录时的并发上限：磁盘删除是 I/O 密集操作，并发过高反而互相拖慢。 */
const REMOVE_CONCURRENCY = 6

/**
 * 判断会话标识是否合法。
 * @param value 请求带来的原始值
 * @returns 只有宿主认可的 id 形状返回 true
 */
export function isValidSessionId(value: unknown): value is string {
  return typeof value === 'string' && SESSION_ID_PATTERN.test(value)
}

/**
 * 以有限并发执行一组任务。
 * @param items 待处理项
 * @param limit 并发上限
 * @param worker 单项处理函数
 * @returns 与输入顺序一致的结果
 */
async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array<R>(items.length)
  let cursor = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) return

      results[index] = await worker(items[index])
    }
  })

  await Promise.all(runners)

  return results
}

/**
 * 找出这些会话在磁盘上的全部目录。
 *
 * 项目 slug 由会话的 cwd 推出，同一会话正常只有一个目录；工作目录改名后可能
 * 留下旧 slug 下的残留，因此每个项目目录都列一次并全量核对，全部命中都算。
 * @param sessionIds 已校验的会话标识集合
 * @returns 会话标识到目录列表的映射
 */
async function listSessionDirs(sessionIds: ReadonlySet<string>): Promise<Map<string, string[]>> {
  const root = join(resolveDshHome(), 'sessions')
  const found = new Map<string, string[]>()
  if (sessionIds.size === 0) return found

  let projects: string[]

  try {
    const entries = await readdir(root, { withFileTypes: true })
    projects = entries.filter((entry) => entry.isDirectory()).map((entry) => join(root, entry.name))
  } catch (error) {
    console.error('[delete-session] 枚举会话根目录失败:', error)
    throw error
  }

  await mapWithConcurrency(projects, REMOVE_CONCURRENCY, async (project) => {
    let entries

    try {
      entries = await readdir(project, { withFileTypes: true })
    } catch (error) {
      // 项目目录可能在 Host 启动后已被移除，ENOENT 属正常情况
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return

      console.error('[delete-session] 读取项目目录失败:', project, error)
      throw error
    }

    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
      if (!sessionIds.has(entry.name)) continue

      const list = found.get(entry.name) ?? []
      list.push(join(project, entry.name))
      found.set(entry.name, list)
    }
  })

  return found
}

/**
 * 删除结果：会话正文与派生记录分开计数，便于路由判断这条会话是否真的存在过。
 */
interface DeletedSessionReport {
  /** 删掉的会话目录数量。 */
  directories: number
  /** 清掉的索引与缓存记录数量。 */
  records: number
}

/**
 * 删除一个会话的全部本地记录。
 *
 * 先删会话目录（正文在这个目录里），再清投影缓存与工作区账号这两份派生记录；
 * 派生记录清理失败只记日志，不让已经完成的正文删除被判定为失败。
 * @param sessionId 已校验的会话标识
 * @returns 删除与清理的数量；两者都是 0 表示磁盘上没有这条会话
 */
export async function deleteStoredSession(sessionId: string): Promise<DeletedSessionReport> {
  const startedAt = performance.now()
  const dirs = (await listSessionDirs(new Set([sessionId]))).get(sessionId) ?? []

  for (const dir of dirs) {
    try {
      await rm(dir, { recursive: true, force: true })
    } catch (error) {
      console.error('[delete-session] 删除会话目录失败:', dir, error)
      throw error
    }
  }

  let records = 0
  try {
    records = await forgetSessionRecords(resolveDshHome(), sessionId)
  } catch (error) {
    console.error('[delete-session] 清理会话派生记录失败:', sessionId, error)
  }

  logPerf('deleteStoredSession', startedAt, { directories: dirs.length, records })
  if (dirs.length > 0) console.info('[delete-session] 已删除会话:', sessionId, dirs.length, records)

  return { directories: dirs.length, records }
}

/** 批量删除结果：成功与失败的会话分开返回。 */
export interface DeletedSessionsReport {
  /** 已删除的会话标识。 */
  deleted: string[]
  /** 删除失败的会话与原因。 */
  failed: Array<{ sessionId: string; error: string }>
}

/**
 * 批量删除一个工作区里的多个会话。
 *
 * 目录删除并发执行（上限 6），派生记录一次读改写；单条失败只记入报告，
 * 不影响其余会话。工作区注册表的串行写入仍由本函数保证：整批只有一次写入。
 * @param sessionIds 已校验的会话标识列表
 * @returns 成功与失败的会话
 */
export async function deleteStoredSessions(sessionIds: string[]): Promise<DeletedSessionsReport> {
  const startedAt = performance.now()
  // 重复 id 只处理一次：客户端可能把同一会话算进多个入口
  const wanted = [...new Set(sessionIds)]
  const dirsById = await listSessionDirs(new Set(wanted))

  /** 目录删除失败的会话及原因；失败的会话不再清理派生记录。 */
  const failures = new Map<string, string>()

  await mapWithConcurrency(wanted, REMOVE_CONCURRENCY, async (sessionId) => {
    for (const dir of dirsById.get(sessionId) ?? []) {
      try {
        await rm(dir, { recursive: true, force: true })
      } catch (error) {
        console.error('[delete-session] 批量删除会话目录失败:', dir, error)
        failures.set(sessionId, error instanceof Error ? error.message : String(error))

        return
      }
    }
  })

  const removable = wanted.filter((sessionId) => !failures.has(sessionId))
  let records = new Map<string, number>()

  try {
    records = await forgetSessionRecordsBatch(resolveDshHome(), new Set(removable))
  } catch (error) {
    // 派生记录清理失败不影响正文已删除的事实，只记录以便排查
    console.error('[delete-session] 批量清理会话派生记录失败:', error)
  }

  const deleted: string[] = []
  const failed = wanted
    .filter((sessionId) => failures.has(sessionId))
    .map((sessionId) => ({ sessionId, error: failures.get(sessionId) ?? '删除失败' }))

  for (const sessionId of removable) {
    const directories = dirsById.get(sessionId)?.length ?? 0
    const cleaned = records.get(sessionId) ?? 0

    // 正文目录与派生记录都不存在时，说明这条会话早已被删掉
    if (directories === 0 && cleaned === 0) {
      failed.push({ sessionId, error: '会话不存在或已被删除' })
      continue
    }

    deleted.push(sessionId)
  }

  logPerf('deleteStoredSessions', startedAt, {
    requested: wanted.length,
    deleted: deleted.length,
    failed: failed.length,
  })
  console.info('[delete-session] 批量删除完成:', deleted.length, '条，失败', failed.length, '条')

  return { deleted, failed }
}
