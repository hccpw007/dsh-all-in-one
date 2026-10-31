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
