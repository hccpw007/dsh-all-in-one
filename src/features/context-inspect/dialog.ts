/**
 * 「上下文详情」窗口。
 *
 * 用原生 DOM 而不是 React：窗口挂在 `document.body` 上，不进入宿主的渲染树，
 * 关闭或插件卸载时可以直接移除，不会与宿主的组件生命周期互相干扰（与图片
 * 放大层同一套做法）。
 *
 * 窗口打开后每 2 秒重新读一次：宿主侧按日志 revision 判断是否变化，未变化时
 * 直接复用上次结果，因此轮询几乎不产生磁盘与 CPU 开销；内容真的变了才重建正文，
 * 并保留原来的滚动位置。
 */
import type { ContextInspectPayload, InspectMessage, InspectSection } from './types'

/** 窗口需要的界面文案，由客户端扩展按当前语言传入。 */
export interface ContextDialogLabels {
  /** 对话框标题 */
  dialogTitle: string
  /** 标题下的数据来源说明 */
  dialogHint: string
  /** 「系统提示词」页签文案 */
  tabSystem: string
  /** 「工具定义」页签文案 */
  tabTools: string
  /** 「对话消息」页签文案 */
  tabMessages: string
  /** 读取中的占位提示 */
  loading: string
  /** 读取失败的提示前缀 */
  loadFailed: string
  /** 失败后重新读取的按钮 */
  retry: string
  /** 手动刷新按钮 */
  refresh: string
  /** 复制当前页签内容的按钮 */
  copy: string
  /** 复制成功后的按钮反馈 */
  copied: string
  /** 关闭窗口按钮 */
  close: string
  /** 会话还没有系统提示词时的说明 */
  emptySystem: string
  /** 会话还没有工具定义时的说明 */
  emptyTools: string
  /** 会话还没有对话消息时的说明 */
  emptyMessages: string
  /** 定位不到当前会话时的说明 */
  noSession: string
  /** 更新时间前缀，如「更新于」 */
  updatedAt: string
  /** 工具数量模板，含 `{count}` */
  toolCount: string
  /** 字符数模板，含 `{count}` */
  charCount: string
  /** 单个工具的参数数量模板，含 `{count}` */
  paramCount: string
  /** 工具没有说明文字时的占位 */
  noDescription: string
  /** 对话消息数量模板，含 `{count}` */
  messageCount: string
  /** 消息被截断时的说明模板，含 `{count}` */
  messagesTruncated: string
  /** 「用户」角色标签 */
  roleUser: string
  /** 「助手」角色标签 */
  roleAssistant: string
  /** 「工具」角色标签 */
  roleTool: string
  /** 「声明」角色标签：模型看到的工具声明等内部消息 */
  roleDeveloper: string
}

/** 窗口打开参数。 */
interface ContextDialogOptions {
  /** 打开时默认展示的区块 */
  section: InspectSection
  /** 界面文案 */
  labels: ContextDialogLabels
  /** 读取数据；返回 null 表示定位不到当前会话 */
  load: (signal: AbortSignal) => Promise<ContextInspectPayload | null>
}

/** 自动刷新间隔：宿主侧按 revision 命中缓存，稳态只做一次 stat。 */
const REFRESH_INTERVAL_MS = 2000

/**
 * 铺满窗口的容器；层级要高于宿主的菜单与提示气泡（1100），否则详情窗口会被它们盖住。
 */
const OVERLAY_CLASS = 'fixed inset-0 z-[1200] box-border flex items-center justify-center p-6'

/**
 * 遮罩单独一层：只有拆成两个节点才能做到「背景半透明、面板本身不透明」，
 * 直接把透明度加在容器上会让面板一起变淡（与图片放大层同一处理）。
 */
const BACKDROP_CLASS = 'absolute inset-0 box-border bg-overlay opacity-90'

/** 面板：固定上限高度，正文自己滚动，标题与页签常驻。 */
const PANEL_CLASS =
  'aio-context-dialog relative box-border flex max-h-[84vh] w-[min(1080px,94vw)] flex-col overflow-hidden rounded-xl border border-solid border-line4 bg-layer1 shadow-xl outline-none'

/** 标题栏：标题与副标题靠左，关闭按钮靠右。 */
const HEADER_CLASS = 'box-border flex items-start gap-3 border-0 border-b border-solid border-line1 px-4 py-3'

/** 页签容器。 */
const TABS_CLASS = 'box-border flex shrink-0 items-center gap-1 border-0 border-b border-solid border-line1 px-3 py-1.5'

