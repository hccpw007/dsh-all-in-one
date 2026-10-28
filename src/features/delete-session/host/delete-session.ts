/**
 * 会话删除。
 *
 * 宿主只提供归档（把会话 id 记进归档集合），不提供删除，因此这里直接按宿主
 * 的存储布局删掉两处内容：
 *   - 会话目录 `$DSH_HOME/sessions/<项目 slug>/session-<uuid>/`，对话正文在此；
 *   - 该会话的派生记录（投影缓存、工作区排序与归档集合），见 session-records。
 *
 * 目录名来自会话 id，必须先按宿主的 id 形状校验，避免请求把路径带到别处。
 */
import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { forgetSessionRecords } from './session-records'

/** 会话标识语法：宿主一律用 `session-<uuid>` 作为目录名。 */
const SESSION_ID_PATTERN = /^session-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * 判断会话标识是否合法。
 * @param value 请求带来的原始值
 * @returns 只有宿主认可的 id 形状返回 true
 */
export function isValidSessionId(value: unknown): value is string {
  return typeof value === 'string' && SESSION_ID_PATTERN.test(value)
}

/**
 * 找出该会话在磁盘上的全部目录。
 *
 * 项目 slug 由会话的 cwd 推出，同一会话正常只有一个目录；工作目录改名后可能
 * 留下旧 slug 下的残留，因此这里遍历全部项目目录并逐个核对，全部命中都算。
 * @param sessionId 已校验的会话标识
 * @returns 匹配到的会话目录绝对路径
 */
async function findSessionDirs(sessionId: string): Promise<string[]> {
  const root = join(resolveDshHome(), 'sessions')
  let projects: string[]

  try {
    const entries = await readdir(root, { withFileTypes: true })
    projects = entries.filter((entry) => entry.isDirectory()).map((entry) => join(root, entry.name))
  } catch (error) {
    console.error('[delete-session] 枚举会话根目录失败:', error)
    throw error
  }

  const found: string[] = []

  for (const project of projects) {
    const candidate = join(project, sessionId)

    try {
      const info = await stat(candidate)
      if (info.isDirectory()) found.push(candidate)
    } catch (error) {
      // 绝大多数项目目录里没有这条会话，ENOENT 属正常情况
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue

      console.error('[delete-session] 检查会话目录失败:', candidate, error)
      throw error
    }
  }

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
  const dirs = await findSessionDirs(sessionId)

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

  if (dirs.length > 0) console.info('[delete-session] 已删除会话:', sessionId, dirs.length, records)

  return { directories: dirs.length, records }
}
