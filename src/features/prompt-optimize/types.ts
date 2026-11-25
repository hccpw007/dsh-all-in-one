/**
 * 「提示词优化」用到的数据类型。
 *
 * 前端只传待优化的原文与会话标识，优化由宿主用当前会话选定的模型完成：
 * 浏览器没有模型凭据，也无法读取会话的模型选择。
 */

/** 优化请求的返回。 */
export interface OptimizePayload {
  /** 优化后的完整提示词；失败时不返回。 */
  optimized?: string
  /** 失败原因，直接展示给用户；成功时不返回。 */
  error?: string
}

/** 待优化原文的长度上限（UTF-8 字节）。 */
export const MAX_INPUT_BYTES = 8 * 1024

/** 优化结果的长度上限（字符）：超出的部分说明模型跑偏，按失败处理。 */
export const MAX_OUTPUT_CHARS = 16 * 1024
