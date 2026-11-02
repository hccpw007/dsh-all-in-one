/**
 * 桌面版认证 cookie 的清理。
 *
 * Electron 主进程每次启动都用随机端口派生出新的 cookie 名
 * （`dsh-auth-<sha256(127.0.0.1:端口)>`），旧记录既不过期也不被覆盖；攒到几十条后
 * 欢迎页认证会失败，日志表现为 `desktop welcome: Web authentication failed`。
 *
 * 清理必须在主进程开始认证之前完成，所以由宿主插件在启动阶段同步执行。
 * 只删 `dsh-auth-*` 记录，保留同一个库里的其它 cookie。
 */
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type { DatabaseSync } from 'node:sqlite'

import type { DesktopCookieSettings } from '../types'

/** Chromium cookie 库的文件名。 */
const COOKIE_FILE_NAME = 'Cookies'

/** 桌面版认证 cookie 的名字前缀，后缀是当前端口的 sha256。 */
const AUTH_COOKIE_PREFIX = 'dsh-auth-'

/** 桌面版认证 cookie 的 host：Host 只监听回环地址。 */
const AUTH_COOKIE_HOST = '127.0.0.1'

/** 一次清理的结果，供启动日志与排障使用。 */
interface CookieCleanupReport {
  /** `skipped` 未执行清理；`cleaned` 已删除过期记录；`failed` 执行失败。 */
  status: 'skipped' | 'cleaned' | 'failed'
  /** 清理前库中的认证 cookie 条数；失败时无法统计，为 0。 */
  before: number
  /** 清理后保留的认证 cookie 条数；失败时无法统计，为 0。 */
  after: number
  /** 跳过或失败的原因，仅写入日志。 */
  reason?: string
}

/**
 * 桌面版的 Electron userData 目录，与宿主主进程使用的 `--user-data-dir` 一致。
 * @returns userData 目录绝对路径
 */
function desktopUserDataDir(): string {
  if (process.platform === 'darwin') return join(homedir(), 'Library', 'Application Support')
  if (process.platform === 'win32') {
    return process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming')
  }

  return process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config')
}

/**
 * 桌面版 cookie 库的路径。
 * @returns cookie 库绝对路径
 */
function desktopCookiesFile(): string {
  return join(desktopUserDataDir(), '@deepseek-ai', 'dsh-desktop', COOKIE_FILE_NAME)
}

/**
 * 按阈值清理桌面版认证 cookie，保留最近的若干条。
 * @param settings 当前设置
 * @returns 清理结果
 */
export function cleanupAuthCookies(settings: DesktopCookieSettings): CookieCleanupReport {
  if (!settings.enabled) return { status: 'skipped', before: 0, after: 0, reason: 'disabled' }

  const file = desktopCookiesFile()
  // 非桌面版机器上没有这个库，说明本进程不负责清理
  if (!existsSync(file)) {
    return { status: 'skipped', before: 0, after: 0, reason: `cookie library not found: ${file}` }
  }

  const sqlite = process.getBuiltinModule('node:sqlite')
  if (sqlite === undefined) {
    console.error('[desktop-cookie] 当前 Node 未提供 node:sqlite，跳过清理:', file)

    return { status: 'failed', before: 0, after: 0, reason: 'node:sqlite unavailable' }
  }

  let database: DatabaseSync | undefined

  try {
    database = new sqlite.DatabaseSync(file)
    const rows = database
      .prepare(
        'SELECT name FROM cookies WHERE host_key = ? AND name LIKE ? ORDER BY creation_utc DESC',
      )
      .all(AUTH_COOKIE_HOST, `${AUTH_COOKIE_PREFIX}%`)

    const names = rows
      .map((row) => row.name)
      .filter((name): name is string => typeof name === 'string')

    if (names.length < settings.threshold) {
      return {
        status: 'skipped',
        before: names.length,
        after: names.length,
        reason: 'below threshold',
      }
    }

    // 按创建时间倒序保留最近 retain 条，其余视为过期记录
    const stale = names.slice(settings.retain)
    const remove = database.prepare('DELETE FROM cookies WHERE host_key = ? AND name = ?')

    for (const name of stale) remove.run(AUTH_COOKIE_HOST, name)

    return { status: 'cleaned', before: names.length, after: names.length - stale.length }
  } catch (error) {
    console.error('[desktop-cookie] 清理桌面版认证 cookie 失败:', file, error)

    return {
      status: 'failed',
      before: 0,
      after: 0,
      reason: error instanceof Error ? error.message : String(error),
    }
  } finally {
    try {
      database?.close()
    } catch (error) {
      // 关闭失败不影响已完成的删除，只记录以便定位库文件异常
      console.error('[desktop-cookie] 关闭 cookie 库失败:', file, error)
    }
  }
}
