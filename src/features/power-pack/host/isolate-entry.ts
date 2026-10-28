/**
 * 「技能包」在预设内部挂载的隔离行。
 *
 * 预设行只能增加能力，删不掉宿主全局组合里的插件与 MCP：它们的工具注册在全局
 * 层，每个会话都会继承；它们对系统提示词的改写也通过装配 waterfall 直达所有
 * Agent。这一行在预设作用域里做两件事：
 *
 * 1. 用 `tools.restrict()` 屏蔽被技能包排除的全局工具；
 * 2. 在装配 waterfall 上先取一份快照，等下游（全局注入器）改完后还原快照，
 *    从而只把「本技能包声明的提示词」交给模型。
 *
 * 两个动作都绑定预设作用域，因此只影响该预设下的会话。
 */
import { appendFileSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type {
  AssemblySection,
  PresetIsolateContext,
  PresetToolsApi,
  PromptAssembly,
  PromptAssemblyContext,
} from '../../../types/host'

import { isInactiveContextError } from './context-error'
import { isolationState } from './prompt-overlay'

/** 装配 waterfall 的事件名，与宿主 `dsh-system-prompt` 一致。 */
const ASSEMBLE_EVENT = 'system-prompt/assemble'

/** 隔离行依赖工具注册表才能施加掩码。 */
export const inject = ['tools']

/** 诊断日志的上限：只用于确认隔离是否执行，超出后重写清空。 */
const LOG_MAX_BYTES = 256 * 1024

/**
 * 把一行诊断写进 `$DSH_HOME/all-in-one/isolate.log`。
 *
 * 隔离行运行在预设作用域里，控制台输出会被宿主日志淹没；写文件让用户能直接确认
 * 「这一行有没有加载、掩码命中了几个工具」。写失败不能影响隔离本身。
 * @param message 诊断内容
 */
function writeDiagnostic(message: string): void {
  try {
    const home = process.env.DSH_HOME?.trim() || join(homedir(), '.dsh')
    const dir = join(home, 'all-in-one')
    mkdirSync(dir, { recursive: true })

    const file = join(dir, 'isolate.log')
    try {
      if (statSync(file).size > LOG_MAX_BYTES) writeFileSync(file, '', 'utf8')
    } catch {
      // 文件不存在是首次写入的正常情况
    }

    appendFileSync(file, `${new Date().toISOString()} ${message}\n`, 'utf8')
  } catch (error) {
    console.error('[power-pack] 写入隔离日志失败:', error)
  }
}

/** 预设行配置，由宿主侧按技能包规则计算后写入。 */
export interface IsolateRowConfig {
  /** 需要从该会话隐藏的全局工具名。 */
  denyTools?: string[]
  /** 需要从该会话隐藏其全部工具的 MCP 服务器名；工具名按前缀在运行期解析。 */
  denyMcpServers?: string[]
  /** 需要从该会话提示词中移除的段名前缀。 */
  hideSections?: string[]
  /** 是否丢弃下游对提示词的改写（严格隔离）。 */
  strict?: boolean
}

/** 从装配结果里保留的纯数据快照。 */
interface AssemblySnapshot {
  sections: AssemblySection[]
  contexts: AssemblySection[]
}

/** 收窄字符串数组，忽略非字符串项。 */
function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/**
 * 判断一个值是否是装配结果。
 * @param value 待检查的值
 * @returns 结构符合时返回 true
 */
function isAssembly(value: unknown): value is PromptAssembly {
  return typeof value === 'object' && value !== null && Array.isArray((value as { sections?: unknown }).sections)
}

/**
 * 复制装配结果的段落部分。
 *
 * 快照必须与后续改写脱钩：宿主与插件都会原地替换 `sections` 数组元素，
 * 共享引用会让「还原」读到已被改写的文本。
 * @param assembly 装配结果
 * @returns 段落快照
 */
function captureSnapshot(assembly: PromptAssembly): AssemblySnapshot {
  try {
    return structuredClone({ sections: assembly.sections, contexts: assembly.contexts })
  } catch (error) {
    // 段落理论上都是纯数据；出现不可克隆值时退化为浅拷贝，至少保留顺序
    console.error('[power-pack] 复制提示词装配失败:', error)
    return { sections: [...assembly.sections], contexts: [...assembly.contexts] }
  }
}

/**
 * 去掉命中前缀的段落。
 * @param sections 段落列表
 * @param prefixes 段名前缀，全部小写
 * @returns 过滤后的段落
 */
function hideByPrefix(sections: AssemblySection[], prefixes: string[]): AssemblySection[] {
  if (prefixes.length === 0) return sections

  return sections.filter((section) => {
    const name = String(section?.name ?? '').toLowerCase()
    return !prefixes.some((prefix) => name.startsWith(prefix))
  })
}

/** MCP 公开工具名前缀与分隔符：`mcp__<serverName>__<rawName>`。 */
const MCP_TOOL_PREFIX = 'mcp__'
const MCP_NAME_SEPARATOR = '__'

/**
 * 从全局工具视图里取出被排除的 MCP 服务器的全部工具。
 *
 * 只按服务器名前缀匹配：MCP 工具是连接后异步发现的，工具清单随连接状态变化，
 * 固化在预设行里的名字会在启动早期缺项。工具变化时会再次调用本函数。
 * @param tools 预设作用域的工具注册表
 * @param servers 需要屏蔽的服务器名
 * @returns 命中的公开工具名
 */
function mcpToolNames(tools: PresetToolsApi, servers: string[]): string[] {
  if (servers.length === 0) return []

  const wanted = new Set(servers)
  const names: string[] = []

  try {
    for (const schema of tools.schemas()) {
      const name = typeof schema?.name === 'string' ? schema.name : ''
      if (!name.startsWith(MCP_TOOL_PREFIX)) continue

      const rest = name.slice(MCP_TOOL_PREFIX.length)
      const separator = rest.indexOf(MCP_NAME_SEPARATOR)
      if (separator <= 0) continue
      if (wanted.has(rest.slice(0, separator))) names.push(name)
    }
  } catch (error) {
    console.error('[power-pack] 枚举 MCP 工具失败:', error)
  }

  return names
}

/**
 * 安装工具掩码：先撤销上一轮，再按当前已注册的全局工具重新应用。
 *
 * 全局 MCP 的工具是异步发现的，可能在预设挂载之后才出现，所以要跟着
 * `tools/change` 重算；否则「排除全局 MCP」只在启动顺序恰好时生效。
 * @param ctx 预设作用域上下文
 * @param deny 需要屏蔽的工具名
 * @param mcpServers 需要屏蔽其全部工具的 MCP 服务器名
 */
function installToolIsolation(
  ctx: PresetIsolateContext,
  deny: string[],
  mcpServers: string[],
): void {
  ctx.effect(() => {
    let lift: (() => void) | undefined
    // 宿主在挂载与撤销掩码时都会同步发出 tools/change：不加这道闸，
    // 监听器会处理自己造成的变更而无限自激，把整个宿主进程拖到满核
    let applying = false

    const apply = (): void => {
      if (applying) return

      applying = true
      try {
        if (lift !== undefined) {
          try {
            lift()
          } catch (error) {
            // 上下文失效时撤销本身也会失败，属热重载收尾噪音，不必再报
            if (!isInactiveContextError(error)) {
              console.error('[power-pack] 撤销工具掩码失败:', error)
            }
          }
          lift = undefined
        }

        // MCP 工具随连接变化，每次重算时都要并入静态名单
        const names = [...new Set([...deny, ...mcpToolNames(ctx.tools, mcpServers)])]

        // 尚未注册的名字会让宿主直接抛错，这里先按全局视图确认存在
        const existing = names.filter((name) => {
          try {
            return ctx.tools.get(name) !== undefined
          } catch (error) {
            if (!isInactiveContextError(error)) {
              console.error('[power-pack] 读取全局工具失败:', name, error)
            }

            return false
          }
        })
        if (existing.length === 0) return

        try {
          lift = ctx.tools.restrict({ deny: existing })
        } catch (error) {
          // 名字校验失败不该拖垮会话，留下日志即可；
          // 上下文失效是热重载时旧 fiber 已销毁的正常收尾，跳过以免刷屏
          if (!isInactiveContextError(error)) {
            console.error('[power-pack] 应用工具掩码失败:', error)
          }

          lift = undefined
        }
      } finally {
        applying = false
      }
    }

    apply()
    const off = ctx.on('tools/change', apply)

    return () => {
      off()
      if (lift === undefined) return
      try {
        lift()
      } catch (error) {
        if (!isInactiveContextError(error)) {
          console.error('[power-pack] 释放工具掩码失败:', error)
        }
      }
      lift = undefined
    }
  }, 'power-pack: 工具隔离')
}

/**
 * 安装提示词隔离。
 *
 * 监听器排在 waterfall 最前面，因此先拿到全局插件改写前的装配；等下游跑完，
 * 严格模式用快照替换段落（上下文仍取下游结果，工作目录等运行时事实由下游补齐），
 * 非严格模式只按前缀删段。
 * @param ctx 预设作用域上下文
 * @param strict 是否丢弃下游改写
 * @param hidePrefixes 段名前缀，全部小写
 */
function installPromptIsolation(
  ctx: PresetIsolateContext,
  strict: boolean,
  hidePrefixes: string[],
): void {
  // 装配每个步骤都会跑，只在首次记录，避免日志被刷满
  let firstAssembly = false

  ctx.effect(
    () =>
      ctx.on(
        ASSEMBLE_EVENT,
        async (...args: unknown[]) => {
          const assembly = args[0]
          const context = args[1] as PromptAssemblyContext | undefined
          const next = args[args.length - 1]
          if (!isAssembly(assembly)) return next
          if (context?.scope === undefined) return next

          const snapshot = captureSnapshot(assembly)
          if (!firstAssembly) {
            firstAssembly = true
            writeDiagnostic(`prompt isolated: strict=${strict} hide=${hidePrefixes.join(',') || '(none)'}`)
          }

          // 全局插件可能在方法层再改写一次（不经过 waterfall），把干净段落交给
          // 宿主侧的最外层包装，由它在装配返回后替换回来
          if (strict && typeof context.scope === 'object' && context.scope !== null) {
            isolationState().snapshots.set(context.scope, hideByPrefix(snapshot.sections, hidePrefixes))
          }

          let result: unknown = assembly
          if (typeof next === 'function') {
            try {
              result = await next()
            } catch (error) {
              // 下游任一环节抛错都会让整次装配失败，退回本次的入口装配
              console.error('[power-pack] 提示词 waterfall 下游失败:', error)
              result = assembly
            }
          }

          if (!isAssembly(result)) return result

          if (strict) {
            return {
              ...result,
              sections: hideByPrefix(snapshot.sections, hidePrefixes),
              // 运行时上下文（工作目录等）由下游按当前会话补齐，不能回退成快照
              contexts: hideByPrefix(result.contexts, hidePrefixes),
            }
          }

          return { ...result, sections: hideByPrefix(result.sections, hidePrefixes) }
        },
        { prepend: true },
      ),
    'power-pack: 提示词隔离',
  )
}

/**
 * 注册隔离动作。
 * @param ctx 预设作用域内的宿主上下文
 * @param config 预设行配置
 */
export function apply(ctx: PresetIsolateContext, config: IsolateRowConfig = {}): void {
  const deny = stringList(config.denyTools)
  const mcpServers = stringList(config.denyMcpServers)
  const hide = stringList(config.hideSections).map((prefix) => prefix.toLowerCase())
  const strict = config.strict === true

  writeDiagnostic(
    `apply deny=${deny.length} mcp=${mcpServers.join(',') || '(none)'} hide=${hide.join(',') || '(none)'} strict=${strict}`,
  )

  if (deny.length > 0 || mcpServers.length > 0) installToolIsolation(ctx, deny, mcpServers)
  if (strict || hide.length > 0) installPromptIsolation(ctx, strict, hide)
}
