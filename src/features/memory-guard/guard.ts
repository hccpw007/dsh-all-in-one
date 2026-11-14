/**
 * 「内存守护」的定时编排。
 *
 * 每 `intervalMinutes` 分钟检查一次，一次检查包含三步：
 *   1. 轻量回收（清可丢弃缓存），收益约一成，随时安全；
 *   2. 读占用，低于阈值就结束；
 *   3. 读占用状态，无运行中任务、无待落地提交、无草稿，且「窗口失焦或空闲满
 *      一个检查周期」时，倒计时 5 秒后重建页面，收益约八成五。
 *
 * 两个安全边界：重建前做两次占用判定（倒计时期间用户可能刚开始操作），以及
 * 重建后至少冷却两个周期，避免阈值设得过低时反复刷新。
 */
import type { SessionsApi, Translate } from '../../types/plugin'
import { askRebuildConfirm } from './notice'
import { installInteractionTracking, readOccupancy, resetIdleClock } from './occupancy'
import { reclaimLight } from './reclaim'
import { readMemoryGuardSettings, readMemoryGuardState, updateMemoryGuardState } from './storage'
import type { MemoryReading, RebuildOutcome } from './types'

/** 对外的操作面：卡片上的按钮与定时器共用同一套判定。 */
export interface MemoryGuardHandle {
  /** 立即执行一次轻量回收，返回回收后的读数。 */
  reclaimNow(): Promise<MemoryReading>
  /** 立即重建：只挡运行中任务与草稿，不要求空闲满一个周期。 */
  rebuildNow(): Promise<RebuildOutcome>
  /** 按最新配置重排定时器；用户改完检查间隔后调用，不必等旧周期走完。 */
  reschedule(): void
  /** 摘除定时器与交互监听。 */
  dispose(): void
}

/** 当前生效的实例；重建前卡片要能调用它，因此按单例暴露。 */
let active: MemoryGuardHandle | undefined

/**
 * 取当前生效的实例。
 * @returns 插件已装配时返回操作面，否则 undefined
 */
export function activeMemoryGuard(): MemoryGuardHandle | undefined {
  return active
}

/**
 * 装配定时器与手动操作面。
 * @param t 已绑定本 feature 前缀的翻译函数
 * @param sessions 宿主会话列表服务，用于判断是否有任务在跑
 * @returns 操作面；`dispose` 后定时器与监听一并撤销
 */
export function installMemoryGuard(t: Translate, sessions: SessionsApi | undefined): MemoryGuardHandle {
  const disposeTracking = installInteractionTracking()
  let timer: number | undefined
  let disposed = false
  // 重入闸门：一次检查可能要跑几秒（等 GC 落地），期间不能再进一次
  let busy = false

  /**
   * 排下一次检查。
   *
   * 用 `setTimeout` 链而不是 `setInterval`：检查本身是异步的，间隔期间如果上一次
   * 还没跑完，`setInterval` 会叠加排队；链式调度天然串行。
   */
  const schedule = (): void => {
    if (disposed) return

    const { intervalMinutes } = readMemoryGuardSettings()
    timer = window.setTimeout(() => {
      void runCheck()
    }, intervalMinutes * 60_000)
  }

  /**
   * 一次完整检查：轻量回收 → 阈值 → 占用判定 → 倒计时 → 重建。
   * @returns 重建结果；无论结果如何都会重新排期
   */
  const runCheck = async (): Promise<RebuildOutcome> => {
    timer = undefined

    if (busy || disposed) return { rebuilt: false, reason: 'busy' }
    busy = true

    try {
      const settings = readMemoryGuardSettings()
      if (!settings.enabled) return { rebuilt: false, reason: 'disabled' }

      const reclaim = await reclaimLight()
      updateMemoryGuardState({
        lastReclaimAt: reclaim.at,
        lastReclaimFreedMB: reclaim.freedMB,
      })

      const intervalMs = settings.intervalMinutes * 60_000
      const state = readMemoryGuardState()
      if (state.lastRebuildAt > 0 && Date.now() - state.lastRebuildAt < intervalMs * 2) {
        return { rebuilt: false, reason: 'cooldown', detail: t('skipCooldown') }
      }

      if (reclaim.after.megabytes < settings.thresholdMB) {
        return { rebuilt: false, reason: 'below-threshold', detail: t('skipBelowThreshold') }
      }

      return await confirmThenRebuild(intervalMs, false)
    } finally {
      busy = false
      schedule()
    }
  }

  /**
   * 占用判定 + 倒计时 + 重建。
   * @param intervalMs 空闲阈值（毫秒）；手动重建传 0 跳过空闲要求
   * @param manual 是否为用户主动点击
   * @returns 重建结果
   */
  const confirmThenRebuild = async (intervalMs: number, manual: boolean): Promise<RebuildOutcome> => {
    const occupancy = readOccupancy(sessions)

    if (occupancy.running || occupancy.submitting) {
      return { rebuilt: false, reason: 'busy', detail: t('skipRunning') }
    }

    if (occupancy.draft) {
      return { rebuilt: false, reason: 'draft', detail: t('skipDraft') }
    }

    // 失焦即视为「不在前台操作」；前台则必须空闲满一个检查周期
    if (!manual && occupancy.focused && occupancy.idleMs < intervalMs) {
      return { rebuilt: false, reason: 'active', detail: t('skipActive') }
    }

    const result = await askRebuildConfirm(t)
    if (disposed) return { rebuilt: false, reason: 'unavailable', detail: t('guardMissing') }

    if (result === 'cancelled') {
      // 取消后把空闲计时清零，避免同一个检查点立刻再次弹窗
      resetIdleClock()

      return { rebuilt: false, reason: 'cancelled', detail: t('skipCancelled') }
    }

    // 倒计时的 5 秒里用户可能刚点了发送或开始输入，重建前再确认一次
    const recheck = readOccupancy(sessions)
    if (recheck.running || recheck.submitting || recheck.draft) {
      resetIdleClock()

      return { rebuilt: false, reason: 'busy', detail: t('skipRunning') }
    }

    updateMemoryGuardState({ lastRebuildAt: Date.now() })
    window.location.reload()

    return { rebuilt: true }
  }

  const handle: MemoryGuardHandle = {
    async reclaimNow(): Promise<MemoryReading> {
      const result = await reclaimLight()
      updateMemoryGuardState({
        lastReclaimAt: result.at,
        lastReclaimFreedMB: result.freedMB,
      })

      return result.after
    },

    async rebuildNow(): Promise<RebuildOutcome> {
      if (busy) return { rebuilt: false, reason: 'busy', detail: t('skipRunning') }
      busy = true

      try {
        return await confirmThenRebuild(0, true)
      } finally {
        busy = false
      }
    },

    reschedule(): void {
      if (disposed) return
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      schedule()
    },

    dispose(): void {
      disposed = true
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      disposeTracking()
    },
  }

  active = handle
  schedule()

  // 包装一层：卸载时同时清掉模块级引用，避免卡片拿到已失效的实例
  const dispose = handle.dispose
  handle.dispose = () => {
    dispose()
    if (active === handle) active = undefined
  }

  return handle
}
