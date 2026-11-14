/**
 * 「全自动执行」的询问工具闸门。
 *
 * ask_user_question 由 Agent 预设在自己作用域内注册，插件无法从根作用域把它
 * 从工具表里摘掉，因此改用宿主的调用前闸门：自动模式下的询问调用直接拒绝，
 * 既不进入 userQuestions 服务，也就不会渲染出任何提问对话框。
 *
 * 权限审批（任一题声明 intent.kind 为 approval）一律放行：那代表用户本人的授权，
 * 必须由他在界面上点选，自动模式不代替授权。
 */
import type { HostPluginContext } from '../../../types/host'

import { readAgentSessionId } from './agent-session'
import { isAutoRunEnabled } from './settings'

/** 模型用于向用户提问的工具名。 */
const ASK_USER_QUESTION_TOOL = 'ask_user_question'

/**
 * 拒绝理由。
 *
 * 它会被物化成模型看到的工具结果，因此写清「为什么」与「接下来做什么」：
 * 只说被拒绝，模型容易换个问法重试；给出行动要求才能真正把一轮跑完。
 */
const DENY_REASON =
  '自动模式已开启：本会话不允许向用户提问，该工具已被禁用。'
  + '请根据现有信息自行判断并继续执行；需要取舍时按「用户指令优先、其次项目约定、最后最小可逆做法」定夺，不要重试 ask_user_question。'

/** 询问请求里本闸门需要读取的最小形状。 */
interface AskArgumentsLike {
  questions?: Array<{ intent?: { kind?: unknown } }>
}

/**
 * 判断这次调用是否包含权限审批类问题。
 * @param args 工具参数
 * @returns 任一题声明为 approval 时返回 true
 */
function asksForApproval(args: unknown): boolean {
  if (typeof args !== 'object' || args === null) return false

  const questions = (args as AskArgumentsLike).questions
  if (!Array.isArray(questions)) return false

  return questions.some((item) => item?.intent?.kind === 'approval')
}

/**
 * 注册询问工具闸门。
 * @param ctx 宿主上下文
 */
export function installAutoRunToolGuard(ctx: HostPluginContext): void {
  ctx.effect(
    () =>
      ctx.on('tools/pre-execute', async (exec, next) => {
        // 只处理询问工具：其余工具的调度、超时与权限完全交回宿主
        if (exec.name !== ASK_USER_QUESTION_TOOL) return next()

        const sessionId = readAgentSessionId(exec.agent)
        // 自动模式未开启、或读不到会话（子 Agent、系统调用）时一律放行
        if (sessionId === undefined || !isAutoRunEnabled(sessionId)) return next()

        // 权限审批留给用户本人点选
        if (asksForApproval(exec.arguments)) return next()

        return { kind: 'deny', reason: DENY_REASON }
      }),
    'auto-run: tool guard',
  )
}
