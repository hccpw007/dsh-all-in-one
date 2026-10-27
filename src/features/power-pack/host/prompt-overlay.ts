/**
 * 系统提示词的最外层兜底。
 *
 * 隔离行监听的是 `system-prompt/assemble` waterfall，但有些全局插件（例如
 * dsh-purge）还会把 `systemPrompt.assemble` **方法本身**包起来，在装配返回之后
 * 再改写文本。这条路径不经过任何事件，作用域监听器拦不到。
 *
 * 因此这里在宿主侧把 `assemble` 再包一层，成为最外层：预设里的隔离行在 waterfall
 * 最前面记下干净段落，方法返回后由这里替换回去。只对「写过快照的作用域」生效，
 * 未启用严格隔离的会话完全不受影响。
 *
 * 预设行与宿主入口是两个独立打包的模块，状态通过 `globalThis` 上的符号共享，
 * 避免各自持有一份 WeakMap 而互不可见。
 */
import type { AssemblySection, HostPluginContext, PromptAssembly } from '../../../types/host'

/** 共享状态的符号键；两个打包产物靠它拿到同一个对象。 */
const SHARED_KEY = Symbol.for('dsh-all-in-one.prompt-isolation')

/** 抢占检查间隔：全局插件会周期性重挂自己的包装，这里要能抢回来。 */
const CHECK_INTERVAL_MS = 3000

/** 共享的隔离状态。 */
interface IsolationState {
  /** 每个装配作用域的干净段落快照；只有严格隔离的会话会写入。 */
  snapshots: WeakMap<object, AssemblySection[]>
}

/** 包裹后的函数，带 dsh-purge 用来判断「已经包过」的字段。 */
interface PurgeAware {
  _dshPurgeWrapped?: boolean
  _dshPurgeSlot?: { rewrite: () => undefined }
}

/**
 * 取共享的隔离状态，首次调用时创建。
 * @returns 进程内唯一的快照表
 */
export function isolationState(): IsolationState {
  const holder = globalThis as unknown as Record<symbol, IsolationState | undefined>
  const existing = holder[SHARED_KEY]
  if (existing !== undefined) return existing

  const created: IsolationState = { snapshots: new WeakMap() }
  holder[SHARED_KEY] = created

  return created
}

/**
 * 判断一个值是否像装配结果。
 * @param value 待检查的值
 * @returns 结构符合时返回 true
 */
function isAssembly(value: unknown): value is PromptAssembly {
  return typeof value === 'object' && value !== null && Array.isArray((value as { sections?: unknown }).sections)
}

/**
 * 打上 dsh-purge 的「已包装」标记。
 *
 * dsh-purge 的 `installAssembleGuard` 一旦发现外层函数带这两个字段，就只更新自己的
 * rewrite 槽位、不再往上套新的一层——否则它会周期性重挂，永远盖在本层外面。
 * 即使字段名在未来版本改掉，下面的定时抢占也会把最外层抢回来。
 * @param fn 本模块生成的包装函数
 */
function markAsWrapped(fn: object): void {
  const target = fn as PurgeAware
  target._dshPurgeWrapped = true
  target._dshPurgeSlot ??= { rewrite: () => undefined }
}

/**
 * 安装最外层包装，并在生命周期内保持它是外层的。
 * @param ctx 宿主上下文，需要 systemPrompt 服务与 effect
 */
export function installPromptOverlay(ctx: HostPluginContext): void {
  const prompt = ctx.systemPrompt
  if (prompt === undefined) return

  ctx.effect(() => {
    /** 当前被包裹的下层实现。 */
    let inner: unknown
    /** 当前最外层包装。 */
    let wrapped: ((context: unknown) => Promise<unknown>) | undefined

    /** 用 `next` 作为下层实现重新生成最外层包装。 */
    const rebuild = (next: unknown): void => {
      if (typeof next !== 'function') return
      inner = next

      const current = async (context: unknown): Promise<unknown> => {
        const result = await (inner as (context: unknown) => Promise<unknown>)(context)
        if (!isAssembly(result)) return result

        const scope = (context as { scope?: unknown } | undefined)?.scope
        if (typeof scope !== 'object' || scope === null) return result

        const { snapshots } = isolationState()
        const clean = snapshots.get(scope)
        if (clean === undefined) return result

        // 一次装配一份快照：消费后删除，避免作用域对象长期持有文本
        snapshots.delete(scope)

        return { ...result, sections: clean }
      }

      markAsWrapped(current)
      wrapped = current

      try {
        Object.defineProperty(prompt, 'assemble', {
          configurable: true,
          enumerable: true,
          get: () => wrapped,
          // 外部替换 assemble 时以新函数为下层重新包装，保持最外层不变
          set: (nextValue: unknown) => {
            if (typeof nextValue === 'function' && nextValue !== wrapped) rebuild(nextValue)
          },
        })
      } catch (error) {
        // 服务对象不可配置时放弃兜底，隔离行的事件路径仍然生效
        console.error('[power-pack] 安装提示词外层包装失败:', error)
      }
    }

    /** 检查最外层是否仍属于本模块，必要时重新抢占。 */
    const sync = (): void => {
      try {
        if (wrapped !== undefined && prompt.assemble === wrapped) return
        rebuild(prompt.assemble)
      } catch (error) {
        console.error('[power-pack] 检查提示词外层包装失败:', error)
      }
    }

    // 首次安装可能早于全局插件加载，因此延迟一拍并周期性复查
    sync()
    const timer = setInterval(sync, CHECK_INTERVAL_MS)
    if (typeof timer.unref === 'function') timer.unref()

    return () => {
      clearInterval(timer)
      // 不主动还原 assemble：全局插件可能已把它当作底层实现持有，
      // 拆掉会让后续装配落到空的 sections 上。进程退出时一并释放。
    }
  }, 'power-pack: prompt overlay')
}
