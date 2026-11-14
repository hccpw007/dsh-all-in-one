/**
 * 「内存守护」用到的数据类型。
 *
 * 配置与运行状态都存在浏览器端 localStorage：定时器、交互监听与占用判定
 * 全部跑在渲染进程里，只有渲染进程自己知道「用户是否正在操作」；宿主侧只
 * 负责提供渲染进程的真实内存读数。
 */

/** 本功能的配置。 */
export interface MemoryGuardSettings {
  /** 是否启用定时检查与自动回收。 */
  enabled: boolean
  /**
   * 检查周期（分钟），同时是「无人工操作」的阈值。
   *
   * 两者共用一个值：每 N 分钟检查一次，检查时要求距最后一次人工交互也已满 N 分钟，
   * 这样自动重建永远发生在「确实没人动过」之后，而不是刚离开键盘的瞬间。
   */
  intervalMinutes: number
  /** 触发自动重建的占用阈值（MB）；低于它只做轻量回收。 */
  thresholdMB: number
}

/** 读数来源：桌面版能拿到渲染进程真实内存，浏览器环境退回页面 JS 堆。 */
export type MemorySource = 'process' | 'heap' | 'none'

/** 一次内存读数。 */
export interface MemoryReading {
  /** 判定用的占用值（MB）；来源为 `none` 时是 0。 */
  megabytes: number
  /** 占用值来自哪种读数。 */
  source: MemorySource
  /** 页面 JS 堆（MB）；浏览器不提供该 API 时为 null。 */
  heapMB: number | null
  /** 宿主侧渲染进程物理内存（MB，活动监视器同口径）；浏览器打开的实例为 null。 */
  rendererMB: number | null
  /** 页面 DOM 节点数，作为界面规模与长会话累积的旁证。 */
  domNodes: number
}

/** 宿主内存路由的返回。 */
export interface HostMemoryPayload {
  /** 渲染进程物理内存（MB，活动监视器「内存」列同口径）；无法定位时为 null。 */
  rendererMB: number | null
  /** 宿主 Node 进程常驻内存（MB）；读取失败时为 null。 */
  hostRssMB: number | null
}

/** 能否重建的判定材料。 */
export interface OccupancyState {
  /**
   * 距最后一次人工交互的毫秒数。
   *
   * 运行中的任务与输入框草稿都不阻止重建：宿主把事件流与 composer 草稿都持久化
   * 在磁盘上，页面重载后重放并恢复，内容不丢。判定只剩「有没有人在操作」。
   */
  idleMs: number
  /** 窗口当前是否持有焦点。 */
  focused: boolean
}

/** 一轮轻量回收的结果。 */
export interface ReclaimResult {
  /** 回收前的读数。 */
  before: MemoryReading
  /** 回收后的读数。 */
  after: MemoryReading
  /** 回收掉的兆字节数；浏览器没来得及归还时会是 0。 */
  freedMB: number
  /** 完成时刻（毫秒时间戳）。 */
  at: number
}

/** 重建被跳过的原因。 */
export type RebuildSkipReason =
  | 'disabled'
  | 'below-threshold'
  | 'busy'
  | 'active'
  | 'cooldown'
  | 'cancelled'
  | 'unavailable'

/** 一次重建尝试的结果。 */
export interface RebuildOutcome {
  /** 是否已经发起重建（返回后页面会立刻重载）。 */
  rebuilt: boolean
  /** 未重建时的原因，供卡片与日志使用。 */
  reason?: RebuildSkipReason
  /** 未重建时的可读原因说明，直接展示给用户。 */
  detail?: string
}

/** 运行状态：定时器写入，卡片读取。 */
export interface MemoryGuardState {
  /** 最近一次轻量回收的时刻。 */
  lastReclaimAt: number
  /** 最近一次轻量回收释放的兆字节数。 */
  lastReclaimFreedMB: number
  /** 最近一次重建的时刻；用于重建冷却期判定。 */
  lastRebuildAt: number
}

/** 宿主的进程内存读数，供路由与客户端共用。 */
export interface RendererMemoryPayload extends HostMemoryPayload {
  /** 读取该读数的时间（毫秒时间戳）。 */
  sampledAt: number
}

declare global {
  /** Chromium 的非标准内存 API；Electron 与 Chrome 提供，Safari 不提供。 */
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }

  interface Window {
    /** 只有启动参数带 `--expose-gc` 时才存在的强制回收入口。 */
    gc?: () => void
  }
}
