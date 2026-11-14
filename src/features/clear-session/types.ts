/**
 * 「清空会话」客户端与宿主侧共用的数据模型。
 */

/** 一次清空请求的目标会话。 */
export interface ClearSessionTarget {
  /** 要清空的会话标识，即用户当时正在浏览的那条对话。 */
  sessionId: string
  /** 会话所属工作区；未分组会话没有该值，此时新对话按宿主默认工作区创建。 */
  workspaceId?: string
  /** 会话工作目录；工作区不可用时用它创建新会话，保证新对话落在同一项目里。 */
  cwd?: string
  /** 会话是否正在执行任务；运行中不允许清空，避免删掉仍被写句柄持有的记录。 */
  running: boolean
}

/**
 * 删除旧会话时宿主返回的结果。
 *
 * 宿主成功时只回 `{ deleted: true }`，失败用 4xx/5xx 加 `error` 说明原因。
 */
export interface DeleteSessionResponse {
  /** 宿主确认已删除会话记录。 */
  deleted?: boolean
  /** 宿主给出的失败原因；成功时为 undefined。 */
  error?: string
}
