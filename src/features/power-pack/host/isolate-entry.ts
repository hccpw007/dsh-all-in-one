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
import type {
  AssemblySection,
  PresetIsolateContext,
  PromptAssembly,
  PromptAssemblyContext,
} from '../../../types/host'

/** 装配 waterfall 的事件名，与宿主 `dsh-system-prompt` 一致。 */
const ASSEMBLE_EVENT = 'system-prompt/assemble'

/** 隔离行依赖工具注册表才能施加掩码。 */
export const inject = ['tools']

/** 预设行配置，由宿主侧按技能包规则计算后写入。 */
export interface IsolateRowConfig {
  /** 需要从该会话隐藏的全局工具名。 */
  denyTools?: string[]
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

/**
 * 安装工具掩码：先撤销上一轮，再按当前已注册的全局工具重新应用。
 *
 * 全局 MCP 的工具是异步发现的，可能在预设挂载之后才出现，所以要跟着
 * `tools/change` 重算；否则「排除全局 MCP」只在启动顺序恰好时生效。
 * @param ctx 预设作用域上下文
 * @param deny 需要屏蔽的工具名
 */
function installToolIsolation(ctx: PresetIsolateContext, deny: string[]): void {
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
            console.error('[power-pack] 撤销工具掩码失败:', error)
          }
          lift = undefined
        }

        // 尚未注册的名字会让宿主直接抛错，这里先按全局视图确认存在
        const existing = deny.filter((name) => {
          try {
            return ctx.tools.get(name) !== undefined
          } catch (error) {
            console.error('[power-pack] 读取全局工具失败:', name, error)
            return false
          }
        })
        if (existing.length === 0) return

        try {
          lift = ctx.tools.restrict({ deny: existing })
        } catch (error) {
          // 名字校验失败不该拖垮会话，留下日志即可
          console.error('[power-pack] 应用工具掩码失败:', error)
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
        console.error('[power-pack] 释放工具掩码失败:', error)
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
  const hide = stringList(config.hideSections).map((prefix) => prefix.toLowerCase())
  const strict = config.strict === true

  if (deny.length > 0) installToolIsolation(ctx, deny)
  if (strict || hide.length > 0) installPromptIsolation(ctx, strict, hide)
}
