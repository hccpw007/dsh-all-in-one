/**
 * 排队条上的「撤回并编辑」按钮。
 *
 * 宿主的排队条自带三个操作：行内编辑、删除、立即发送；行内编辑在有图片时是
 * 禁用的，保存后也只留下文字。本功能把编辑按钮换成自己的入口：点击不进入行内
 * 编辑，而是撤回这条排队，把文字和图片整体放回输入框。
 *
 * 宿主没有为排队行提供扩展点，只能按 DOM 注入：隐藏它自己的编辑按钮，在同一个
 * 位置插入外观相同的按钮（沿用宿主的样式类与图标）。宿主改动排队条结构时，
 * 最坏情况是按钮不再出现，排队条本身的功能不受影响。
 */
import type { QueueEditOptions } from './types'

/** 排队条容器；宿主在每条会话的输入框上方渲染它。 */
const DOCK_SELECTOR = '[data-queue-dock]'

/** 会话容器：排队条在它内部，点击时从这里读会话标识。 */
const SESSION_SELECTOR = '[data-conversation-session]'

/** 本地下发回显的行；这类行还没有队列身份，宿主同样把它标成不可编辑。 */
const PENDING_ROW_ATTRIBUTE = 'data-submission-echo'

/** 注入按钮的标记属性，扫描时用它判断是否已经插过。 */
const BUTTON_ATTRIBUTE = 'data-aio-queue-edit'

/** 被隐藏的宿主编辑按钮上记录原内联 display 的属性，卸载时按它恢复。 */
const HIDDEN_ATTRIBUTE = 'data-aio-queue-edit-hidden'

/**
 * 宿主排队行的操作按钮数量：编辑 / 撤回 / 立即发送。
 * 行内编辑时宿主只渲染保存与取消两个按钮，那种行不接管。
 */
const HOST_ACTION_COUNT = 3

/**
 * 找到一排操作按钮的容器。
 * @param row 排队行
 * @returns 含按钮的直接子元素；行结构不符合预期时返回 undefined
 */
function findActions(row: HTMLElement): HTMLElement | undefined {
  for (const child of row.children) {
    if (child instanceof HTMLElement && child.querySelector('button') !== null) return child
  }

  return undefined
}

/**
 * 读出排队条里真正对应用户消息的行，跳过还在发送的本地下发回显。
 * @param dock 排队条容器
 * @returns 与队列投影顺序一致的可见行
 */
function visibleRows(dock: HTMLElement): HTMLElement[] {
  return [...dock.querySelectorAll<HTMLElement>('li')]
    .filter(row => !row.hasAttribute(PENDING_ROW_ATTRIBUTE))
}

/**
 * 创建接管用的编辑按钮，外观照抄宿主的编辑按钮。
 * @param hostEdit 宿主的编辑按钮
 * @param label 按钮名称，同时作为无障碍标签与悬停提示
 * @returns 待插入的按钮
 */
function createButton(hostEdit: HTMLButtonElement, label: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = hostEdit.className
  button.setAttribute(BUTTON_ATTRIBUTE, '')
  button.setAttribute('aria-label', label)
  button.title = label

  // 图标沿用宿主的编辑图标：同一条排队条里的操作看起来仍是一组
  for (const child of hostEdit.childNodes) button.appendChild(child.cloneNode(true))

  return button
}

/**
 * 在排队条上安装「撤回并编辑」按钮。
 * @param options 按钮文案与点击行为
 * @returns 卸载函数：移除按钮、恢复宿主按钮并断开观察器
 */
