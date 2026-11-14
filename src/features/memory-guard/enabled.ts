/**
 * 「内存守护」开关的运行时视图。
 *
 * 开关在 All In One 的卡片上切换，用到它的两处常驻入口却挂在宿主的 composer 与
 * 会话头部插槽里，三者不在同一棵组件树上。这里把存储中的开关状态接进 React：
 * 卡片切换后立即广播，两处入口随即显隐，不必刷新页面。
 */
import { useSyncExternalStore } from 'react'

import { readMemoryGuardSettings, subscribeMemoryGuardSettings } from './storage'

/** 快照函数：只取开关状态，返回布尔原始值，值未变时 React 不会重渲染。 */
function readEnabled(): boolean {
  return readMemoryGuardSettings().enabled
}

/**
 * 订阅当前开关状态。
 * @returns 是否显示会话界面里的两处常驻入口
 */
export function useMemoryGuardEnabled(): boolean {
  return useSyncExternalStore(subscribeMemoryGuardSettings, readEnabled)
}
