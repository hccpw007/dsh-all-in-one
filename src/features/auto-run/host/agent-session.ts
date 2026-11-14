/**
 * 从宿主的 Agent 上读取会话标识。
 *
 * `agent` 在诊断性装配、工具闸门等场景里可能缺省，且跨插件版本形状可能变化，
 * 因此逐层收窄而不是断言；取不到时调用方按「与本功能无关」处理。
 */

/**
 * 读取 Agent 所属会话标识。
 * @param agent 宿主 Agent（形状未知）
 * @returns 会话标识；取不到时返回 undefined
 */
export function readAgentSessionId(agent: unknown): string | undefined {
  if (typeof agent !== 'object' || agent === null) return undefined

  const session = (agent as { session?: unknown }).session
  if (typeof session !== 'object' || session === null) return undefined

  const id = (session as { id?: unknown }).id

  return typeof id === 'string' && id !== '' ? id : undefined
}
