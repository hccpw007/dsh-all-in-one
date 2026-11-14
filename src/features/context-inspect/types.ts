/**
 * 「上下文详情」客户端与宿主共用的数据模型。
 *
 * 窗口里展示的就是会话日志里「当前发给模型」的那两份内容：系统提示词原文与
 * 请求头里的完整工具定义。字段保持纯 JSON，宿主侧直出、浏览器侧直接渲染。
 */

/** 一个工具定义：与宿主请求头里的 schema 同形，只保留展示需要的字段。 */
export interface InspectToolSchema {
  /** 工具名，模型侧唯一标识。 */
  name: string
  /** 工具说明；宿主允许为空串。 */
  description: string
  /** 参数的 JSON Schema；原样展示，不做裁剪。 */
  parameters: Record<string, unknown>
}

/** 一次读取的结果。 */
export interface ContextInspectPayload {
  /** 会话标识；前端定位不到会话时为空串。 */
  session: string
  /** 读取时刻（毫秒时间戳），窗口据此显示「更新于」。 */
  readAt: number
  /** 系统提示词原文；会话尚未发起请求时为空串。 */
  system: string
  /** 当前请求头里的工具定义；没有请求头时为空数组。 */
  tools: InspectToolSchema[]
}

/** 窗口要展示的区块。 */
export type InspectSection = 'system' | 'tools'
