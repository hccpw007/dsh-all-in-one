/**
 * 「对话加速」的设置模型。
 *
 * 客户端页面与宿主侧扩展共用同一份结构：页面提交勾选结果，宿主侧据此
 * 决定是否注册批量工具、补并发声明、调整裁剪阈值与注入提示词。
 */

/** 宿主侧持久化的设置。 */
export interface ChatAccelSettings {
  /** 已启用的条目 id；未列出的条目视为关闭。 */
  enabledIds: string[]
  /** 旧工具结果裁剪阈值（字符），仅在启用 `toolResultPrune` 时生效。 */
  pruneThreshold: number
}

/** 裁剪阈值允许的最小值，与页面输入框保持一致。 */
export const PRUNE_THRESHOLD_MIN = 512

/** 裁剪阈值允许的最大值，与页面输入框保持一致。 */
export const PRUNE_THRESHOLD_MAX = 16384

/** 裁剪阈值默认值：宿主默认 8192，这里更早回收旧结果。 */
export const PRUNE_THRESHOLD_DEFAULT = 4096
