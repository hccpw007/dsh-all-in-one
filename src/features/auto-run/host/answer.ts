/**
 * 「全自动执行」的询问自动应答。
 *
 * 自动模式并不隐藏 ask_user_question（它是预设内注册的 Agent 局部工具，
 * 插件无法从根作用域掩码掉），而是在 Agent 自己的作用域上挂一个应答器：
 * 模型一旦提问，宿主的水位线会先问到这里，非权限类问题立刻按首选项作答，
 * 模型拿到答案继续执行，整轮对话不中断。
 *
 * 权限审批（intent.kind 为 approval）明确交回原有流程：那代表用户本人的授权，
 * 自动模式只代替「选择与确认」，不代替「授权」。
 */
import type { HostPluginContext, UserQuestionAnswerLike, UserQuestionRequestLike } from '../../../types/host'

import { isAutoRunEnabled } from './settings'

/**
 * 没有选项时的自定答复。
 *
 * 告诉模型「按最佳判断继续」，而不是给一个具体决定：问题内容不可预知，
 * 与其猜一个可能错误的答案，不如让它按上下文自行定夺。
 */
const AUTO_ANSWER_CUSTOM = '自动模式：按你的最佳判断继续，不要再次询问。'

/**
 * 为一道题挑选自动答案。
 * @param question 单个问题
 * @returns 答案项；该题需要用户本人授权时返回 undefined
 */
function answerQuestion(
  question: UserQuestionRequestLike['questions'][number],
): UserQuestionAnswerLike['answers'][number] | undefined {
  // 权限审批代表用户授权范围，自动模式不代答
  if (question.intent?.kind === 'approval') return undefined

  const options = question.options ?? []

  // 计划审阅按 intent 声明的批准标签走，其余问题取第一个选项（宿主约定首项为推荐项）
  const approveLabel = question.intent?.kind === 'plan-review' ? question.intent.approve : undefined
  const preferred =
    approveLabel === undefined
      ? options[0]
      : options.find((option) => option.label === approveLabel) ?? options[0]

  if (preferred !== undefined) {
    return { id: question.id, selected: [preferred.label] }
  }

  return { id: question.id, selected: [], custom: AUTO_ANSWER_CUSTOM }
}

/**
 * 把一次询问请求整体转成自动答案。
 * @param request 询问请求
 * @returns 完整答案；任一题无法自动作答时返回 undefined
 */
function buildAutoAnswer(request: UserQuestionRequestLike): UserQuestionAnswerLike | undefined {
  const answers: UserQuestionAnswerLike['answers'] = []

  // 逐题作答：只要有一题属于授权类，整批交回原有流程，避免半自动的混合答复
  for (const question of request.questions) {
    const answer = answerQuestion(question)
    if (answer === undefined) return undefined

    answers.push(answer)
  }

  return answers.length === 0 ? undefined : { answers }
}

/**
 * 在 Agent 作用域上安装一次应答器。
 *
 * 注册必须发生在 agent.ctx 上：询问请求按 Agent 作用域派发，注册在插件根作用域
 * 的监听器收不到其它 Agent 的请求。安装成功后再记入已安装集合，失败时留待
 * 下一步重试。
 * @param installed 已安装过的 Agent 集合
 * @param agent Agent 最小形状
 */
function installForAgent(
  installed: WeakSet<object>,
  agent: { session: { id: string }; ctx?: HostPluginContext },
): void {
  if (installed.has(agent)) return

  const agentCtx = agent.ctx
  // Agent 作用域尚未就绪：不标记，下一步再来
  if (agentCtx === undefined) return

  try {
    agentCtx.on('user-questions/request', async (request, next) => {
      // 开关按每次请求重新读取：用户在对话中途关掉自动模式后，下一次提问就应恢复阻塞
      if (!isAutoRunEnabled(agent.session.id)) return next()

      const answer = buildAutoAnswer(request)
      if (answer === undefined) return next()

      return answer
    }, { prepend: true })
    installed.add(agent)
  } catch (error) {
    console.error('[auto-run] 注册询问应答失败:', error)
  }
}

/**
 * 订阅 Agent 生命周期，为每个 Agent 安装应答器。
 *
 * `agent/created` 一到就装，agent 作用域此时已就绪；同时保留 `agent/pre-step` 兜底，
 * 覆盖「监听器装上之前就已有 Agent」的场景。WeakSet 保证同一 Agent 只安装一次。
 * @param ctx 宿主上下文
 */
export function installAutoRunAnswerer(ctx: HostPluginContext): void {
  // Agent 只注册一次；Agent 销毁后由宿主清理其作用域上的监听器
  const installed = new WeakSet<object>()

  ctx.effect(() => {
    const offCreated = ctx.on('agent/created', ({ agent }) => {
      installForAgent(installed, agent)
    }, { prepend: true })

    const offPreStep = ctx.on('agent/pre-step', async ({ agent }, next) => {
      installForAgent(installed, agent)

      return next()
    })

    return () => {
      offCreated()
      offPreStep()
    }
  }, 'auto-run: answerer')
}
