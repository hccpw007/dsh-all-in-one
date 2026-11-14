/** 「编辑排队消息」模块内部共用的契约。 */

/** 排队条上的「撤回并编辑」按钮所需的文案与行为。 */
export interface QueueEditOptions {
  /** 按钮名称，同时作为无障碍标签与悬停提示。 */
  label: string
  /** 撤回一条排队消息；会话标识与行索引由 DOM 安装器算出。 */
  run: (sessionId: string, index: number) => Promise<void>
}
