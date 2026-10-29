/**
 * 「自动压缩会话」用到的数据类型。
 *
 * 开关与两个百分比存在宿主磁盘上：压缩由宿主侧在每步前触发，浏览器端只负责
 * 编辑配置，因此两端共用同一份字段名。
 */

/** 自动压缩配置。 */
export interface AutoCompactSettings {
  /** 是否在上下文占用达到阈值后自动压缩。 */
  enabled: boolean
  /** 触发阈值：上下文窗口占用百分比，取值 1-100。 */
  thresholdPercent: number
  /** 压缩后保留的近期上下文：上下文窗口百分比，取值 1 到「阈值 - 1」。 */
  retainPercent: number
}

/** token-meter 的 `contextPressure` 投影中本功能用到的字段。 */
export interface ContextPressureView {
  /** 模型上下文窗口容量；缺失时无法计算占用比例。 */
  contextWindow?: number
  /** 最近一次请求实际占用的 prompt tokens。 */
  pressureTokens?: number
  /** 按当前会话表面内容推算的下一轮请求占用；优先于 `pressureTokens`。 */
  projectedTokens?: number
}
