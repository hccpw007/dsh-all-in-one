/**
 * 从宿主的 Agent 上读取会话标识，并判定自动模式是否对本 Agent 生效。
 *
 * `agent` 在诊断性装配、工具闸门等场景里可能缺省，且跨插件版本形状可能变化，
 * 因此逐层收窄而不是断言。取不到会话时按「未开启」处理，并输出一次警告：
 * 静默失效会让界面显示「已开启」而提示词与闸门都没生效，这种问题没有日志就查不出来。
 *
 * 子 Agent 拥有独立会话标识，若只认自身标识，委派出去的 Agent 会被判为「未开自动」，
 * 于是能弹出提问把整条委派链卡死——所以判定要沿着 `parentSession` 上溯。
 *
 * 上溯只认 `origin === 'subagent'`：普通 fork 的历史记录里也可能保留 `parentSession`，
 * 那代表副本来源而不是委派，不该跟着继承开关。
 */
import { isAutoRunEnabled, resolveAutoRunState } from './settings'

/**
 * 读取 Agent 所属会话标识。
 * @param agent 宿主 Agent（形状未知）
 * @returns 会话标识；取不到时返回 undefined
 */
function readAgentSessionId(agent: unknown): string | undefined {
  if (typeof agent !== 'object' || agent === null) return undefined

  const session = (agent as { session?: unknown }).session
  if (typeof session !== 'object' || session === null) return undefined

  const id = (session as { id?: unknown }).id

  return typeof id === 'string' && id !== '' ? id : undefined
}

/**
 * 读取 Agent 会话的父会话标识。
 *
 * 只对委派出来的子会话返回结果：头部 `origin` 不是 `subagent` 时一律忽略，
 * 否则 fork 出来的会话会因为历史字段而意外继承自动模式。
 * @param agent 宿主 Agent（形状未知）
 * @returns 父会话标识；不是子会话或读不到时返回 undefined
 */
function readParentSessionId(agent: unknown): string | undefined {
  if (typeof agent !== 'object' || agent === null) return undefined

  const session = (agent as { session?: unknown }).session
  if (typeof session !== 'object' || session === null) return undefined

  const header = (session as { header?: unknown }).header
  if (typeof header !== 'object' || header === null) return undefined

  // 委派关系才继承；普通 fork 与历史副本都不带 origin，直接排除
  if ((header as { origin?: unknown }).origin !== 'subagent') return undefined

  // 会话对象上的同名字段优先，其次头部字段
  const direct = (session as { parentSession?: unknown }).parentSession
  if (typeof direct === 'string' && direct !== '') return direct

  const fromHeader = (header as { parentSession?: unknown }).parentSession

  return typeof fromHeader === 'string' && fromHeader !== '' ? fromHeader : undefined
}

/**
 * 已确认「继承生效」的会话与它的直接父会话。
 *
 * 单次判定只能看到自己这一层与父会话：深层委派（父 → 子 → 孙）里孙 Agent 的父会话
 * 是子 Agent 的会话，它不在设置里留记录，光靠上溯仍会漏。把「子 → 父」记下来，
 * 下一层就还能继续上溯。同时记下父是谁而不是只记布尔：父会话被关掉或记录被清理后，
 * 判定能顺着链发现失效并删除残留，不会留下一个永远开着的子会话。
 */
const inheritedParents = new Map<string, string>()

/** 继承缓存的容量上限，与设置里的会话上限一致。 */
const MAX_INHERITED = 200

/** 是否已经提示过「读不到会话标识」；只提示一次，避免每轮装配刷屏。 */
let warnedMissingSession = false

/**
 * 输出一次「读不到会话标识」的警告。
 */
function warnMissingSession(): void {
  if (warnedMissingSession) return

  warnedMissingSession = true
  console.warn(
    '[auto-run] 读不到 Agent 的会话标识，本轮按未开启自动模式处理；'
    + '若开关显示已开启，请检查宿主版本的 Agent 形状是否变化',
  )
}

/**
 * 清空继承缓存。
 *
 * 用户改过开关后必须调用：否则父会话关掉自动模式，已缓存的子会话仍会被判为生效。
 */
export function resetAutoRunInheritance(): void {
  inheritedParents.clear()
}

/**
 * 记录一条「子会话继承自父会话」，超出容量时淘汰最早一条。
 * @param child 子会话标识
 * @param parent 直接父会话标识
 */
function rememberInherited(child: string, parent: string): void {
  if (inheritedParents.size >= MAX_INHERITED && !inheritedParents.has(child)) {
    const oldest = inheritedParents.keys().next().value
    if (oldest !== undefined) inheritedParents.delete(oldest)
  }

  // 先删后插：重复判定的会话回到末尾，淘汰的是真正最旧的条目
  inheritedParents.delete(child)
  inheritedParents.set(child, parent)
}

/**
 * 判断某个父会话当前是否仍处于自动模式，包含它自己也是继承来的情况。
 * @param parent 待检查的父会话标识
 * @param visited 本次链上已检查过的会话，用于阻断缓存里的自引用环
 * @returns 父会话当前是否生效
 */
function inheritedParentIsActive(parent: string, visited: Set<string>): boolean {
  // 环：缓存里出现了自引用或互引用，按失效处理
  if (visited.has(parent)) return false
  visited.add(parent)

  if (isAutoRunEnabled(parent)) return true

  const grand = inheritedParents.get(parent)
  if (grand === undefined) return false

  if (inheritedParentIsActive(grand, visited)) return true

  // 整条链已失效（父被关掉、或设置里的记录被清理）：删掉残留，下次不再误判
  inheritedParents.delete(parent)

  return false
}

/**
 * 判断自动模式是否对本 Agent 生效（自身或委派链上的祖先会话开启即生效）。
 * @param agent 宿主 Agent（形状未知）
 * @returns 是否处于自动模式
 */
export function isAutoRunActiveFor(agent: unknown): boolean {
  const own = readAgentSessionId(agent)
  if (own === undefined) {
    // 诊断性装配本来就不带 Agent；只有拿到 Agent 却读不出会话，才说明宿主形状变了
    if (typeof agent === 'object' && agent !== null) warnMissingSession()

    return false
  }

  const ownState = resolveAutoRunState(own)
  // 显式记录优先：用户在子会话界面手动关掉时，继承不得把开关顶回去
  if (ownState.explicit) return ownState.enabled

  // 默认值求值为开启（默认开 / 上一次）时直接生效，不必看父会话
  if (ownState.enabled) return true

  const parent = readParentSessionId(agent)
  if (parent === undefined) return false

  // 自身放进 visited：父会话指回自己时同样按失效处理
  if (!inheritedParentIsActive(parent, new Set([own]))) return false

  rememberInherited(own, parent)

  return true
}
