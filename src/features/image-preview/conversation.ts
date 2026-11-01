/**
 * 会话正文容器的定位。
 *
 * 预览扫描与图片点击接管都以会话正文为范围：两处必须用同一套选择器，
 * 否则会出现「预览插进了会话区，点击却没人接管」这类错位。
 */

/** 会话正文容器的候选选择器，从最精确到最宽泛；宿主改版时逐级回退。 */
const CONTAINER_SELECTORS = [
  '[data-conversation-region="chat"]',
  '[data-conversation-scroll]',
  '[data-slot="main.conversation"]',
]

/** 组合后的选择器，供 `closest` 判断某个节点是否位于会话正文内。 */
export const CONVERSATION_SELECTOR = CONTAINER_SELECTORS.join(', ')

/**
 * 对话视图正文的容器标记。
 *
 * 会话区的容器同时容纳轨迹等其它视图（切到轨迹时对话视图会被卸载），
 * 而它们的记录里同样带着图片路径文本；预览只属于对话正文，扫描必须以它为界，
 * 否则预览会被插进轨迹视图并挤占、遮挡轨迹内容。
 */
export const CHAT_FLOW_SELECTOR = '[data-chat-flow]'

/**
 * 判断一个元素是否位于对话视图正文内。
 * @param element 待判断元素
 * @returns 位于对话正文内返回 true
 */
export function isChatFlowRegion(element: Element | null): boolean {
  return element?.closest(CHAT_FLOW_SELECTOR) != null
}

/**
 * 按优先级定位会话正文容器。
 * @returns 容器；页面尚未渲染出会话区时返回 undefined
 */
export function findConversationContainer(): HTMLElement | undefined {
  for (const selector of CONTAINER_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector)
    if (element !== null) return element
  }

  return undefined
}
