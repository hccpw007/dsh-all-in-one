/**
 * 同一文件连续引用的判定与宿主渲染登记。
 *
 * 同一张图常连续出现在两次工具调用里（先截图保存、再读取查看）。宿主的「读取图片」
 * 已经画出原图，插件再插一张就是重复；但中间隔着正文输出时，两处都是用户要看的内容。
 * 本模块只负责判断两次引用是否连续，以及记录宿主已经渲染过哪些文件。
 */

/** 会话项的类型标记：正文输出与工具调用在会话流里各占一个元素。 */
const FLOW_ITEM_SELECTOR = '[data-chat-flow-kind]'

/** 会话项类型的属性名，代表工具调用的取值见 FLOW_KIND_TOOL_CALL。 */
const FLOW_KIND_ATTRIBUTE = 'data-chat-flow-kind'

/** 会话项所属轮次的属性名；跨轮次的同一文件各自展示。 */
const FLOW_TURN_ATTRIBUTE = 'data-chat-turn'

/** 会话项类型中代表工具调用的取值。 */
const FLOW_KIND_TOOL_CALL = 'tool-call'

/** 宿主已经渲染出图片的路径 → 渲染位置。 */
const hostRenderedPaths = new Map<string, Element>()

/**
 * 登记一张宿主已经渲染过的图片。
 * @param key 归一化后的路径
 * @param anchor 宿主渲染该图片的位置
 */
export function registerHostRenderedImage(key: string, anchor: Element): void {
  hostRenderedPaths.set(key, anchor)
}

/**
 * 查询宿主渲染某张图片的位置。
 *
 * 渲染位置随虚拟滚动卸载后登记随之失效，下次查询时自动清掉。
 * @param key 归一化后的路径
 * @returns 渲染位置；宿主尚未渲染或已卸载时返回 undefined
 */
export function hostRenderedAnchor(key: string): Element | undefined {
  const anchor = hostRenderedPaths.get(key)
  if (anchor === undefined) return undefined

  if (anchor.isConnected) return anchor

  hostRenderedPaths.delete(key)

  return undefined
}

/**
 * 判断两次引用是否属于同一段连续的工具调用。
 * @param a 其中一次引用的位置
 * @param b 另一次引用的位置
 * @returns 同一轮且两者之间没有正文输出时返回 true
 */
export function isContinuous(a: Element, b: Element): boolean {
  const flowA = a.closest(FLOW_ITEM_SELECTOR)
  const flowB = b.closest(FLOW_ITEM_SELECTOR)

  // 宿主结构变化或虚拟滚动只挂出部分节点时无从判断，按不连续处理：宁可多显示一张也不漏
  if (flowA === null || flowB === null) return false
  if (flowA === flowB) return true
  if (flowA.parentElement === null || flowA.parentElement !== flowB.parentElement) return false

  // 跨轮次的同一文件是两次独立引用，各自展示
  if (flowA.getAttribute(FLOW_TURN_ATTRIBUTE) !== flowB.getAttribute(FLOW_TURN_ATTRIBUTE)) {
    return false
  }

  const siblings = Array.from(flowA.parentElement.children)
  const indexA = siblings.indexOf(flowA)
  const indexB = siblings.indexOf(flowB)
  if (indexA < 0 || indexB < 0) return false

  const start = Math.min(indexA, indexB)
  const end = Math.max(indexA, indexB)

  // 中间夹着正文输出（或思考）时不算连续：用户已看过中间的过渡内容，两处都要保留
  for (let index = start; index <= end; index += 1) {
    if (siblings[index].getAttribute(FLOW_KIND_ATTRIBUTE) !== FLOW_KIND_TOOL_CALL) return false
  }

  return true
}
