/**
 * 「会话历史左侧」的客户端与宿主共用模型。
 */

/** 一轮用户输入。 */
export interface TurnInput {
  /** 轮次序号，从 1 开始；与导航条标记的先后顺序一致。 */
  turn: number
  /** 该轮用户输入的文本，已除去换行并截断，可直接单行展示。 */
  text: string
}

/** 轮次文本接口的响应。 */
export interface TurnInputsResponse {
  /** 按轮次升序排列的用户输入；会话没有记录时为空数组。 */
  inputs: TurnInput[]
}
