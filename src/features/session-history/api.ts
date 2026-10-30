/**
 * 「会话历史左侧」的客户端接口。
 */
import type { TurnInput, TurnInputsResponse } from './types'

/** 轮次文本路由，与宿主侧注册路径保持一致。 */
const TURN_INPUTS_ROUTE = '/dsh-all-in-one/turn-inputs'

/**
 * 请求一条会话的每轮用户输入。
 * @param sessionId 会话标识
 * @returns 按轮次排列的输入；请求失败时为空数组
 */
export async function requestTurnInputs(sessionId: string): Promise<TurnInput[]> {
  try {
    const response = await fetch(`${TURN_INPUTS_ROUTE}?sessionId=${encodeURIComponent(sessionId)}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[session-history] 读取轮次文本失败:', response.status)
      return []
    }

    const body = (await response.json()) as TurnInputsResponse
    return Array.isArray(body.inputs) ? body.inputs : []
  } catch (error) {
    console.error('[session-history] 请求轮次文本失败:', error)
    return []
  }
}
