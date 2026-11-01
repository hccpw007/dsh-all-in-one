/**
 * 「对话加速」的宿主侧工具改造。
 *
 * 两件事：
 *   1. 并发声明：给宿主里明确只读、但没声明 `isConcurrencySafe` 的工具补上声明。
 *      宿主按这个声明决定两个调用能否同时执行（`dsh-tools` 的 `executionMode`）。
 *   2. 批量编辑：注册 `edit_files`。它的 execute 直接转发给宿主官方 `edit` 的实现，
 *      因此路径解析、沙箱、唯一匹配校验、写前读取守卫与 diff 呈现与官方完全一致，
 *      只是把多处修改合成一次调用（写操作不能并发，这一层省的是模型往返次数）。
 *
 * 改造都在运行期完成：页面开关一变，`applyToolState` 重新应用一次即可生效。
 */
import type { AgentLike, HostPluginContext, ToolDefinitionLike, ToolExecLike } from '../../../types/host'
import { isEnabled, readChatAccelSettings } from './settings'

/** 宿主工具对象的最小形状：只需要执行、渲染与并发声明。 */
interface HostToolLike {
  execute(args: Record<string, unknown>, exec: unknown): Promise<Record<string, unknown>>
  output?: {
    render?: (
      args: Record<string, unknown>,
      value: Record<string, unknown>,
    ) => Array<{ type: 'text'; text: string }>
  }
  isConcurrencySafe?: (args: Record<string, unknown>) => boolean
}

/** 明确只读的工具：并发执行不会互相影响。写入类工具一律不在此列。 */
const READONLY_TOOL_NAMES = [
  'read',
  'read_image',
  'glob',
  'grep',
  'web_fetch',
  'web_search',
  'job_list',
  'job_output',
  'get_goal',
]

/** 批量编辑工具名。 */
const EDIT_FILES_NAME = 'edit_files'

/** 批量输出的 JSON Schema：合并后的一段文本。 */
const BATCH_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    text: { type: 'string', description: '合并后的工具结果文本。' },
  },
  required: ['text'],
  additionalProperties: false,
}

/** 当前已应用的清理函数；设置变化时先全部撤销，再按新设置重新应用。 */
let disposers: Array<() => void> = []

/** 已经被补过并发声明的工具对象；关闭条目时按它撤销，避免留下半改状态。 */
const patchedTools = new Set<HostToolLike>()

/**
 * 读取宿主工具定义。
 *
 * 内置工具挂在 agent 作用域而不是全局层，省略 `scope` 只能看到全局工具，
 * 因此执行时用 `exec.agent` 作为作用域。
 * @param ctx 宿主上下文
 * @param name 工具名
 * @param scope 作用域，通常是 `exec.agent`
 * @returns 工具对象；宿主未提供时返回 undefined
 */
function readHostTool(
  ctx: HostPluginContext,
  name: string,
  scope?: unknown,
): HostToolLike | undefined {
  const tool = scope === undefined ? ctx.tools?.get(name) : ctx.tools?.get(name, scope)
  if (tool === undefined || tool === null) return undefined

  return tool as HostToolLike
}

/**
 * 按 agent 的作用域给只读工具补并发声明。
 *
 * 内置工具挂在 agent 作用域而不是全局层，根作用域取不到；这里每步前按 agent
 * 解析一次，补过的工具记在集合里，不重复写。条目关闭时把补过的声明撤掉。
 * @param ctx 宿主上下文
 * @param agent 当前步的 Agent
 * @param enabled 条目是否启用
 */
export function applyConcurrencyForAgent(
  ctx: HostPluginContext,
  agent: AgentLike,
  enabled: boolean,
): void {
  if (!enabled) {
    for (const tool of patchedTools) delete tool.isConcurrencySafe

    patchedTools.clear()

    return
  }

  for (const name of READONLY_TOOL_NAMES) {
    const tool = readHostTool(ctx, name, agent)
    if (tool === undefined || typeof tool.isConcurrencySafe === 'function') continue
    if (patchedTools.has(tool)) continue

    try {
      tool.isConcurrencySafe = () => true
      patchedTools.add(tool)
    } catch (error) {
      // 工具对象若被冻结，赋值会抛错：跳过该工具，其余工具照常
      console.error(`[chat-accel] 无法为工具 ${name} 声明并发:`, error)
    }
  }
}

