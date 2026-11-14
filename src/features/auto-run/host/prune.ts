/**
 * 全自动配置的定期清理。
 *
 * 会话被删除、工作空间被移除后，配置文件里的记录没有回调可以感知，会一直残留；
 * 这里每 7 天核对一次：以 DSH 的会话目录与工作空间注册表为准，丢掉没有对应实体的
 * 条目。扫描失败时跳过本次清理——宁可留残留，也不能凭不完整的数据删掉用户设置。
 *
 * 只在宿主启动 30 秒后检查一次（避开启动期）：距上次清理不足 7 天就什么都不做。
 * 不保留常驻定时器——清理对实时性没有要求，宿主下次启动时再核对即可。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'
import { pruneAutoRunSettings, readAutoRunSettings } from './settings'

/** 两次清理之间的间隔。 */
const PRUNE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000

/** 启动后的首次检查延迟。 */
const START_DELAY_MS = 30_000

/** 会话标识的 UUID 部分；宿主生成的标识形如 `session-<uuid>`，早期记录可能只有 uuid。 */
const SESSION_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * 判断目录名是否本身就是会话标识。
 *
 * 正常情况下会话在第二层（slug 目录下）；这里额外兼容直接放在根下的布局，
 * 否则那条会话会被当成「不存在」而误删记录。
 * @param name 目录名
 * @returns 形如会话标识时返回 true
 */
function isSessionId(name: string): boolean {
  return name.startsWith('session-') || SESSION_UUID_PATTERN.test(name)
}

/**
 * 收集现存会话标识。
 *
 * 宿主把会话按工作目录分到 slug 子目录，会话标识是第二层目录名。
 * @returns 会话标识集合；会话根目录读不到时返回 undefined
 */
async function listExistingSessionIds(): Promise<Set<string> | undefined> {
  const root = join(resolveDshHome(), 'sessions')

  try {
    const groups = await readdir(root, { withFileTypes: true })
    const ids = new Set<string>()

    // 各 slug 目录并发读取；单个目录失败只丢它自己的会话，不影响其余目录
    const nested = await Promise.all(groups
      .filter((group) => group.isDirectory())
      .map((group) =>
        readdir(join(root, group.name), { withFileTypes: true }).catch((error: unknown) => {
          console.error('[auto-run] 读取会话目录失败:', group.name, error)

          return []
        }),
      ))

    for (const group of groups) {
      // 根层直接放会话目录的布局也要认，否则会被判为已删除
      if (group.isDirectory() && isSessionId(group.name)) ids.add(group.name)
    }

    for (const entries of nested) {
      for (const entry of entries) {
        if (entry.isDirectory()) ids.add(entry.name)
      }
    }

    return ids
  } catch (error) {
    console.error('[auto-run] 扫描会话目录失败，跳过本次会话清理:', error)

    return undefined
  }
}

/**
 * 收集现存工作空间标识。
 * @returns 工作空间标识集合；注册表读不到或结构不符时返回 undefined
 */
async function listExistingWorkspaceIds(): Promise<Set<string> | undefined> {
  const file = join(resolveDshHome(), 'storages', 'workspace.json')

  try {
    const parsed = JSON.parse(await readFile(file, 'utf8')) as unknown
    const global = (parsed as { global?: { workspaceIds?: unknown } }).global
    const ids = global?.workspaceIds

    if (!Array.isArray(ids)) return undefined

    return new Set(ids.filter((id): id is string => typeof id === 'string' && id !== ''))
  } catch (error) {
    // 没有注册表文件说明这台机器还没有工作空间：不是异常，跳过工作空间清理
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined

    console.error('[auto-run] 读取工作空间注册表失败，跳过本次工作空间清理:', error)

    return undefined
  }
}

/**
 * 到期时执行一次清理。
 * @param isDisposed 插件是否已卸载；卸载后不再写配置
 */
async function pruneIfDue(isDisposed: () => boolean): Promise<void> {
  const settings = readAutoRunSettings()
  if (Date.now() - settings.lastPrunedAt < PRUNE_INTERVAL_MS) return

  const [sessionIds, workspaceIds] = await Promise.all([
    listExistingSessionIds(),
    listExistingWorkspaceIds(),
  ])
  if (isDisposed()) return

  const removed = pruneAutoRunSettings(sessionIds, workspaceIds)
  if (removed.sessions > 0 || removed.workspaces > 0) {
    console.log(
      `[auto-run] 已清理失效记录：会话 ${removed.sessions} 条，工作空间 ${removed.workspaces} 条`,
    )
  }
}

/**
 * 安装定期清理。
 * @returns 卸载时取消定时器
 */
export function installAutoRunPrune(): () => void {
  let disposed = false

  const run = (): void => {
    if (disposed) return

    void pruneIfDue(() => disposed).catch((error: unknown) => {
      // 失败只记日志：下次宿主启动时仍会按到期时间重试
      console.error('[auto-run] 定期清理失败:', error)
    })
  }

  const timer = setTimeout(run, START_DELAY_MS)

  return () => {
    disposed = true
    clearTimeout(timer)
  }
}
