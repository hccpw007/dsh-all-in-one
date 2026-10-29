/**
 * 「删除会话」功能用到的数据类型。
 *
 * 客户端与宿主侧路由共用同一份请求/响应形状，避免两端各写一套字段名。
 */

/** 删除请求体。 */
export interface DeleteSessionRequest {
  /** 要删除的会话标识，形如 `session-<uuid>`。 */
  sessionId: string
}

/** 删除结果。 */
export interface DeleteSessionResponse {
  /** 宿主是否真的删掉了会话目录。 */
  deleted: boolean
}

/** 一条会话当前能不能删：运行中与会话列表的判定都由宿主列表快照给出。 */
export interface SessionDeletableState {
  /** 该会话的 Agent 是否正在执行任务；运行中的会话不能删除。 */
  running: boolean
  /** 该会话是否是当前正在浏览的对话；删除后需要切到默认新会话页面。 */
  isCurrent: boolean
}
