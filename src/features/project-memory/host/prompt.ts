/**
 * 「项目记忆」的提示词注入。
 *
 * 只注入索引（`MEMORY.md`）：会话开始时模型就知道「这个项目有哪些记忆」，
 * 需要某条全文时用 memory 工具按名读取——与 Claude Code 一致，记忆再多也不会
 * 把每轮请求的上下文占满。
 *
 * 索引在每次装配系统提示词时读取，记忆被写入或删除后下一次请求即看到新索引
 * （开关打开但还没有记忆时注入目录与用法，让模型在用户说「记住…」时知道往哪写）。
 *
 * 装配每轮都会发生，因此读取结果按记忆目录缓存：索引指纹（mtime + 大小）没变
 * 就复用上次的文本；写入方在落盘后主动失效缓存，同一轮对话的下一次请求就能看到。
 */
import type { HostPluginContext, PromptAssemblyContext } from '../../../types/host'
import { resolveSessionDirectory } from './session-dir'
import { readMemorySettings } from './settings'
import { memoryDirForSession } from './state'
import { memoryIndexFingerprint, readMemoryIndex, renderMemoryIndex } from './store'

/** 段落名：出现在装配结果里，也是技能包隔离按前缀隐藏时的标识。 */
const SECTION_NAME = 'project-memory:index'

/** 段落在提示词里的位置：靠后，作为运行时事实而不是任务要求。 */
const SECTION_ORDER = 9500

/**
 * 「写入前先确认」的行为规则，开关开启时追加在索引之后。
 *
 * 门槛写严不写松：模型很容易把「这轮做过的事」也当成可记信息，导致每轮都提问。
 * 因此先要求默认不问，再给出四类准入、负面清单与询问前自查，把「打扰」压到最低。
 * 与索引文本分开拼接，不放进 `renderMemoryIndex`：开关变化不影响索引本身，
 * 没必要让索引渲染缓存跟着失效。
 */
const ASK_BEFORE_SAVE_POLICY = [
  '',
  '## 写入记忆前先确认',
  '默认不问也不写：只有本轮确实产生了「跨会话仍然有用」的事实时，才在完成本轮工作、结束回复前用 ask_user_question 询问一次。',
  '只对四类信息开口：用户的长期偏好与要求、对你做法的明确纠正或确认、不易从代码或 README 看出的项目约定与决策背景、以后会反复用到的外部资源指针。',
  '以下一律不问：一次性任务上下文（临时路径、中间结论、调试过程）、能从仓库直接查到的事实、记忆索引里已有的等价条目、令牌与密码等敏感信息。',
  '询问前先自问：这条信息在下一个会话里还有用吗？仓库里查得到吗？用户会希望它被记住吗？三问都通过才问。',
  '一轮最多询问一次，多条合并，附上每条拟写入的记忆摘要与正文预览；用户同意后用 memory 工具 action=save 写入，拒绝后不再追问同一条。',
  '- 用户明确要求「记住……」时直接写入，不再询问。',
  '- 提问工具不可用（例如全自动执行模式）时不要猜测用户意愿写入，也不要在回复里声称已记住。',
  '- 拿不准是否够格时选择不问：错过一次记忆比反复打扰代价小。',
].join('\n')

/** 每个记忆目录的渲染缓存；多项目并行时各用各的条目。 */
interface RenderCache {
  fingerprint: string
  text: string
}

/** 渲染缓存的容量上限：访问过的历史项目不能无限驻留索引全文。 */
const MAX_RENDER_CACHES = 32

const caches = new Map<string, RenderCache>()

/**
 * 取某个记忆目录要注入的索引文本。
 * @param dir 记忆目录
 * @returns 注入文本
 */
function memoryText(dir: string): string {
  const fingerprint = memoryIndexFingerprint(dir)
  const cached = caches.get(dir)
  if (cached !== undefined && cached.fingerprint === fingerprint) {
    // 命中后移到队尾：淘汰时丢掉的总是最久未用的那个项目
    caches.delete(dir)
    caches.set(dir, cached)

    return cached.text
  }

  const text = renderMemoryIndex(dir, readMemoryIndex(dir))
  caches.set(dir, { fingerprint, text })

  // 超出上限时淘汰最久未用的一条，避免切换过大量项目后驻留线性上升
  while (caches.size > MAX_RENDER_CACHES) {
    const oldest = caches.keys().next()
    if (oldest.done) break
    caches.delete(oldest.value)
  }

  return text
}

/**
 * 丢弃某个记忆目录的渲染缓存；记忆写入或删除后由记忆工具调用。
 * @param dir 记忆目录
 */
export function invalidateMemoryText(dir: string): void {
  caches.delete(dir)
}

/**
 * 按本次装配的会话计算注入文本；不在会话里或功能关闭时返回空串。
 * @param context 装配上下文
 * @returns 注入文本
 */
function textForAssembly(context: PromptAssemblyContext): string {
  try {
    const directory = resolveSessionDirectory(context.agent)
    if (directory === undefined) return ''

    const dir = memoryDirForSession(directory)
    if (dir === undefined) return ''

    const text = memoryText(dir)

    // 开关只影响这段规则文本：索引仍走指纹缓存，切换开关后下一次装配即生效
    return readMemorySettings().askBeforeSave ? `${text}\n${ASK_BEFORE_SAVE_POLICY}` : text
  } catch (error) {
    // 记忆读不出来不应拖垮整次装配：留日志，本轮当作没有记忆
    console.error('[project-memory] 渲染记忆失败:', error)

    return ''
  }
}

/**
 * 注册记忆提示词段落。
 * @param ctx 宿主上下文，需要 systemPrompt 服务
 */
export function installMemoryPrompt(ctx: HostPluginContext): void {
  const prompt = ctx.systemPrompt
  if (prompt === undefined) {
    console.error('[project-memory] 未取得 systemPrompt 服务，记忆不会进入上下文')
    return
  }

  ctx.effect(
    () =>
      prompt.section({
        name: SECTION_NAME,
        order: SECTION_ORDER,
        // 记忆是用户写入的原文，可能含 `{{...}}` 字样；不参与变量插值
        interpolate: false,
        text: textForAssembly,
      }),
    'project-memory: prompt',
  )
}
