/**
 * 读取 Electron 渲染进程的常驻内存。
 *
 * 插件跑在 `dsh-desktop-host` 里，和渲染进程是兄弟关系：两者的父进程都是
 * Electron 主进程，因此 `process.ppid` 就是定位渲染进程的钥匙，不需要任何
 * 调试端口或主进程配合。浏览器打开的实例（dev / 远程）没有兄弟渲染进程，
 * 返回 null，由页面退回 JS 堆读数。
 *
 * 读数按 4 秒缓存并合并并发调用：卡片每 10 秒轮询一次，多个标签页可能同时请求，
 * 没有缓存会把 `ps` 变成高频操作；`ps` 本身也要几百毫秒，缓存能让卡片保持跟手。
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

/** `ps` 的超时；超过说明系统进程表异常，不再等待。 */
const PS_TIMEOUT_MS = 2500

/** 读数缓存有效期：与卡片轮询间隔错开，既跟手又不会每次都拉进程表。 */
const CACHE_TTL_MS = 4000

/** `ps` 输出的上限；进程多、命令行长时默认 1 MB 会被截断。 */
const PS_MAX_BUFFER = 8 * 1024 * 1024

/** 带显式类型的 promisified execFile，避免推断成 any。 */
const runFile = promisify(execFile) as (
  file: string,
  args: readonly string[],
  options: { timeout: number; maxBuffer: number },
) => Promise<{ stdout: string; stderr: string }>

/** 带时间戳的缓存项。 */
interface CachedReading {
  value: number | null
  at: number
}

let cache: CachedReading | undefined
let inFlight: Promise<number | null> | undefined

/**
 * 从 `ps -axo pid,ppid,rss,command` 的输出里选出渲染进程的最大 RSS。
 *
 * 同一个应用可能有多个渲染进程（主窗口、隐藏的 devtools 窗口等），取最大者
 * 作为「这个界面的内存」，与活动监视器里看到的那一行对得上。
 * @param output `ps` 的标准输出
 * @returns 渲染进程常驻内存（MB）；没有匹配项时返回 null
 */
function parseRendererRss(output: string): number | null {
  const targetPpid = process.ppid
  let largest = 0

  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/.exec(line)
    if (match === null) continue

    const ppid = Number(match[2])
    if (ppid !== targetPpid) continue

    const command = match[4] ?? ''
    if (!command.includes('--type=renderer')) continue

    const rssKb = Number(match[3])
    if (!Number.isFinite(rssKb)) continue

    const megabytes = Math.round(rssKb / 1024)
    if (megabytes > largest) largest = megabytes
  }

  return largest > 0 ? largest : null
}

/**
 * 执行一次进程表读取。
 * @returns 渲染进程内存（MB）；平台不支持或读取失败时返回 null
 */
async function sample(): Promise<number | null> {
  // ps 的字段组合与 macOS 一致，其它平台先返回 null，由页面退回 JS 堆
  if (process.platform !== 'darwin') return null

  try {
    const { stdout } = await runFile('ps', ['-axo', 'pid,ppid,rss,command'], {
      timeout: PS_TIMEOUT_MS,
      maxBuffer: PS_MAX_BUFFER,
    })

    return parseRendererRss(stdout)
  } catch (error) {
    console.error('[memory-guard] 读取渲染进程内存失败:', error)

    return null
  }
}

/**
 * 读取渲染进程常驻内存，带缓存与并发合并。
 * @returns 渲染进程内存（MB）；不可用时返回 null
 */
export async function readRendererRssMB(): Promise<number | null> {
  const now = Date.now()
  if (cache !== undefined && now - cache.at < CACHE_TTL_MS) return cache.value
  if (inFlight !== undefined) return inFlight

  const attempt = sample()
  inFlight = attempt

  try {
    const value = await attempt
    cache = { value, at: Date.now() }

    return value
  } finally {
    inFlight = undefined
  }
}