/**
 * 把一次官方工具调用渲染成模型可读文本。
 * @param tool 官方工具
 * @param args 官方参数
 * @param value 官方返回值
 * @returns 文本；官方渲染缺失时退回 JSON
 */
function renderHostResult(
  tool: HostToolLike,
  args: Record<string, unknown>,
  value: Record<string, unknown>,
): string {
  const rendered = tool.output?.render?.(args, value)
  if (rendered === undefined) return JSON.stringify(value)

  return rendered.map((block) => block.text).join('\n')
}

/**
 * 生成批量编辑工具定义。
 * @param ctx 宿主上下文
 * @returns 工具定义
 */
function createEditFilesTool(ctx: HostPluginContext): ToolDefinitionLike {
  return {
    name: EDIT_FILES_NAME,
    description:
      'Apply several independent literal-text edits in one call. Each entry keeps the same rules as edit: old_string must match exactly once unless replace_all is true.',
    parameters: {
      type: 'object',
      properties: {
        edits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              file_path: { type: 'string', description: 'Path to edit.' },
              old_string: { type: 'string', description: 'Literal text to replace.' },
              new_string: { type: 'string', description: 'Literal replacement text.' },
              replace_all: { type: 'boolean', description: 'Replace all matches. Defaults to false.' },
            },
            required: ['file_path', 'old_string', 'new_string'],
            additionalProperties: false,
          },
          description: 'Edits to apply in order.',
        },
      },
      required: ['edits'],
      additionalProperties: false,
    },
    output: {
      schema: BATCH_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: String(value['text'] ?? '') }],
    },
    execute: async (rawArgs, exec: ToolExecLike) => {
      const edit = readHostTool(ctx, 'edit', exec.agent)
      if (edit === undefined) throw new Error('宿主未提供 edit 工具，edit_files 不可用')

      const edits = Array.isArray(rawArgs['edits']) ? (rawArgs['edits'] as unknown[]) : []
      const blocks: string[] = []

      for (const entry of edits) {
        if (typeof entry !== 'object' || entry === null) {
          blocks.push('[edit_files] 忽略了一个非法编辑项')
          continue
        }

        const args = entry as Record<string, unknown>
        const path = typeof args['file_path'] === 'string' ? args['file_path'] : ''

        try {
          const value = await edit.execute(args, exec)
          blocks.push(renderHostResult(edit, args, value))
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          blocks.push(`[edit_files] ${path === '' ? '某项' : path} 修改失败: ${message}`)
        }
      }

      return { text: blocks.join('\n\n') }
    },
  }
}

/**
 * 注册一个工具，返回注销函数。
 * @param ctx 宿主上下文
 * @param definition 工具定义
 * @returns 注销函数
 */
function registerTool(ctx: HostPluginContext, definition: ToolDefinitionLike): () => void {
  const register = ctx.tools?.register
  if (register === undefined) {
    console.error('[chat-accel] 宿主工具注册表不支持 register，批量工具不会挂载')

    return () => undefined
  }

  try {
    return register.call(ctx.tools, definition)
  } catch (error) {
    // 同名工具已被别的插件占用时宿主会抛错：只丢这个批量工具，不影响其它功能
    console.error(`[chat-accel] 注册 ${definition.name} 失败:`, error)

    return () => undefined
  }
}

/** 撤销上一次应用的全部改造。 */
export function disposeToolState(): void {
  for (const dispose of disposers) dispose()
  disposers = []
}

/**
 * 按当前设置应用工具改造：并发声明、批量读写工具。
 *
 * 每次调用都先撤销上一次的结果，因此可以重复调用（设置变更后重新应用）。
 * @param ctx 宿主上下文
 */
export function applyToolState(ctx: HostPluginContext): void {
  disposeToolState()

  const settings = readChatAccelSettings()

  if (isEnabled(settings, 'batchEdit')) {
    disposers.push(registerTool(ctx, createEditFilesTool(ctx)))
  }
}