/** 页签按钮：未选中时只显示次要色，选中时用品牌色描边。 */
const TAB_CLASS =
  'box-border cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-1 text-[12.5px] leading-[18px] text-secondary transition-colors duration-150 hover:bg-interactive'

/** 选中页签的附加样式。 */
const TAB_ACTIVE_CLASS = 'bg-interactive text-primary'

/** 正文容器：唯一滚动区。 */
const BODY_CLASS = 'box-border min-h-[220px] flex-1 overflow-auto px-4 py-3'

/** 等宽正文（系统提示词与参数 JSON 共用）。 */
const CODE_CLASS =
  'm-0 whitespace-pre-wrap break-words font-mono text-[12px] leading-[18px] text-primary'

/** 空态与错误提示。 */
const STATUS_CLASS = 'box-border py-10 text-center text-[12.5px] leading-[18px] text-secondary'

/** 页脚：统计在左，操作在右。 */
const FOOTER_CLASS =
  'box-border flex shrink-0 items-center justify-between gap-3 border-0 border-t border-solid border-line1 px-4 py-2'

/** 页脚按钮。 */
const FOOTER_BUTTON_CLASS =
  'box-border cursor-pointer rounded-md border border-solid border-line4 bg-layer1 px-2.5 py-1 text-[12px] leading-[16px] text-primary transition-colors duration-150 hover:bg-interactive'

/** 工具卡片。 */
const TOOL_CARD_CLASS = 'box-border rounded-lg border border-solid border-line1 bg-base'

/** 工具卡片标题行。 */
const TOOL_SUMMARY_CLASS =
  'box-border flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-[12.5px] leading-[18px] text-primary'

/** 工具参数区。 */
const TOOL_PARAM_CLASS =
  'm-0 max-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded-md bg-layer2 p-2 font-mono text-[11.5px] leading-[16px] text-secondary'

/** 一条对话消息的卡片：角色标签在上，正文在下。 */
const MESSAGE_CARD_CLASS = 'box-border rounded-lg border border-solid border-line1 bg-base px-3 py-2'

/** 对话消息正文：保持换行，长行自动折行。 */
const MESSAGE_TEXT_CLASS =
  'm-0 whitespace-pre-wrap break-words font-mono text-[12px] leading-[18px] text-primary'

/** 当前打开的窗口；同一时刻只允许一个。 */
let activeDispose: (() => void) | undefined

/** 窗口自带的样式：宿主在 :root 上设了超椭圆圆角，弹窗要恢复标准圆角。 */
const DIALOG_STYLE = [
  '.aio-context-dialog { --dsw-corner-shape: initial; corner-shape: round; }',
  '.aio-context-dialog summary::-webkit-details-marker { display: none; }',
].join('\n')

/**
 * 创建一个元素并设置类名与文本。
 * @param tag 标签名
 * @param className 类名
 * @param text 文本内容；省略时不写
 * @returns 新元素
 */
function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  element.className = className
  if (text !== undefined) element.textContent = text

  return element
}

/**
 * 关闭当前窗口。
 */
function closeContextInspectDialog(): void {
  if (activeDispose === undefined) return

  const dispose = activeDispose
  activeDispose = undefined
  dispose()
}

/**
 * 打开上下文详情窗口。
 *
 * 已经打开时先关掉旧窗口，保证同一时刻只有一个详情窗口。
 * @param options 默认页签、文案与读取函数
 */
