/**
 * 记忆工具的注册。
 *
 * 模型通过 `memory` 工具把「请帮我记住…」之类的指令写进项目记忆目录，
 * 与 Claude Code 的写入方式一致：单条一个 Markdown 文件，索引同步追加一行。
 *
 * 不引入宿主包 `@deepseek-ai/dsh-tools` 的 `defineTool`：插件产物由 esbuild 打成
 * 单文件，宿主包不在依赖里；这里直接按宿主 `tools.register` 要求的形状提供
 * JSON Schema 子集（type/properties/required/items/enum + 注释）。
 */
import type { HostPluginContext, ToolDefinitionLike, ToolExecLike } from '../../../types/host'
import {
  MEMORY_TYPES,
  deleteMemory,
  isValidMemoryName,
  readMemories,
  readMemory,
  readMemoryIndex,
  writeMemory,
  type MemoryType,
} from './store'
import { resolveSessionDirectory } from './session-dir'
import { invalidateMemoryText } from './prompt'
import { memoryDirForSession } from './state'

/** 工具名，与 Claude Code 的记忆概念保持同一叫法。 */
const MEMORY_TOOL_NAME = 'memory'

/** 工具说明；写清「何时用」与「索引已在上下文」比只写参数更重要。 */
const TOOL_DESCRIPTION = [
  '读写当前项目的长期记忆。记忆按项目隔离，由本项目的多个会话共享。',
  '系统提示词里已带上 MEMORY.md 索引（每条一行）。要了解某条记忆的全文，用 action=read 按名读取；',
  '只在索引指出了相关内容时才读，不要一次性把所有记忆读进来。',
  '当用户要求「记住」某事、纠正你的做法、提出长期偏好，或项目中形成不易从代码看出的约定与决定时，用 action=save 写入一条记忆。',
  '写入前先看索引（需要时用 action=list）：同一主题应更新原条目（同名写入即覆盖），不要重复新建；有误或已过期的条目用 action=delete 删除。',
].join('')

/** 记忆工具的参数，按宿主支持的 JSON Schema 子集书写（required 是对象级的字符串数组）。 */
const PARAMETERS = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      enum: ['save', 'list', 'read', 'delete'],
      description: 'save 写入或覆盖一条记忆；list 列出全部；read 读取一条；delete 删除一条。',
    },
    name: {
      type: 'string',
      description: '记忆名，kebab-case（小写字母、数字、连字符），同时是文件名。save/read/delete 必填。',
    },
    description: {
      type: 'string',
      description: '一句话摘要，用于索引与后续会话判断相关性。save 必填。',
    },
    type: {
      type: 'string',
      enum: [...MEMORY_TYPES],
      description: '记忆类型：user（用户是谁、偏好）、feedback（工作方式的纠正与确认）、project（进行中的工作与约束）、reference（外部资源指针）。默认 project。',
    },
    content: {
      type: 'string',
      description: '记忆正文。写清事实本身；feedback/project 类型追加「Why:」与「How to apply:」两行。save 必填。',
    },
  },
  required: ['action'],
  additionalProperties: false,
}

/** 输出 schema：统一返回动作结果与当前记忆清单，便于模型确认写入效果。 */
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: '动作是否成功。' },
    message: { type: 'string', description: '给模型的简短结果说明。' },
    directory: { type: 'string', description: '本次使用的记忆目录。' },
    index: { type: 'string', description: '索引文件的当前内容。' },
    content: { type: 'string', description: 'read 时为记忆全文，其余动作为空串。' },
  },
  required: ['ok', 'message', 'directory', 'index', 'content'],
  additionalProperties: false,
}

/** 工具参数，已按宿主 schema 校验过。 */
interface MemoryArgs {
  action: string
  name?: string
  description?: string
  type?: string
  content?: string
}

/**
 * 收窄参数中可选的字符串字段。
 * @param value 原始值
 * @returns 去空白后的字符串；缺失或类型不对时返回空串
 */
function optionalText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * 按动作执行一次记忆读写。
 * @param args 已校验的参数
 * @param dir 记忆目录
 * @returns 工具输出
 */