export function installQueueEdit(options: QueueEditOptions): () => void {
  /** 已注入的按钮，卸载时统一移除。 */
  const injected = new Set<HTMLButtonElement>()
  /** 被隐藏的宿主按钮与其原内联 display，卸载或宿主重建时恢复。 */
  const hidden = new Map<HTMLButtonElement, string>()
  let frame = 0
  let scheduled = false
  let disposed = false

  /** 宿主重新渲染会换掉行里的节点，这里清掉已经脱离文档的引用。 */
  const prune = (): void => {
    for (const button of injected) {
      if (!button.isConnected) injected.delete(button)
    }
    for (const [button, display] of hidden) {
      if (button.isConnected) continue

      button.style.display = display
      button.removeAttribute(HIDDEN_ATTRIBUTE)
      hidden.delete(button)
    }
  }

  /**
   * 接管一行：隐藏宿主编辑按钮并在同一位置插入自己的按钮。
   * @param dock 排队条容器
   * @param row 排队行
   */
  const injectRow = (dock: HTMLElement, row: HTMLElement): void => {
    if (row.querySelector(`[${BUTTON_ATTRIBUTE}]`) !== null) return

    const actions = findActions(row)
    if (actions === undefined) return

    const hostButtons = [...actions.querySelectorAll('button')]
      .filter(button => !button.hasAttribute(BUTTON_ATTRIBUTE))
    // 行内编辑态只有保存与取消：宿主已经在编辑这条消息，不接管
    if (hostButtons.length < HOST_ACTION_COUNT) return

    const hostEdit = hostButtons[0]
    if (hostEdit === undefined) return

    const button = createButton(hostEdit, options.label)
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      void recall(button, row, dock)
    })

    // 隐藏宿主编辑按钮：同一位置出现两个编辑图标会让人分不清哪个会撤回排队
    if (!hostEdit.hasAttribute(HIDDEN_ATTRIBUTE)) {
      const display = hostEdit.style.display
      hostEdit.setAttribute(HIDDEN_ATTRIBUTE, display)
      hostEdit.style.display = 'none'
      hidden.set(hostEdit, display)
    }

    actions.insertBefore(button, actions.firstChild)
    injected.add(button)
  }

  /**
   * 执行一次撤回：先算出这条行在可见队列里的位置，再交给业务层。
   * @param button 被点击的按钮
   * @param row 该按钮所在的行
   * @param dock 排队条容器
   */
  const recall = async (button: HTMLButtonElement, row: HTMLElement, dock: HTMLElement): Promise<void> => {
    if (button.disabled) return

    const sessionId = dock.closest(SESSION_SELECTOR)?.getAttribute('data-conversation-session') ?? ''
    if (sessionId === '') {
      console.error('[queue-edit] 无法从排队条定位会话:', dock)
      return
    }

    const index = visibleRows(dock).indexOf(row)
    if (index < 0) return

    // 宿主拒绝撤回时按钮要能再点一次；先禁用避免重复请求
    button.disabled = true
    try {
      await options.run(sessionId, index)
    } catch (error) {
      console.error('[queue-edit] 撤回排队消息时发生未处理的错误:', error)
    } finally {
      // 撤回成功后整行由宿主重新渲染，此时按钮已脱离文档，不必再恢复
      if (button.isConnected) button.disabled = false
    }
  }

  /** 扫描并注入；节点增删很频繁，回调里只做少量查询。 */
  const scan = (): void => {
    frame = 0
    scheduled = false
    if (disposed) return

    prune()

    for (const dock of document.querySelectorAll<HTMLElement>(DOCK_SELECTOR)) {
      for (const row of visibleRows(dock)) injectRow(dock, row)
    }
  }

  const schedule = (): void => {
    if (scheduled || disposed) return
    scheduled = true
    frame = window.requestAnimationFrame(scan)
  }

  /**
   * 判断一次 DOM 变化是否与本功能有关。
   *
   * 只监听节点增删而不看变化位置，会在整页流式输出时反复全量扫描；这里先确认
   * 变化落在排队条内，或新增节点本身就带着排队条。
   * @param record 一条 DOM 变化记录
   * @returns 是否需要重新扫描
   */
  const touchesDock = (record: MutationRecord): boolean => {
    if (record.target instanceof Element && record.target.closest(DOCK_SELECTOR) !== null) return true

    for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue
      if (node.matches(DOCK_SELECTOR) || node.querySelector(DOCK_SELECTOR) !== null) return true
    }

    return false
  }

  const observer = new MutationObserver((records) => {
    if (!records.some(touchesDock)) return
    schedule()
  })
  observer.observe(document.body, { childList: true, subtree: true })
  schedule()

  return () => {
    disposed = true
    observer.disconnect()
    if (frame !== 0) window.cancelAnimationFrame(frame)

    for (const button of injected) button.remove()
    injected.clear()

    for (const [button, display] of hidden) {
      button.style.display = display
      button.removeAttribute(HIDDEN_ATTRIBUTE)
    }
    hidden.clear()
  }
}
