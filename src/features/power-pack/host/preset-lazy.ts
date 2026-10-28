/**
 * 组合预设的按需注册。
 *
 * 宿主 `agentPresets.register()` 是 eager 的：注册瞬间就挂载一整棵预设行树并审计
 * 每一行。若在启动时按 `compose-state` 逐条重建，历史组合越多启动越慢、CPU 尖峰
 * 越明显（实测每条组合约多花 1 秒，三条把启动从 5.3 秒拖到 10 秒以上）。
 *
 * 因此这里不预先注册，改为包装宿主解析预设 id 的入口：会话创建、恢复、冷会话读
 * 技能都会先经过它们，命中组合 id 时才现场重建那一条。启动期只多一层函数包装，
 * 未被访问的历史会话不产生任何挂载开销。
 */
import type { AgentPresetApi, ToolsApi } from '../../../types/host'
import type { GlobalToolGroup } from '../types'

import { listGlobalToolGroups } from './global-catalog'
import { ensureComposedPreset, isComposedPresetId, splitComposedPresetId, waitPresetRows } from './presets'
import { readPacks } from './store'

/** 需要包住的宿主方法：它们都在真正使用预设前解析预设 id。 */
const GUARDED_METHODS = ['resolve', 'acquireScope', 'select', 'mount'] as const

/** 一个受保护的方法名。 */
type GuardedMethod = (typeof GUARDED_METHODS)[number]

/** 每个方法里预设 id 所处的参数下标。 */
const PRESET_ARG_INDEX: Record<GuardedMethod, number> = {
  resolve: 0,
  acquireScope: 0,
  select: 1,
  mount: 1,
}

/** 包装层挂在服务方法上的标记，用来判断是否已经包过。 */
const WRAPPED = Symbol.for('dsh-all-in-one.preset-lazy')

/** 待重建的组合，键为组合预设 id；同时用于合并并发请求。 */
const rebuilding = new Map<string, Promise<string>>()

/** 宿主方法在包装层的形态：保持 `this`，参数与返回值原样透传。 */
type HostMethod = (this: unknown, ...args: unknown[]) => Promise<unknown>

/** 带包装标记的函数。 */
interface MarkedMethod extends HostMethod {
  [WRAPPED]?: true
}

/** 安装所需的宿主上下文。 */
export interface LazyPresetDeps {
  /** 宿主 Agent 预设服务。 */
  api: AgentPresetApi
  /** 宿主工具注册表，用于生成隔离行；可能晚于本包装就绪。 */
  tools(): ToolsApi | undefined
  /** 当前 profile 目录；缺省时扫描全部 profile。 */
  profileDir?: string
}

/**
 * 重建一条组合预设，并发请求合并到同一次挂载。
 * @param deps 宿主依赖
 * @param presetId 组合预设 id
 * @returns 注册后的预设 id
 */
async function rebuildOnce(deps: LazyPresetDeps, presetId: string): Promise<string> {
  const running = rebuilding.get(presetId)
  if (running !== undefined) return running

  const task = (async (): Promise<string> => {
    const { packId, modeId } = splitComposedPresetId(presetId)
    if (packId === '' || modeId === '') throw new Error(`组合预设 ${presetId} 缺少技能包或模式信息`)

    const { packs } = await readPacks()
    const pack = packs.find((item) => item.id === packId)
    if (pack === undefined) throw new Error(`技能包 ${packId} 已不存在，无法重建组合预设 ${presetId}`)

    if (!await waitPresetRows(deps.api, modeId)) {
      throw new Error(`模式 ${modeId} 不可用，无法重建组合预设 ${presetId}`)
    }

    let groups: GlobalToolGroup[] = []
    try {
      groups = await listGlobalToolGroups(deps.tools(), deps.profileDir)
    } catch (error) {
      // 能力组只影响隔离行：扫描失败时退回「不隔离」，不能让会话恢复整体失败
      console.error('[power-pack] 重建组合预设时枚举全局能力失败:', presetId, error)
    }

    return ensureComposedPreset(deps.api, modeId, pack, groups)
  })()

  rebuilding.set(presetId, task)
  // 无论成败都释放占位，失败后下次访问可重试
  const release = (): void => {
    if (rebuilding.get(presetId) === task) rebuilding.delete(presetId)
  }
  task.then(release, release)

  return task
}

/**
 * 包装一个宿主方法：参数里的组合预设 id 未注册时先重建。
 * @param method 方法名，决定预设 id 的参数下标
 * @param original 宿主原方法
 * @param deps 宿主依赖
 * @returns 包装后的方法
 */
function guardMethod(method: GuardedMethod, original: HostMethod, deps: LazyPresetDeps): MarkedMethod {
  const wrapped: MarkedMethod = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
    const wanted = args[PRESET_ARG_INDEX[method]]

    if (typeof wanted === 'string' && isComposedPresetId(wanted)) {
      try {
        await rebuildOnce(deps, wanted)
      } catch (error) {
        // 重建失败仍交给宿主原方法，由它报出「预设不存在」这类可诊断错误
        console.error('[power-pack] 按需重建组合预设失败:', wanted, error)
      }
    }

    return original.apply(this, args)
  }

  wrapped[WRAPPED] = true
  return wrapped
}

/**
 * 安装按需注册包装。
 *
 * 宿主每次读服务方法都返回新的 traceable 代理，因此包装直接写在服务对象上，
 * 已安装判定读取属性描述符而不是比较函数引用。
 * @param deps 宿主依赖
 */
export function installLazyPresets(deps: LazyPresetDeps): void {
  for (const method of GUARDED_METHODS) {
    const current = deps.api[method]
    if (typeof current !== 'function') {
      // 宿主版本变化导致方法缺失时跳过该入口，其余入口仍可触发重建
      console.warn('[power-pack] 宿主预设服务缺少方法，跳过按需注册:', method)
      continue
    }

    const existing = Object.getOwnPropertyDescriptor(deps.api, method)
    if ((existing?.value as MarkedMethod | undefined)?.[WRAPPED] === true) continue

    try {
      Object.defineProperty(deps.api, method, {
        configurable: true,
        enumerable: existing?.enumerable ?? true,
        writable: true,
        value: guardMethod(method, current as HostMethod, deps),
      })
    } catch (error) {
      // 服务对象不可配置时放弃按需注册，历史组合需用户重新选择后才会出现
      console.error('[power-pack] 安装组合预设按需注册失败:', method, error)
    }
  }
}