function runAction(args: MemoryArgs, dir: string): {
  ok: boolean
  message: string
  directory: string
  index: string
  content: string
} {
  const name = optionalText(args.name)
  // 工具结果里的「当前索引」直接回读 MEMORY.md，与注入上下文的那份保持一致
  const index = (): string => readMemoryIndex(dir)

  if (args.action === 'list') {
    const entries = readMemories(dir)
    return {
      ok: true,
      message: entries.length === 0
        ? '当前项目还没有记忆。'
        : `共 ${entries.length} 条记忆：${entries.map((entry) => `${entry.name}（${entry.type}）`).join('、')}`,
      directory: dir,
      index: index(),
      content: '',
    }
  }

  if (!isValidMemoryName(name)) {
    return {
      ok: false,
      message: `记忆名不合法：${name === '' ? '（空）' : name}，只允许小写字母、数字与连字符。`,
      directory: dir,
      index: index(),
      content: '',
    }
  }

  if (args.action === 'read') {
    const entry = readMemory(dir, name)
    if (entry === undefined) {
      return { ok: false, message: `记忆 ${name} 不存在。`, directory: dir, index: index(), content: '' }
    }

    return {
      ok: true,
      message: `已读取记忆 ${name}（${entry.type}）。`,
      directory: dir,
      index: index(),
      content: entry.content.trim(),
    }
  }

  if (args.action === 'delete') {
    const removed = deleteMemory(dir, name)
    return {
      ok: removed,
      message: removed ? `已删除记忆 ${name}。` : `记忆 ${name} 不存在，已清理索引。`,
      directory: dir,
      index: index(),
      content: '',
    }
  }

  if (args.action === 'save') {
    const description = optionalText(args.description)
    const content = optionalText(args.content)
    const type = optionalText(args.type)

    if (description === '' || content === '') {
      return {
        ok: false,
        message: 'save 需要同时提供 description 与 content：前者是一句话摘要，后者是记忆正文。',
        directory: dir,
        index: index(),
        content: '',
      }
    }

    const savedType: MemoryType | undefined = MEMORY_TYPES.find((item) => item === type)
    const file = writeMemory(dir, { name, description, content, ...savedType ? { type: savedType } : {} })

    return {
      ok: true,
      message: `已写入记忆 ${name}（${savedType ?? 'project'}）：${file}`,
      directory: dir,
      index: index(),
      content: '',
    }
  }

  return {
    ok: false,
    message: `未知动作：${args.action}`,
    directory: dir,
    index: index(),
    content: '',
  }
}

/**
 * 生成工具定义。
 * @returns 供 `tools.register` 使用的定义
 */
function createMemoryTool(): ToolDefinitionLike {
  return {
    name: MEMORY_TOOL_NAME,
    description: TOOL_DESCRIPTION,
    parameters: PARAMETERS,
    output: {
      schema: OUTPUT_SCHEMA,
      render: (_args, value) => [
        { type: 'text', text: `[project-memory] ${String(value['message'] ?? '')}` },
      ],
    },
    execute: async (rawArgs, exec: ToolExecLike) => {
      const args = rawArgs as unknown as MemoryArgs
      const directory = resolveSessionDirectory(exec.agent)

      if (directory === undefined) {
        return {
          ok: false,
          message: '当前会话没有工作目录，无法定位项目记忆。',
          directory: '',
          index: '',
          content: '',
        }
      }

      const dir = memoryDirForSession(directory)
      if (dir === undefined) {
        return {
          ok: false,
          message: '项目记忆已关闭：请在「设置 → All In One → 项目记忆」里打开开关。',
          directory: '',
          index: '',
          content: '',
        }
      }

      try {
        const result = runAction(args, dir)
        // 写入或删除后丢掉这一轮的渲染缓存：同一对话的下一次请求立即看到新内容
        if (args.action === 'save' || args.action === 'delete') invalidateMemoryText(dir)

        return result
      } catch (error) {
        console.error('[project-memory] 记忆工具执行失败:', error)
        throw error
      }
    },
  }
}

/**
 * 注册记忆工具；宿主未提供 `register` 时跳过，其余功能不受影响。
 * @param ctx 宿主上下文
 */
export function installMemoryTool(ctx: HostPluginContext): void {
  const tools = ctx.tools
  if (tools?.register === undefined) {
    console.error('[project-memory] 宿主工具注册表不支持 register，记忆工具不会挂载')
    return
  }

  ctx.effect(() => {
    try {
      return tools.register?.(createMemoryTool()) ?? (() => undefined)
    } catch (error) {
      // 同名工具已被别的插件占用时宿主会抛错：只丢记忆工具，不影响提示词与设置页
      console.error('[project-memory] 注册 memory 工具失败:', error)

      return () => undefined
    }
  }, 'project-memory: tool')
}
