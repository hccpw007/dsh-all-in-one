/**
 * 读取 Electron 渲染进程的内存。
 *
 * 插件跑在 `dsh-desktop-host` 里，和渲染进程是兄弟关系：两者的父进程都是
 * Electron 主进程，因此 `process.ppid` 就是定位渲染进程的钥匙，不需要任何
 * 调试端口或主进程配合。浏览器打开的实例（dev / 远程）没有兄弟渲染进程，
 * 返回 null，由页面退回 JS 堆读数。
 *
 * 取的是物理内存（phys footprint），也就是活动监视器「内存」列显示的那个数字；
 * `ps` 的 RSS 会把与其它进程共享的框架页重复计入，同一时刻能比它高两三成，
 * 用户拿两个数一对就会以为读错了。`footprint` 读不到时退回 RSS，保证读数不中断。
 *
 * 读数按 4 秒缓存并合并并发调用：设置页每 5 秒轮询一次，没有缓存会把 `ps` 与
 * `footprint` 变成高频操作；两者本身也要几百毫秒，缓存让界面保持跟手。
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

/** `ps` 与 `footprint` 的超时；超过说明系统进程表异常，不再等待。 */
const PS_TIMEOUT_MS = 2500

/** 读数缓存有效期：与设置页轮询间隔错开，既跟手又不会每次都拉进程表。 */
const CACHE_TTL_MS = 4000

/** 命令输出的上限；进程多、命令行长时默认 1 MB 会被截断。 */
const PS_MAX_BUFFER = 8 * 1024 * 1024

/** 最多向几个渲染进程查物理内存：正常只有一个窗口渲染进程，多查只是兜底。 */
const MAX_FOOTPRINT_PROBES = 3

/** `footprint` 输出里不同单位换算成兆字节的系数。 */
const SIZE_TO_MB: Record<string, number> = { B: 1 / 1048576, KB: 1 / 1024, MB: 1, GB: 1024 }

/** 带显式类型的 promisified execFile，避免推断成 any。 */
const runFile = promisify(execFile) as (
  file: string,
  args: readonly string[],
  options: { timeout: number; maxBuffer: number },
) => Promise<{ stdout: string; stderr: string }>

/** 一次进程表里的渲染进程。 */
interface RendererProcess {
  /** 进程号，用来向 `footprint` 查询物理内存。 */
  pid: number
  /** `ps` 给出的常驻内存（MB），物理内存读不到时作为退回值。 */
  rssMB: number
}

/** 带时间戳的缓存项。 */
interface CachedReading {
  value: number | null
  at: number
}

let cache: CachedReading | undefined
let inFlight: Promise<number | null> | undefined

/**
 * 从 `ps -axo pid,ppid,rss,command` 的输出里挑出本应用的渲染进程。
 *
 * 同一个应用可能有多个渲染进程（主窗口、隐藏的 devtools 窗口等），按 RSS
 * 从大到小返回，调用方只查前几个的物理内存。
 * @param output `ps` 的标准输出
 * @returns 渲染进程候选，按 RSS 降序
 */
function parseRenderers(output: string): RendererProcess[] {
  const targetPpid = process.ppid
  const found: RendererProcess[] = []

  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/.exec(line)
    if (match === null) continue

    const ppid = Number(match[2])
    if (ppid !== targetPpid) continue

    const command = match[4] ?? ''
    if (!command.includes('--type=renderer')) continue

    const pid = Number(match[1])
    const rssKb = Number(match[3])
    if (!Number.isFinite(pid) || !Number.isFinite(rssKb)) continue

    found.push({ pid, rssMB: Math.round(rssKb / 1024) })
  }

  return found.sort((a, b) => b.rssMB - a.rssMB)
}

/**
 * 读取单个进程的物理内存（phys footprint）。
 *
 * `footprint` 只在 macOS 自带，且对其它用户的进程需要提权；失败属于可预期路径，
 * 记一条日志后由调用方退回 RSS，不中断整轮读数。
 * @param pid 进程号
 * @returns 物理内存（MB）；读取失败时返回 null
 */
async function readFootprintMB(pid: number): Promise<number | null> {
  try {
    const { stdout } = await runFile('footprint', [String(pid)], {
      timeout: PS_TIMEOUT_MS,
      maxBuffer: PS_MAX_BUFFER,
    })
    const match = /Footprint:\s*([\d.]+)\s*(B|KB|MB|GB)/.exec(stdout)
    if (match === null) return null

    const value = Number(match[1])
    const factor = SIZE_TO_MB[match[2] ?? 'MB']
    if (!Number.isFinite(value) || factor === undefined) return null

    return Math.round(value * factor)
  } catch (error) {
    console.warn(`[memory-guard] 读取进程 ${pid} 的物理内存失败，退回 RSS:`, error)

    return null
  }
}

/**
 * 执行一次进程表读取与物理内存查询。
 * @returns 渲染进程物理内存（MB）；平台不支持或读取失败时返回 null
 */
async function sample(): Promise<number | null> {
  // ps 的字段组合与 footprint 都是 macOS 专有，其它平台先返回 null，由页面退回 JS 堆
  if (process.platform !== 'darwin') return null

  try {
    const { stdout } = await runFile('ps', ['-axo', 'pid,ppid,rss,command'], {
      timeout: PS_TIMEOUT_MS,
      maxBuffer: PS_MAX_BUFFER,
    })
    const candidates = parseRenderers(stdout).slice(0, MAX_FOOTPRINT_PROBES)
    if (candidates.length === 0) return null

    // 逐个进程并发查询，单个失败时用它的 RSS 顶上，避免一个进程异常拖垮整轮读数
    const readings = await Promise.all(
      candidates.map(async (item) => (await readFootprintMB(item.pid)) ?? item.rssMB),
    )

    return Math.max(...readings)
  } catch (error) {
    console.error('[memory-guard] 读取渲染进程内存失败:', error)

    return null
  }
}

/**
 * 读取渲染进程内存，带缓存与并发合并。
 * @returns 渲染进程物理内存（MB）；不可用时返回 null
 */
export async function readRendererMemoryMB(): Promise<number | null> {
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
