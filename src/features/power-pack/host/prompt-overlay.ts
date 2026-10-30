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

/** 连续重建次数上限：超过后认为有其它插件在周期性抢占，巡检降频以免持续增层。 */
const MAX_CONSECUTIVE_REBUILDS = 20

/** 降频后的巡检间隔。 */
const SLOW_CHECK_INTERVAL_MS = 30_000

/** 装配方法形态：宿主实现依赖 `this`，调用时必须带上服务对象。 */
type PromptAssemble = (this: unknown, context: unknown) => Promise<unknown>

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

/** 记在本模块包装函数上的下层实现，用于穿透自产包装、避免自引用递归。 */
const OVERLAY_INNER = Symbol.for('dsh-all-in-one.prompt-overlay.inner')

/** 记录了下层实现的包装函数。 */
interface OverlayAware {
  [OVERLAY_INNER]?: PromptAssemble
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
 * 记下包装函数对应的下层实现。
 * @param fn 本模块生成的包装函数
 * @param inner 它包裹的实现
 */
function markOverlay(fn: PromptAssemble, inner: PromptAssemble): void {
  ;(fn as OverlayAware)[OVERLAY_INNER] = inner
}

/**
 * 把一个读到的 `assemble` 递归剥掉本模块的包装。
 *
 * 全局插件会把自己的包装存起来并在之后重新赋值，读回来的 `assemble` 可能就是我们
 * 自己的某一层。若直接把它当作下层实现重新包装，会得到调用自身的循环，直接栈溢出。
 * @param value 从服务对象读到的 `assemble`
 * @returns 最底层的实现
 */
function unwrapOverlay(value: PromptAssemble): PromptAssemble {
  let current = value
  const seen = new Set<PromptAssemble>()

  while (seen.size < 32 && !seen.has(current)) {
    seen.add(current)
    const inner = (current as OverlayAware)[OVERLAY_INNER]
    if (typeof inner !== 'function') break
    current = inner
  }

  return current
}

/**
 * 安装最外层包装，并在生命周期内保持它是外层的。
 * @param ctx 宿主上下文，需要 systemPrompt 服务与 effect
 */
export function installPromptOverlay(ctx: HostPluginContext): void {
  const prompt = ctx.systemPrompt
  if (prompt === undefined) return

  ctx.effect(() => {
    /** 当前最外层包装。 */
    let wrapped: PromptAssemble | undefined
    /** 本模块挂在 `assemble` 上的 getter，用于判断 accessor 是否仍归本模块所有。 */
    let getter: (() => PromptAssemble | undefined) | undefined
    /** 当前包装所包裹的下层实现，用于识别「下层没变、只是被重新赋值」的情况。 */
    let innerBase: PromptAssemble | undefined
    /** 巡检定时器；降频时整体替换。 */
    let timer: ReturnType<typeof setInterval> | undefined
    /** 当前巡检间隔。 */
    let intervalMs = CHECK_INTERVAL_MS
    /** 连续重建次数，用于把被反复抢占的情况降频。 */
    let rebuildCount = 0

    /** 用 `next` 作为下层实现重新生成最外层包装。 */
    const rebuild = (next: PromptAssemble): void => {
      // 必须捕获成常量：若包装体读的是可变的 `inner`，重建后旧包装又会读到新值，
      // 形成「包装调用自己」的无限递归，一次检查就能把调用栈压爆。
      // 同时剥掉自己的旧包装——全局插件常把读到的 assemble 原样存回去。
      const base = unwrapOverlay(next)

      // 下层实现没变时复用已有包装：周期性检查每次都会读到同一实现，
      // 每轮新建闭包会让装配调用链随时间变长
      if (innerBase === base && wrapped !== undefined) return
      innerBase = base

      const current = async (context: unknown): Promise<unknown> => {
        const result = await base.call(prompt, context)
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
      markOverlay(current, base)
      wrapped = current
    }

    getter = () => wrapped

    /**
     * 判断 `assemble` 当前是否已是本模块的 accessor。
     *
     * 宿主每次读服务方法都返回新的 traceable 代理，因此不能用
     * `prompt.assemble === wrapped` 判断——那样每次都判定为「被替换」，
     * 每轮检查都会再包一层，最终把调用栈压爆。
     */
    const isInstalled = (): boolean => {
      if (getter === undefined) return false
      const descriptor = Object.getOwnPropertyDescriptor(prompt, 'assemble')

      return descriptor?.get === getter
    }

    /** 把 accessor 挂到服务对象上；外部赋值时重建包装。 */
    const attach = (): void => {
      Object.defineProperty(prompt, 'assemble', {
        configurable: true,
        enumerable: true,
        get: getter,
        set: (nextValue: unknown) => {
          if (typeof nextValue === 'function') rebuild(nextValue as PromptAssemble)
        },
      })
    }

    /** 检查最外层是否仍属于本模块，必要时重新抢占。 */
    const sync = (): void => {
      if (isInstalled()) return

      try {
        const current = prompt.assemble
        if (typeof current !== 'function') return

        rebuild(current as PromptAssemble)
        attach()

        rebuildCount += 1
        // 反复重建说明有其它插件在周期性换回自己的包装：把巡检降频，
        // 否则每轮都会重挂一次，长期运行下装配链与 CPU 一起上涨
        if (rebuildCount > MAX_CONSECUTIVE_REBUILDS && intervalMs !== SLOW_CHECK_INTERVAL_MS) {
          console.error(
            '[power-pack] 提示词包装被反复替换，巡检降频到',
            SLOW_CHECK_INTERVAL_MS,
            'ms',
          )
          intervalMs = SLOW_CHECK_INTERVAL_MS
          startTimer(intervalMs)
        }
      } catch (error) {
        // 服务对象不可配置时放弃兜底，隔离行的事件路径仍然生效
        console.error('[power-pack] 安装提示词外层包装失败:', error)
      }
    }

    /**
     * 启动（或替换）巡检定时器。
     * @param interval 巡检间隔
     */
    const startTimer = (interval: number): void => {
      if (timer !== undefined) clearInterval(timer)

      timer = setInterval(sync, interval)
      if (typeof timer.unref === 'function') timer.unref()
    }

    // 首次安装可能早于全局插件加载，因此周期性复查被抢占的情况
    sync()
    startTimer(intervalMs)

    return () => {
      if (timer !== undefined) clearInterval(timer)
      // 不主动还原 assemble：全局插件可能已把它当作底层实现持有，
      // 拆掉会让后续装配落到空的 sections 上。进程退出时一并释放。
    }
  }, 'power-pack: prompt overlay')
}
