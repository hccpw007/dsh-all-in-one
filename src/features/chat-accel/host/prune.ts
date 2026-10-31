/**
 * 「对话加速」的旧工具结果裁剪阈值。
 *
 * 宿主自带 `ToolResultPruner` 服务（`dsh-compaction-tool-result-pruner`），
 * 在装配上下文时把头尾之外的中段替换成一个标记。它的 `thresholdChars` 只在
 * 服务构造时解析一次，之后固定在 `config` 上，因此这里在运行期直接改写实例上的预算。
 *
 * 该服务随 agent preset 挂载并被 isolate：插件根作用域读不到，只能在
 * `agent/pre-step` 时按 agent 的作用域解析。同一实例只写一次，之后按设置指纹判断是否要重写。
 *
 * 校验要求 `headChars + 标记 + tailChars <= thresholdChars`，所以阈值变小时
 * 必须按比例缩小头尾，否则裁剪时会抛错。
 */
import type { AgentLike, HostPluginContext } from '../../../types/host'
import { readChatAccelSettings } from './settings'

/** 宿主默认预算：关闭本条目时恢复成这一组。 */
const DEFAULT_THRESHOLDS = {
  thresholdChars: 8192,
  headChars: 4096,
  tailChars: 1024,
}

/** 裁剪标记的字符数，用于校验头尾预算不超过阈值。 */
const MARKER_LENGTH = 39

/** 裁剪服务实例的最小形状；`config` 整体替换，属性本身是只读的。 */
interface PrunerLike {
  config?: {
    thresholdChars?: number
    headChars?: number
    tailChars?: number
  }
}

/** Cordis fiber 的最小结构：只需要它自己的作用域。 */
interface FiberLike {
  ctx?: HostPluginContext
}

/** Cordis 注册表的最小结构：每个插件 runtime 持有它的 fiber 列表。 */
interface RegistryLike {
  forEach?(callback: (runtime: { fibers?: Iterable<FiberLike> }) => void): void
}

/** 已经应用过预算的实例，值为当时的设置指纹，避免每一步都重复写。 */
const applied = new WeakMap<object, string>()

/**
 * 计算头尾预算：头部保留一半、尾部保留八分之一，剩余空间留给标记。
 * @param threshold 裁剪阈值
 * @returns 头尾预算
 */
function budgetsFor(threshold: number): { headChars: number; tailChars: number } {
  const headChars = Math.floor(threshold / 2)
  const tailChars = Math.floor(threshold / 8)

  // 极小阈值下也要保证 头 + 标记 + 尾 不超预算，否则裁剪会拒绝执行
  if (headChars + tailChars + MARKER_LENGTH <= threshold) return { headChars, tailChars }

  return { headChars: 0, tailChars: 0 }
}

/**
 * 按 agent 的作用域查找裁剪服务：先看 agent 自己的作用域，再沿注册表找提供者。
 * @param agent 当前步的 Agent
 * @returns 裁剪服务；不可见时返回 undefined
 */
function resolvePruner(agent: AgentLike): PrunerLike | undefined {
  const own = agent.ctx?.get?.('toolResultPruner') as PrunerLike | undefined
  if (own !== undefined) return own

  const root = agent.ctx as unknown as { registry?: RegistryLike } | undefined
  let found: PrunerLike | undefined

  root?.registry?.forEach?.((runtime) => {
    if (found !== undefined) return

    for (const fiber of runtime.fibers ?? []) {
      const candidate = fiber.ctx?.get?.('toolResultPruner') as PrunerLike | undefined
      if (candidate === undefined) continue

      found = candidate
      return
    }
  })

  return found
}

/**
 * 把预算写到实例上。
 *
 * 宿主构造服务时对 `config` 做了 `Object.freeze`，逐个属性赋值会抛
 * `Cannot assign to read only property`；服务实例本身没有冻结，
 * 因此整体替换 `config` 对象。
 * @param pruner 裁剪服务实例
 * @param enabled 条目是否启用
 * @param threshold 设置里的阈值
 */
function writeBudgets(pruner: PrunerLike, enabled: boolean, threshold: number): void {
  const thresholdChars = enabled ? threshold : DEFAULT_THRESHOLDS.thresholdChars
  const budgets = enabled
    ? budgetsFor(thresholdChars)
    : { headChars: DEFAULT_THRESHOLDS.headChars, tailChars: DEFAULT_THRESHOLDS.tailChars }
  const next = {
    thresholdChars,
    headChars: budgets.headChars,
    tailChars: budgets.tailChars,
  }

  pruner.config = next
}

/**
 * 在每一步派发模型请求前，按当前设置校正裁剪预算。
 *
 * 服务不可见（宿主没装裁剪插件）时静默返回：其余加速项不受影响。
 * @param agent 当前步的 Agent
 */
export function applyPruneForAgent(agent: AgentLike): void {
  try {
    const settings = readChatAccelSettings()
    const enabled = settings.enabledIds.includes('toolResultPrune')
    const signature = `${enabled}|${settings.pruneThreshold}`
    const pruner = resolvePruner(agent)

    if (pruner?.config === undefined) return

    if (applied.get(pruner) === signature) return

    writeBudgets(pruner, enabled, settings.pruneThreshold)
    applied.set(pruner, signature)
  } catch (error) {
    // 预算改写失败不应影响本轮请求：留日志，按宿主原预算继续
    console.error('[chat-accel] 应用裁剪阈值失败:', error)
  }
}
