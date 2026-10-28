/**
 * 从宿主对象里取当前项目目录。
 *
 * 记忆按项目隔离，提示词注入与记忆工具都要知道「这个会话属于哪个项目」。
 * 用会话头里创建会话时记录的目录：它标识项目本身，与 Claude Code 的项目目录含义
 * 一致，用户之后 `cd` 进子目录不会让记忆换到另一套。
 *
 * 会话头没有记录时返回 undefined 而不是猜测：猜错会把记忆写进与本项目无关的目录，
 * 比起「这次没有记忆」，那是更难排查的问题。
 */
import { isAbsolute } from 'node:path'

/** 会话对象的最小形状。 */
interface SessionLike {
  header?: { cwd?: unknown }
}

/**
 * 解析 Agent 所属的项目目录。
 * @param agent 工具执行或提示词装配上下文里的 Agent
 * @returns 绝对路径；无法确定时返回 undefined
 */
export function resolveSessionDirectory(agent: unknown): string | undefined {
  const session = (agent as { session?: SessionLike } | undefined)?.session
  const recorded = session?.header?.cwd

  return typeof recorded === 'string' && isAbsolute(recorded) ? recorded : undefined
}