export function openContextInspectDialog(options: ContextDialogOptions): void {
  closeContextInspectDialog()

  const { labels, load } = options
  let section: InspectSection = options.section
  let payload: ContextInspectPayload | null = null
  let failed: string | undefined
  let loading = true
  let signature = ''
  let copiedTimer = 0
  const controller = new AbortController()
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined

  const style = document.createElement('style')
  style.setAttribute('data-dsh-plugin', 'dsh-all-in-one-context-inspect-dialog')
  style.textContent = DIALOG_STYLE
  document.head.appendChild(style)

  // 遮罩层：点击空白处关闭，面板内部的点击不冒泡到这一层
  const overlay = create('div', OVERLAY_CLASS)
  overlay.setAttribute('data-dsh-context-inspect-dialog', '')
  const backdrop = create('div', BACKDROP_CLASS)

  // 面板：无障碍上的对话框本体，打开时接管焦点
  const panel = create('div', PANEL_CLASS)
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-modal', 'true')
  panel.setAttribute('aria-label', labels.dialogTitle)
  panel.tabIndex = -1

  // 标题栏：标题、数据来源说明与关闭按钮
  const header = create('div', HEADER_CLASS)
  const heading = create('div', 'box-border min-w-0 flex-1')
  heading.appendChild(create('div', 'text-[14px] font-medium leading-[20px] text-primary', labels.dialogTitle))
  heading.appendChild(create('div', 'text-[11.5px] leading-[16px] text-tertiary', labels.dialogHint))
  header.appendChild(heading)

  // 关闭按钮：右上角，与宿主弹窗的关闭位置一致
  const closeButton = create(
    'button',
    'box-border cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 text-[12px] leading-[16px] text-secondary transition-colors duration-150 hover:bg-interactive',
    labels.close,
  )
  closeButton.type = 'button'
  header.appendChild(closeButton)

  // 页签栏：系统提示词、工具定义与对话消息三个区块
  const tabs = create('div', TABS_CLASS)
  tabs.setAttribute('role', 'tablist')

  // 「系统提示词」页签按钮
  const systemTab = create('button', TAB_CLASS, labels.tabSystem)
  systemTab.type = 'button'
  systemTab.setAttribute('role', 'tab')
  // 「工具定义」页签按钮
  const toolsTab = create('button', TAB_CLASS, labels.tabTools)
  toolsTab.type = 'button'
  toolsTab.setAttribute('role', 'tab')
  // 「对话消息」页签按钮
  const messagesTab = create('button', TAB_CLASS, labels.tabMessages)
  messagesTab.type = 'button'
  messagesTab.setAttribute('role', 'tab')
  tabs.appendChild(systemTab)
  tabs.appendChild(toolsTab)
  tabs.appendChild(messagesTab)

  const body = create('div', BODY_CLASS)
  const footer = create('div', FOOTER_CLASS)
  // 页脚统计：字符数、工具数量与更新时间
  const stats = create('span', 'text-[11.5px] leading-[16px] text-tertiary')
  const actions = create('div', 'box-border flex items-center gap-2')

  // 刷新按钮：立即重新读取一次
  const refreshButton = create('button', FOOTER_BUTTON_CLASS, labels.refresh)
  refreshButton.type = 'button'
  // 复制按钮：复制当前页签的完整内容
  const copyButton = create('button', FOOTER_BUTTON_CLASS, labels.copy)
  copyButton.type = 'button'
  actions.appendChild(refreshButton)
  actions.appendChild(copyButton)

  footer.appendChild(stats)
  footer.appendChild(actions)
  panel.appendChild(header)
  panel.appendChild(tabs)
  panel.appendChild(body)
  panel.appendChild(footer)
  overlay.appendChild(backdrop)
  overlay.appendChild(panel)

  /**
   * 取当前页签要展示与复制的文本。
   * @returns 系统提示词原文、工具定义的 JSON，或逐条列出的对话消息
   */
  function sectionText(): string {
    if (payload === null) return ''
    if (section === 'system') return payload.system
    if (section === 'tools') return JSON.stringify(payload.tools, null, 2)

    // 复制出来的消息带上角色标签，粘到别处仍能看出谁说的
    return payload.messages
      .map((message) => `[${roleLabel(message.role)}] ${message.text}`)
      .join('\n\n')
  }

  /**
   * 取角色标签的颜色类：用户与助手用状态色区分，工具与声明用次要色。
   * @param role 消息角色
   * @returns Tailwind 文本颜色类
   */
  function roleClass(role: InspectMessage['role']): string {
    switch (role) {
      case 'user':
        return 'text-brand'
      case 'assistant':
        return 'text-success'
      case 'tool':
        return 'text-tertiary'
      case 'developer':
        return 'text-warn'
    }
  }

  /**
   * 取角色标签。
   * @param role 消息角色
   * @returns 当前语言下的角色名
   */
  function roleLabel(role: InspectMessage['role']): string {
    switch (role) {
      case 'user':
        return labels.roleUser
      case 'assistant':
        return labels.roleAssistant
      case 'tool':
        return labels.roleTool
      case 'developer':
        return labels.roleDeveloper
    }
  }

  /**
   * 重画正文：只在数据真的变化时调用，避免轮询把滚动位置抖回去。
   */
  function renderBody(): void {
    const scrollTop = body.scrollTop
    // 刷新前若停在底部，重画后继续贴底：流式输出时用户看到的是最新一条。
    // 只有内容确实超过视口才谈得上「停在底部」；加载占位或首次渲染的高度与视口
    // 相同，若按同一公式判断会误判成贴底，一打开就跳到最末一条。
    const scrollable = body.scrollHeight > body.clientHeight + 40
    const atBottom = scrollable && body.scrollHeight - body.scrollTop - body.clientHeight < 40
    body.replaceChildren()

    // 读取中：显示占位提示，不显示空态
    if (loading) {
      body.appendChild(create('p', STATUS_CLASS, labels.loading))
      return
    }

    // 读取失败：显示原因与重试按钮
    if (failed !== undefined) {
      body.appendChild(create('p', `${STATUS_CLASS} text-danger`, `${labels.loadFailed}${failed}`))
      // 重试按钮：与手动刷新同一动作
      const retry = create('button', `${FOOTER_BUTTON_CLASS} mx-auto mt-3 block`, labels.retry)
      retry.type = 'button'
      retry.addEventListener('click', () => { void refresh() })
      body.appendChild(retry)
      return
    }

    // 定位不到会话：宿主可能刚把会话切走
    if (payload === null) {
      body.appendChild(create('p', STATUS_CLASS, labels.noSession))
      return
    }

    // 系统提示词页签
    if (section === 'system') {
      // 还没有发起过请求时日志里没有系统提示词
      if (payload.system.trim() === '') {
        body.appendChild(create('p', STATUS_CLASS, labels.emptySystem))
        return
      }

      body.appendChild(create('pre', CODE_CLASS, payload.system))
      body.scrollTop = atBottom ? body.scrollHeight : scrollTop
      return
    }

    // 对话消息页签
    if (section === 'messages') {
      // 还没有发起过请求时表面里没有任何对话消息
      if (payload.messages.length === 0) {
        body.appendChild(create('p', STATUS_CLASS, labels.emptyMessages))
        return
      }

      const messages = create('div', 'box-border flex flex-col gap-1.5')
      // 每条消息一张卡片：角色标签与日志序号在上，正文在下
      for (const message of payload.messages) {
        const card = create('div', MESSAGE_CARD_CLASS)
        const head = create('div', 'box-border mb-1 flex items-center gap-2')
        head.appendChild(
          create('span', `text-[11px] font-medium leading-[16px] ${roleClass(message.role)}`, roleLabel(message.role)),
        )
        head.appendChild(create('span', 'font-mono text-[10px] leading-[16px] text-tertiary', `#${message.seq}`))
        card.appendChild(head)
        card.appendChild(create('pre', MESSAGE_TEXT_CLASS, message.text))
        messages.appendChild(card)
      }

      body.appendChild(messages)
      body.scrollTop = atBottom ? body.scrollHeight : scrollTop
      return
    }

    // 工具定义页签
    if (payload.tools.length === 0) {
      body.appendChild(create('p', STATUS_CLASS, labels.emptyTools))
      return
    }

    const list = create('div', 'box-border flex flex-col gap-1.5')
    // 每个工具一张卡片：名称与参数个数常显，说明与参数展开后可见
    for (const tool of payload.tools) {
      const card = create('details', TOOL_CARD_CLASS)
      const summary = create('summary', TOOL_SUMMARY_CLASS)
      summary.appendChild(create('span', 'font-mono text-[12.5px] text-primary', tool.name))

      const paramCount = Object.keys(
        typeof tool.parameters === 'object' && tool.parameters !== null
          ? (tool.parameters as { properties?: Record<string, unknown> }).properties ?? {}
          : {},
      ).length
      summary.appendChild(
        create('span', 'text-[11px] leading-[16px] text-tertiary', labels.paramCount.replace('{count}', String(paramCount))),
      )
      card.appendChild(summary)

      const detail = create('div', 'box-border px-3 pb-3')
      detail.appendChild(
        create('p', 'm-0 mb-2 text-[12px] leading-[18px] text-secondary', tool.description.trim() === '' ? labels.noDescription : tool.description),
      )
      detail.appendChild(create('pre', TOOL_PARAM_CLASS, JSON.stringify(tool.parameters, null, 2)))
      card.appendChild(detail)
      list.appendChild(card)
    }

    body.appendChild(list)
    body.scrollTop = atBottom ? body.scrollHeight : scrollTop
  }

  /**
   * 重画页签选中状态与页脚统计。
   */
  function renderChrome(): void {
    // 三个页签统一设置选中状态：选中的用品牌底色，其余保持次要色
    for (const [key, tab] of [['system', systemTab], ['tools', toolsTab], ['messages', messagesTab]] as const) {
      const selected = section === key
      tab.className = selected ? `${TAB_CLASS} ${TAB_ACTIVE_CLASS}` : TAB_CLASS
      tab.setAttribute('aria-selected', selected ? 'true' : 'false')
    }

    // 每个页签给出自己的规模：字符数、工具数量或消息条数；三者都带更新时间
    const counts = payload === null
      ? ''
      : section === 'system'
        ? labels.charCount.replace('{count}', String(payload.system.length))
        : section === 'tools'
          ? labels.toolCount.replace('{count}', String(payload.tools.length))
          : [
            labels.messageCount.replace('{count}', String(payload.messagesTotal)),
            // 超过预算时只保留最近一段，必须说明，否则用户会以为消息丢了
            payload.messages.length < payload.messagesTotal
              ? labels.messagesTruncated.replace('{count}', String(payload.messages.length))
              : '',
          ].filter((part) => part !== '').join(' · ')
    const updated = payload === null
      ? ''
      : `${labels.updatedAt} ${new Date(payload.readAt).toLocaleTimeString()}`
    stats.textContent = [counts, updated].filter((part) => part !== '').join(' · ')

    // 没有数据时复制与刷新没有意义，只保留刷新（可重试）
    copyButton.disabled = payload === null
    copyButton.className = payload === null
      ? `${FOOTER_BUTTON_CLASS} cursor-not-allowed opacity-40`
      : FOOTER_BUTTON_CLASS
  }

  /**
   * 读取一次数据；后台自动刷新只在内容变化时重画正文。
   * @param silent 自动刷新时为 true：失败不覆盖已经展示的内容
   */
  async function refresh(silent = false): Promise<void> {
    if (!silent) {
      loading = true
      failed = undefined
      renderBody()
      renderChrome()
    }

    try {
      const next = await load(controller.signal)
      const wasLoading = loading
      payload = next
      failed = undefined
      loading = false

      const nextSignature = next === null
        ? 'null'
        : [
          next.system.length,
          next.tools.map((tool) => tool.name).join(','),
          JSON.stringify(next.tools).length,
          next.messagesTotal,
          next.messages.at(-1)?.seq ?? 0,
          next.messages.at(-1)?.text.length ?? 0,
        ].join(':')
      // 正文此时可能正显示加载占位（手动刷新刚把它换掉），内容即使未变也必须重画，
      // 否则会一直停在占位上；只有纯后台刷新才按变化与否决定，避免抖动滚动位置
      if (!silent || wasLoading || nextSignature !== signature) {
        signature = nextSignature
        renderBody()
      }
      renderChrome()
    } catch (error) {
      // 窗口已关闭时请求被中止，不再更新界面
      if (controller.signal.aborted) return

      console.error('[context-inspect] 读取上下文详情失败:', error)
      if (silent) return

      loading = false
      failed = error instanceof Error ? error.message : String(error)
      renderBody()
      renderChrome()
    }
  }

  /**
   * 关闭窗口并清理定时器、请求与全局监听。
   */
  function dispose(): void {
    controller.abort()
    window.clearInterval(timer)
    window.clearTimeout(copiedTimer)
    document.removeEventListener('keydown', onKeyDown)
    overlay.remove()
    style.remove()
    previousFocus?.focus()
  }

  // Esc 关闭窗口
  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return

    closeContextInspectDialog()
  }

  systemTab.addEventListener('click', () => {
    if (section === 'system') return

    section = 'system'
    renderBody()
    renderChrome()
  })

  messagesTab.addEventListener('click', () => {
    if (section === 'messages') return

    section = 'messages'
    renderBody()
    renderChrome()
  })

  toolsTab.addEventListener('click', () => {
    if (section === 'tools') return

    section = 'tools'
    renderBody()
    renderChrome()
  })

  refreshButton.addEventListener('click', () => { void refresh() })

  // 复制当前页签内容：成功后在按钮上给一次反馈
  copyButton.addEventListener('click', () => {
    const text = sectionText()
    if (text === '') return

    void navigator.clipboard.writeText(text).then(() => {
      copyButton.textContent = labels.copied
      window.clearTimeout(copiedTimer)
      copiedTimer = window.setTimeout(() => { copyButton.textContent = labels.copy }, 1500)
    }).catch((error: unknown) => {
      console.error('[context-inspect] 复制内容失败:', error)
    })
  })

  closeButton.addEventListener('click', () => { closeContextInspectDialog() })
  backdrop.addEventListener('click', () => { closeContextInspectDialog() })

  document.addEventListener('keydown', onKeyDown)
  document.body.appendChild(overlay)
  panel.focus()

  renderChrome()
  void refresh()

  // 自动刷新：页面不可见时跳过，避免后台标签页持续读日志
  const timer = window.setInterval(() => {
    if (document.hidden) return

    void refresh(true)
  }, REFRESH_INTERVAL_MS)

  activeDispose = dispose
}
