/**
 * 新会话界面的「对话风格」选择状态。
 *
 * 风格本身是宿主 Agent 预设，这里只负责：读取预设名单、区分风格与模式、
 * 把选择应用到当前空白会话；新会话屏幕还没有会话时先暂存，等会话出现
 * 后再提交，避免选择丢失。
 */
import type { AgentPresetSummary, PluginContext } from '../../types/plugin'

/** 选择器快照。 */
export interface SeatSnapshot {
  status: 'idle' | 'loading' | 'ready' | 'error'
  /** 可选项，风格排在前面。 */
  options: AgentPresetSummary[]
  /** 当前显示的选择：暂存值、会话预设或默认预设。 */
  current: string
  /** 提交失败的原因。 */
  error: string | null
}

/** 极简可订阅 store，组件通过 useSyncExternalStore 读取。 */
export interface SeatStore {
  getSnapshot(): SeatSnapshot
  set(patch: Partial<SeatSnapshot>): void
  subscribe(listener: () => void): () => void
}

/** 创建初始快照。 */
function initialState(): SeatSnapshot {
  return { status: 'idle', options: [], current: '', error: null }
}

/**
 * 创建可订阅 store。
 * @returns store 读写接口
 */
function createSeatStore(): SeatStore {
  let snapshot = initialState()
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => snapshot,
    set(patch) {
      snapshot = { ...snapshot, ...patch }
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/** 新会话界面的选择控制器。 */
export interface SeatController {
  store: SeatStore
  /** 读取可选预设；每次会话变化时调用。 */
  load(sessionId?: string): Promise<void>
  /** 选择一个预设并应用到当前空白会话。 */
  select(sessionId: string | undefined, presetId: string): Promise<void>
  /** 会话出现后提交暂存的选择。 */
  applyStaged(sessionId: string): Promise<void>
}

/**
 * 判断一个预设是否为「对话风格」；风格统一带 `style-` 前缀。
 * @param preset 预设摘要
 * @returns 风格返回 true
 */
export function isStylePreset(preset: AgentPresetSummary): boolean {
  return preset.id.startsWith('style-')
}

/**
 * 读取会话当前记录的预设。
 * @param ctx 客户端插件上下文
 * @param sessionId 会话 id
 * @returns 预设 id，未知时返回 undefined
 */
function sessionPreset(ctx: PluginContext, sessionId: string | undefined): string | undefined {
  if (sessionId === undefined) return undefined

  const value = ctx.sessions?.list.getSnapshot().byId[sessionId]?.projectionValues?.agentPreset
  return typeof value === 'string' ? value : undefined
}

/**
 * 创建选择控制器。
 * @param ctx 客户端插件上下文
 * @returns 控制器
 */
export function createSeatController(ctx: PluginContext): SeatController {
  const store = createSeatStore()
  /** 尚未提交的选择；新会话屏幕没有会话时先存这里。 */
  let staged: string | undefined
  /** 当前提交进行中，避免重复请求。 */
  let busy = false

  const load = async (sessionId?: string): Promise<void> => {
    const api = ctx.remote?.agentPresets
    if (!api) {
      store.set({ status: 'error', error: 'agentPresets remote unavailable' })
      return
    }

    if (store.getSnapshot().status === 'loading') return
    store.set({ status: 'loading', error: null })

    try {
      const result = await api.list()
      if (!result.ok || !result.value) {
        store.set({ status: 'error', error: result.error?.message ?? 'list failed' })
        return
      }

      const presets = result.value.presets.filter((preset) => preset.broken === undefined)
      const fallback = presets.find((preset) => preset.isDefault)?.id ?? presets[0]?.id ?? ''
      const current = staged ?? sessionPreset(ctx, sessionId) ?? fallback

      store.set({ status: 'ready', options: presets, current, error: null })
    } catch (error) {
      console.error('[chat-style] 读取 Agent 预设失败:', error)
      store.set({
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const submit = async (sessionId: string, presetId: string): Promise<void> => {
    const api = ctx.remote?.agentPresets
    if (!api) {
      store.set({ error: 'agentPresets remote unavailable' })
      staged = undefined
      return
    }

    const summary = ctx.sessions?.list.getSnapshot().byId[sessionId]
    if (summary && summary.blank === false) {
      // 已有内容的会话不允许换预设，宿主也会拒绝，这里提前给出提示
      store.set({ error: 'session already started', current: sessionPreset(ctx, sessionId) ?? '' })
      staged = undefined
      return
    }

    try {
      const result = await api.select(sessionId, presetId)
      if (!result.ok) {
        store.set({ error: result.error?.message ?? 'select failed' })
        staged = undefined
        return
      }

      staged = undefined
      store.set({ current: result.value ?? presetId, error: null })
    } catch (error) {
      console.error('[chat-style] 应用对话风格失败:', error)
      store.set({ error: error instanceof Error ? error.message : String(error) })
      staged = undefined
    }
  }

  const select = async (sessionId: string | undefined, presetId: string): Promise<void> => {
    if (busy) return

    staged = presetId
    store.set({ current: presetId, error: null })

    // 新会话屏幕还没有会话：保留暂存，等会话出现后由 applyStaged 提交
    if (sessionId === undefined) return

    busy = true
    try {
      await submit(sessionId, presetId)
    } finally {
      busy = false
    }
  }

  const applyStaged = async (sessionId: string): Promise<void> => {
    if (staged === undefined || busy) return

    busy = true
    try {
      await submit(sessionId, staged)
    } finally {
      busy = false
    }
  }

  return { store, load, select, applyStaged }
}
