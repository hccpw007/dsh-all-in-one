/**
 * 轻量回收：不重建页面、不打断任务的那一档。
 *
 * 能回收的只有「可丢弃」的内存——CacheStorage 里的静态资源副本、performance
 * 时间线缓冲，以及 `--expose-gc` 启动时的一次强制回收。React 组件树、消息 DOM
 * 与订阅闭包都是可达对象，任何 JS 手段都碰不到它们，这部分只能靠重建回收，
 * 因此这里的实测收益通常在一成上下，不该被当成「解决 1 GB」的手段。
 */
import { readMemory } from './measure'
import type { ReclaimResult } from './types'

/** 清理后等待浏览器把页还给系统的毫秒数；太短会让前后读数看不出差别。 */
const SETTLE_DELAY_MS = 600

/**
 * 删除全部 CacheStorage 条目。
 *
 * 这些是 HTTP 层可再生的副本（前端 bundle、字体等），删掉后下次加载会重新取，
 * 不会影响会话数据；本地服务回源很快，代价可以接受。
 */
async function clearCacheStorage(): Promise<void> {
  if (typeof caches === 'undefined') return

  try {
    const names = await caches.keys()
    await Promise.all(names.map((name) => caches.delete(name)))
  } catch (error) {
    console.error('[memory-guard] 清理 CacheStorage 失败:', error)
  }
}

/**
 * 清空 performance 时间线与自定义标记。
 *
 * 长时间运行后资源条目会累积到上万条，每条都持有字符串与对象引用；清空只影响
 * 调试面板，不影响任何功能。
 */
function clearPerformanceTimeline(): void {
  try {
    performance.clearResourceTimings()
    performance.clearMarks()
    performance.clearMeasures()
  } catch (error) {
    console.error('[memory-guard] 清理 performance 时间线失败:', error)
  }
}

/**
 * 在宿主以 `--expose-gc` 启动时请求一次强制回收。
 *
 * 默认启动参数下该函数不存在，属于尽力而为的一步，不做任何提示。
 */
function collectGarbage(): void {
  try {
    window.gc?.()
  } catch (error) {
    console.error('[memory-guard] 强制回收失败:', error)
  }
}

/**
 * 等待一段时间，让浏览器有机会处理回收。
 * @param milliseconds 等待毫秒数
 */
function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

/**
 * 执行一轮轻量回收。
 * @returns 回收前后的读数与释放量；读不到内存时释放量记 0
 */
export async function reclaimLight(): Promise<ReclaimResult> {
  const before = await readMemory()

  collectGarbage()
  clearPerformanceTimeline()
  await clearCacheStorage()
  await wait(SETTLE_DELAY_MS)

  const after = await readMemory()
  const freedMB = Math.max(0, before.megabytes - after.megabytes)

  return { before, after, freedMB, at: Date.now() }
}
