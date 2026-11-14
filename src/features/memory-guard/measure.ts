/**
 * 内存读数。
 *
 * 判定用的占用值优先取宿主返回的渲染进程 RSS：它对应你在活动监视器里看到的
 * 那个 1 GB 数字。拿不到时（浏览器打开的实例）退回 `performance.memory` 的
 * JS 堆——数值偏小，但趋势一致，阈值可以按同一比例调低。
 */
import { fetchHostMemory } from './api'
import type { MemoryReading, MemorySource } from './types'

/**
 * 读页面自身的 JS 堆与 DOM 规模。
 * @returns JS 堆（MB，不可用时 null）与 DOM 节点数
 */
function readPageMemory(): { heapMB: number | null; domNodes: number } {
  const memory = performance.memory
  const heapMB = memory === undefined ? null : Math.round(memory.usedJSHeapSize / 1048576)

  return { heapMB, domNodes: document.getElementsByTagName('*').length }
}

/**
 * 读取一次完整的内存读数。
 *
 * 每次都先问宿主：桌面版要的是真实 RSS，而页面读数在同一个窗口里只是 JS 堆，
 * 二者相差数倍，不能混用同一个阈值。
 * @returns 归一化后的读数
 */
export async function readMemory(): Promise<MemoryReading> {
  const page = readPageMemory()
  const host = await fetchHostMemory()
  const rendererRssMB = host?.rendererRssMB ?? null
  const source: MemorySource = rendererRssMB !== null
    ? 'process'
    : page.heapMB !== null
      ? 'heap'
      : 'none'

  return {
    megabytes: rendererRssMB ?? page.heapMB ?? 0,
    source,
    heapMB: page.heapMB,
    rendererRssMB,
    domNodes: page.domNodes,
  }
}
