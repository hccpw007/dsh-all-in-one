/**
 * 「上下文详情」客户端与宿主共用的数据模型。
 *
 * 窗口里展示的就是会话日志里「当前发给模型」的三份内容：系统提示词原文、
 * 请求头里的完整工具定义，以及模型可见表面上的对话消息。字段保持纯 JSON，
 * 宿主侧直出、浏览器侧直接渲染。
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

/** 对话消息的角色，取自宿主消息的 role。 */
export type InspectMessageRole = 'user' | 'assistant' | 'tool' | 'developer'

/** 一条模型可见表面上的对话消息。 */
export interface InspectMessage {
  /** 该消息在会话日志里的序号，用于展示定位。 */
  seq: number
  /** 消息角色。 */
  role: InspectMessageRole
  /** 已展平的可读文本：正文、工具调用与工具结果都折进这一段。 */
  text: string
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
  /** 模型可见表面上的对话消息，按时间顺序；超过上限时只保留最近的一部分。 */
  messages: InspectMessage[]
  /** 表面上实际的对话消息条数；与 `messages.length` 不等说明被截断。 */
  messagesTotal: number
}

/** 窗口要展示的区块。 */
export type InspectSection = 'system' | 'tools' | 'messages'
