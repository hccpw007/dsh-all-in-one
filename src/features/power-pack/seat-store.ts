/**
 * 新会话界面的预设选择状态。
 *
 * 「模式」与「技能包」是两个独立维度：模式决定基础工具与提示词，技能包在其
 * 之上筛选技能与工具并追加 MCP 与系统提示词。宿主一次只认一个预设，因此技能包
 * 非空时由宿主侧合成组合预设；这里负责维护两个维度的选中值、把组合提交到
 * 当前空白会话，并在新会话屏幕还没有会话时先暂存。
 */
import type { AgentPresetSummary, PluginContext } from '../../types/plugin'
import { composePowerPack, loadPowerPacks } from './api'

/** 组合预设 id 的前缀，与宿主内置模式区分。 */
const PRESET_ID_PREFIX = 'power-pack-'

/** 技能包下拉的一项，来自插件自己的技能包配置而非宿主预设。 */
export interface SeatPackOption {
  id: string
  name: string
  description: string
}

/** 选择器快照。 */
export interface SeatSnapshot {
  status: 'idle' | 'loading' | 'ready' | 'error'
  /** 可选模式，已剔除插件合成的组合预设与损坏的预设。 */
  modes: AgentPresetSummary[]
  /** 可选技能包。 */
  packs: SeatPackOption[]
  /** 当前模式预设 id。 */
  mode: string
  /** 当前技能包 id；空字符串表示不叠加技能包。 */
  pack: string
  /** 提交失败的原因。 */
  error: string | null
}

/** 极简可订阅 store，组件通过插槽包装后的 hook 读取。 */
export interface SeatStore {
  getSnapshot(): SeatSnapshot
  set(patch: Partial<SeatSnapshot>): void
  subscribe(listener: () => void): () => void
}

/** 创建初始快照。 */
function initialState(): SeatSnapshot {
  return { status: 'idle', modes: [], packs: [], mode: '', pack: '', error: null }
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

/**
 * 拆分组合预设 id，得到两个维度的当前值。
 *
 * 组合 id 形如 `pack-<技能包 id>@<模式 id>`；没有 `@` 的 `pack-*` 是旧版本
 * 单独注册的技能包预设，按只有技能包、模式取默认处理。
 * @param presetId 会话记录的预设 id
 * @returns 模式与技能包 id
 */
function parsePresetId(presetId: string): { mode: string; pack: string } {
  if (!presetId.startsWith(PRESET_ID_PREFIX)) return { mode: presetId, pack: '' }

  const body = presetId.slice(PRESET_ID_PREFIX.length)
  const separator = body.indexOf('@')
  if (separator < 0) return { mode: '', pack: body }

  return { mode: body.slice(separator + 1), pack: body.slice(0, separator) }
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

/** 新会话界面的选择控制器。 */
export interface SeatController {
  store: SeatStore
  /** 读取模式与技能包名单；每次会话变化时调用。 */
  load(sessionId?: string): Promise<void>
  /** 切换模式，技能包保持不变。 */
  selectMode(sessionId: string | undefined, modeId: string): Promise<void>
  /** 切换技能包；再次选择同一技能包表示取消叠加。 */
  selectPack(sessionId: string | undefined, packId: string): Promise<void>
  /** 会话出现后提交暂存的选择。 */
  applyStaged(sessionId: string): Promise<void>
}

/**
 * 创建选择控制器。
 * @param ctx 客户端插件上下文
 * @returns 控制器
 */
export function createSeatController(ctx: PluginContext): SeatController {
  const store = createSeatStore()
  /** 尚未提交的选择；新会话屏幕没有会话时先存这里。 */
  let staged: { mode: string; pack: string } | undefined
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

      // 技能包名单来自插件自己的路由；它失败只影响技能包下拉，模式仍可用
      let packs: SeatPackOption[] = []
      try {
        const payload = await loadPowerPacks()
        packs = payload.packs.map(({ id, name, description }) => ({ id, name, description }))
      } catch (error) {
        console.error('[power-pack] 读取技能包列表失败:', error)
      }

      // 组合预设由插件按需注册，不作为模式出现在下拉里
      const modes = result.value.presets.filter(
        (preset) => preset.broken === undefined && !preset.id.startsWith(PRESET_ID_PREFIX),
      )
      const fallbackMode = modes.find((preset) => preset.isDefault)?.id ?? modes[0]?.id ?? ''
      const fromSession = parsePresetId(sessionPreset(ctx, sessionId) ?? '')

      store.set({
        status: 'ready',
        modes,
        packs,
        // 模式为空说明会话用的是旧版独立技能包预设，回退到宿主默认模式
        mode: staged?.mode || fromSession.mode || fallbackMode,
        pack: staged?.pack ?? fromSession.pack,
        error: null,
      })
    } catch (error) {
      console.error('[power-pack] 读取模式与技能包失败:', error)
      store.set({
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * 把两个维度的选择提交到指定会话；无会话时只暂存。
   * @param sessionId 会话 id
   * @param mode 模式预设 id
   * @param pack 技能包 id，空字符串表示不叠加
   */
  const commit = async (
    sessionId: string | undefined,
    mode: string,
    pack: string,
  ): Promise<void> => {
    if (sessionId === undefined) {
      staged = { mode, pack }
      return
    }

    const api = ctx.remote?.agentPresets
    if (!api) {
      store.set({ error: 'agentPresets remote unavailable' })
      staged = undefined
      return
    }

    const summary = ctx.sessions?.list.getSnapshot().byId[sessionId]
    if (summary && summary.blank === false) {
      // 已有内容的会话不允许换预设，宿主也会拒绝，这里提前给出提示
      store.set({ error: 'session already started' })
      staged = undefined
      return
    }

    try {
      const presetId = pack === '' ? mode : (await composePowerPack(pack, mode)).presetId
      const result = await api.select(sessionId, presetId)
      if (!result.ok) {
        store.set({ error: result.error?.message ?? 'select failed' })
        staged = undefined
        return
      }

      staged = undefined
      store.set({ error: null })
    } catch (error) {
      console.error('[power-pack] 应用模式与技能包失败:', error)
      store.set({ error: error instanceof Error ? error.message : String(error) })
      staged = undefined
    }
  }

  const selectMode = async (sessionId: string | undefined, modeId: string): Promise<void> => {
    if (busy) return

    store.set({ mode: modeId, error: null })
    if (sessionId === undefined) {
      await commit(undefined, modeId, store.getSnapshot().pack)
      return
    }

    busy = true
    try {
      await commit(sessionId, modeId, store.getSnapshot().pack)
    } finally {
      busy = false
    }
  }

  const selectPack = async (sessionId: string | undefined, packId: string): Promise<void> => {
    if (busy) return

    // 再次选择同一技能包视为取消叠加，回到纯模式运行
    const next = packId === store.getSnapshot().pack ? '' : packId
    store.set({ pack: next, error: null })
    if (sessionId === undefined) {
      await commit(undefined, store.getSnapshot().mode, next)
      return
    }

    busy = true
    try {
      await commit(sessionId, store.getSnapshot().mode, next)
    } finally {
      busy = false
    }
  }

  const applyStaged = async (sessionId: string): Promise<void> => {
    if (staged === undefined || busy) return

    busy = true
    try {
      await commit(sessionId, staged.mode, staged.pack)
    } finally {
      busy = false
    }
  }

  return { store, load, selectMode, selectPack, applyStaged }
}
