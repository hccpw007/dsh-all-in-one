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
import { memoryDirForSession } from './state'
import { resolveSessionDirectory } from './session-dir'
import { memoryIndexFingerprint, readMemoryIndex, renderMemoryIndex } from './store'

/** 段落名：出现在装配结果里，也是技能包隔离按前缀隐藏时的标识。 */
const SECTION_NAME = 'project-memory:index'

/** 段落在提示词里的位置：靠后，作为运行时事实而不是任务要求。 */
const SECTION_ORDER = 9500

/** 每个记忆目录的渲染缓存；多项目并行时各用各的条目。 */
interface RenderCache {
  fingerprint: string
  text: string
}

const caches = new Map<string, RenderCache>()

/**
 * 取某个记忆目录要注入的索引文本。
 * @param dir 记忆目录
 * @returns 注入文本
 */
function memoryText(dir: string): string {
  const fingerprint = memoryIndexFingerprint(dir)
  const cached = caches.get(dir)
  if (cached !== undefined && cached.fingerprint === fingerprint) return cached.text

  const text = renderMemoryIndex(dir, readMemoryIndex(dir))
  caches.set(dir, { fingerprint, text })

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

    return memoryText(dir)
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
