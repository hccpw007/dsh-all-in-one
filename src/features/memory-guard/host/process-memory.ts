/**
 * 读取 Electron 进程树的内存。
 *
 * 插件跑在 `dsh-desktop-host` 里，和渲染进程是兄弟关系：两者的父进程都是
 * Electron 主进程，因此 `process.ppid` 就是定位整棵进程树的钥匙，不需要任何
 * 调试端口或主进程配合。浏览器打开的实例（dev / 远程）没有这棵进程树，
 * 返回 null，由页面退回 JS 堆读数。
 *
 * 读数分两部分：渲染进程（页面重建能回收的那部分）与其余进程（主进程、GPU、
 * 网络服务与插件宿主，重建不会让它们下降）。两部分都用物理内存（phys footprint），
 * 也就是活动监视器「内存」列显示的数字；`ps` 的 RSS 会把与其它进程共享的框架页
 * 重复计入，同一时刻能高三四成，用户拿两个数一对就会以为读错了。
 * `footprint` 读不到时退回该进程的 RSS，保证读数不中断。
 *
 * 读数按 4 秒缓存并合并并发调用：设置页每 5 秒轮询一次，没有缓存会把 `ps` 与
 * `footprint` 变成高频操作；两者本身也要几百毫秒，缓存让界面保持跟手。
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

/** 命令超时；超过说明系统进程表异常，不再等待。 */
const PS_TIMEOUT_MS = 2500

/** 读数缓存有效期：与设置页轮询间隔错开，既跟手又不会每次都拉进程表。 */
const CACHE_TTL_MS = 4000

/** 命令输出的上限；进程多、命令行长时默认 1 MB 会被截断。 */
const PS_MAX_BUFFER = 8 * 1024 * 1024

/** 最多查几个进程：正常四到六个，设上限避免异常进程树把一次检查拖长。 */
const MAX_PROCESS_PROBES = 10

/** `footprint` 输出里不同单位换算成兆字节的系数。 */
const SIZE_TO_MB: Record<string, number> = { B: 1 / 1048576, KB: 1 / 1024, MB: 1, GB: 1024 }

/** 带显式类型的 promisified execFile，避免推断成 any。 */
const runFile = promisify(execFile) as (
  file: string,
  args: readonly string[],
  options: { timeout: number; maxBuffer: number },
) => Promise<{ stdout: string; stderr: string }>

/** 进程树里的一个进程。 */
interface ProcessEntry {
  /** 进程号，用来向 `footprint` 查询物理内存。 */
  pid: number
  /** `ps` 给出的常驻内存（MB），物理内存读不到时作为退回值。 */
  rssMB: number
  /** 是否为渲染进程；渲染进程里最大的那个是主窗口。 */
  isRenderer: boolean
}

/** 一次进程树读数。 */
export interface ProcessTreeReading {
  /** 最大的渲染进程（主窗口）物理内存（MB）；没有渲染进程时为 null。 */
  rendererMB: number | null
  /** 其余进程的物理内存之和（MB）；一个都读不到时为 null。 */
  otherMB: number | null
}

/** 带时间戳的缓存项。 */
interface CachedReading {
  value: ProcessTreeReading | null
  at: number
}

let cache: CachedReading | undefined
let inFlight: Promise<ProcessTreeReading | null> | undefined

/**
 * 从 `ps -axo pid,ppid,rss,command` 的输出里挑出本应用的进程树。
 *
 * 包含主进程自身与它的直接子进程；孙进程是 MCP 等外部服务，活动监视器里也不在
 * DSH 名下，因此不计入。结果按 RSS 降序，调用方截断时优先保留大的。
 * @param output `ps` 的标准输出
 * @returns 进程树中的进程，按 RSS 降序
 */
function parseProcessTree(output: string): ProcessEntry[] {
  const mainPid = process.ppid
  const entries: ProcessEntry[] = []

  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/.exec(line)
    if (match === null) continue

    const pid = Number(match[1])
    const ppid = Number(match[2])
    const rssKb = Number(match[3])
    if (!Number.isFinite(pid) || !Number.isFinite(rssKb)) continue

    const isMain = pid === mainPid
    if (!isMain && ppid !== mainPid) continue

    entries.push({
      pid,
      rssMB: Math.round(rssKb / 1024),
      isRenderer: (match[4] ?? '').includes('--type=renderer'),
    })
  }

  return entries.sort((a, b) => b.rssMB - a.rssMB)
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
 * @returns 渲染进程与其余进程的物理内存；平台不支持或读取失败时返回 null
 */
async function sample(): Promise<ProcessTreeReading | null> {
  // ps 的字段组合与 footprint 都是 macOS 专有，其它平台先返回 null，由页面退回 JS 堆
  if (process.platform !== 'darwin') return null

  try {
    const { stdout } = await runFile('ps', ['-axo', 'pid,ppid,rss,command'], {
      timeout: PS_TIMEOUT_MS,
      maxBuffer: PS_MAX_BUFFER,
    })
    const entries = parseProcessTree(stdout).slice(0, MAX_PROCESS_PROBES)
    if (entries.length === 0) return null

    // 逐个进程并发查询，单个失败时用它的 RSS 顶上，避免一个进程异常拖垮整轮读数
    const readings = await Promise.all(
      entries.map(async (item) => ({
        item,
        megabytes: (await readFootprintMB(item.pid)) ?? item.rssMB,
      })),
    )

    let rendererMB = 0
    let otherMB = 0

    for (const { item, megabytes } of readings) {
      // 多个渲染进程时只把最大的当作「页面内存」，其余计入其他进程：
      // 这样两部分相加仍是整棵进程树的总量，既不重复也不遗漏
      if (!item.isRenderer) {
        otherMB += megabytes
      } else if (megabytes > rendererMB) {
        otherMB += rendererMB
        rendererMB = megabytes
      } else {
        otherMB += megabytes
      }
    }

    return {
      rendererMB: rendererMB > 0 ? rendererMB : null,
      otherMB: otherMB > 0 ? otherMB : null,
    }
  } catch (error) {
    console.error('[memory-guard] 读取进程树内存失败:', error)

    return null
  }
}

/**
 * 读取进程树内存，带缓存与并发合并。
 * @returns 渲染进程与其余进程的物理内存；不可用时返回 null
 */
export async function readProcessTreeMemory(): Promise<ProcessTreeReading | null> {
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
