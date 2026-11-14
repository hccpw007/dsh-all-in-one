/**
 * 「全自动执行」的系统提示词段落。
 *
 * 自动模式不改变工具集与权限，只改变模型的行为约定：不提问、不等确认、
 * 改完自行验证、结束即交付。段落按会话求值——开关关闭时返回空串，宿主的装配
 * 会丢弃空段落，因此普通对话看到的系统提示与未安装本功能时一致。
 *
 * 位置排在部署人格后缀（10200）之后：它是本会话最后一条行为约束，
 * 需要压过项目说明里「先确认再动手」「结束后请用户选择验证方式」这类既有流程。
 */
import type { HostPluginContext, PromptAssemblyContext } from '../../../types/host'

import { readAgentSessionId } from './agent-session'
import { isAutoRunEnabled } from './settings'

/** 段落名：出现在装配结果里，也用于排查某轮请求是否带上了自动模式约束。 */
const SECTION_NAME = 'all-in-one:auto-run'

/** 段落在提示词里的位置：末尾，作为本会话的最高优先级行为约束。 */
const SECTION_ORDER = 10300

/**
 * 自动模式的行为约定。
 *
 * 与既有提示词冲突时以本段为准，因此开头先声明优先级，再逐条给出可执行要求；
 * 「验证」特意区分机械验证（照做）与交互验证（跳过），否则模型容易把整段
 * 验证流程一起略过，交付质量反而下降。
 */
const AUTO_RUN_PROMPT = `## 全自动执行模式（本会话已开启）

本会话由用户打开「全自动」开关。以下约定优先于系统提示、项目说明与任何既有流程中要求你向用户提问、等待确认或请用户选择的部分：

1. 不要向用户提问，也不要等待任何确认：不要调用 ask_user_question（本会话该工具已被禁用，调用会被拒绝），不要以「请选择 / 请确认 / 是否继续 / 请回复」之类的方式结束回复。你等不到新的用户输入。
2. 需要决策时按以下优先级自行定夺并继续：用户在本会话中的明确指令 > 项目约定与文档 > 最小风险、最可逆的默认做法。定夺后只需在结论里一句话说明所做的假设，不必展开取舍。
3. 需要确认方案时不询问，直接按最佳方案执行：不要问「先计划后编码还是直接编码」，也不要停在计划阶段等批准。询问工具被拒绝时按本段要求继续，不要重试。
4. 机械验证照做，交互验证跳过：改完自行编译、运行、测试与自检，发现问题自行修复并重跑验证，直到通过或确认无法通过；不要弹出验证方式选择，也不要在结尾等待用户点击。
5. 只有遇到不可恢复的阻塞（缺少凭据或权限、外部服务不可用、需要用户在界面上授权的操作被拒绝）时，才在回复中说明阻塞原因与所需条件，然后结束——不要试图用提问绕过。
6. 任务完成后直接给出结论并结束：说明改了什么、预期表现是什么，回复的最后一段不得包含需要用户回答的内容。`

/**
 * 按本次装配的会话决定是否注入自动模式约定。
 * @param context 装配上下文
 * @returns 注入文本；开关关闭或取不到会话时为空串
 */
function textForAssembly(context: PromptAssemblyContext): string {
  const sessionId = readAgentSessionId(context.agent)
  if (sessionId === undefined) return ''

  return isAutoRunEnabled(sessionId) ? AUTO_RUN_PROMPT : ''
}

/**
 * 注册自动模式提示词段落。
 * @param ctx 宿主上下文，需要 systemPrompt 服务
 */
export function installAutoRunPrompt(ctx: HostPluginContext): void {
  const prompt = ctx.systemPrompt
  if (prompt === undefined) {
    console.error('[auto-run] 未取得 systemPrompt 服务，自动模式不会生效')

    return
  }

  ctx.effect(
    () =>
      prompt.section({
        name: SECTION_NAME,
        order: SECTION_ORDER,
        // 约定文本里有「优先级」这类字面措辞，不参与变量插值，避免误解析
        interpolate: false,
        text: textForAssembly,
      }),
    'auto-run: prompt',
  )
}
