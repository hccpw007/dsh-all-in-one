/**
 * 「提示词优化」按钮在输入行里的原生挂载点。
 *
 * 宿主没有「紧贴发送按钮之前」的插槽：`conversation.input.right` 渲染在
 * `standardControls` 里，插槽内容与发送按钮之间还隔着整块 `activity` 容器，
 * 直接用它会把图标推到「全自动」旁边。这里改用装饰器：按 CSS Module 里
 * 稳定保留的 `_trailing` / `_primary` 类名定位发送按钮，把按钮紧插到它左侧。
 *
 * 宿主重渲染会重建这一排控件，节点被换掉时需重插，因此用 MutationObserver 守护。
 * 样式沿用插件已在用的 Tailwind 类名（宿主页面里同样生效），不必写内联样式。
 */

/** 输入行右侧这一排控件的容器类名后缀。 */
const TRAILING_SELECTOR = '[class*="_trailing"]'

/** 发送按钮的类名后缀；CSS Module 生成的哈希前缀在不同构建里会变，后缀稳定。 */
const PRIMARY_SELECTOR = '[class*="_primary"]'

/** 本按钮的标记属性，用于幂等地找出已插入的节点。 */
const MARK_ATTRIBUTE = 'data-dsh-prompt-optimize'

/** 悬停提示的显示延迟：鼠标只是划过时不至于甩出一串气泡。 */
const TOOLTIP_DELAY_MS = 300

/** 提示气泡与按钮之间的间距（px）。 */
const TOOLTIP_GAP = 8

/** 气泡离视口边缘的最小留白（px），避免贴边或被裁掉。 */
const TOOLTIP_MARGIN = 12

/** 气泡 id 的递增序号：同一页面可能同时挂多个输入行，id 必须唯一。 */
let bubbleSequence = 0

/** 按钮的可见状态，由 React 侧按草稿与提交阶段算出后同步过来。 */
export interface DockView {
  /** 悬停提示与可访问名称。 */
  readonly label: string
  /** 是否禁用。 */
  readonly disabled: boolean
  /** 是否正在请求优化。 */
  readonly pending: boolean
  /** 点击处理。 */
  readonly onActivate: () => void
}

/** 挂载后返回的操作面。 */
export interface DockButton {
  /** 把最新状态写到按钮上。 */
  sync(view: DockView): void
  /** 移除按钮并停止守护。 */
  dispose(): void
}

/** 图标边长：比宿主控件里的 16px 字形更大，才不会被旁边的发送圆盖过去。 */
const ICON_SIZE = 20

/** 空闲时的图标：文字行加星芒，表达「把这句话改得更好」。 */
const IDLE_ICON = `<svg viewBox="0 0 16 16" width="${ICON_SIZE}" height="${ICON_SIZE}" aria-hidden="true" fill="none"`
  + ' stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">'
  + '<path d="M2 4.6h7.2M2 8h5.2M2 11.4h3.6"/>'
  + '<path d="M11.9 2.6l.6 1.55 1.55.6-1.55.6-.6 1.55-.6-1.55-1.55-.6 1.55-.6z"/>'
  + '<path d="M12.7 9.4l.44 1.15 1.15.44-1.15.44-.44 1.15-.44-1.15-1.15-.44 1.15-.44z"/></svg>'

/** 请求进行中的环形进度，让用户知道模型在跑。 */
const BUSY_ICON = `<svg viewBox="0 0 16 16" width="${ICON_SIZE}" height="${ICON_SIZE}" aria-hidden="true"`
  + ' class="animate-spin">'
  + '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.25"/>'
  + '<path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'

/**
 * 按钮的固定类名。
 *
 * 无边框、无底色：这一排控件本身已经密集，再加一层框会与发送圆抢注意力，
 * 用户明确要求只留图标本体。悬停时给一层淡底，说明这里可以点。
 * 尺寸与旁边 34px 的发送圆同高，图标 20px。
 * `-translate-y-0.5` 跟发送按钮的 `translateY(-2px)` 对齐：宿主把这一排控件整体下移，
 * 发送圆自己又提回去，本按钮跟着提回同样的距离。
 */
const BUTTON_CLASS = [
  'flex h-[34px] w-[34px] shrink-0 -translate-y-0.5 items-center justify-center rounded-lg p-0',
  // border-0 与 bg-transparent 都不能省：原生 button 自带 2px 边框与写死的浅灰底色，
  // 深色主题下会露出一圈灰框。
  'border-0 bg-transparent text-secondary transition-colors',
  'hover:bg-interactive hover:text-primary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
].join(' ')

/**
 * 找出输入行里的发送按钮。
 * @returns 发送按钮；会话未就绪或宿主结构变化时返回 undefined
 */
function findPrimary(): HTMLElement | undefined {
  const primary = document.querySelector(`${TRAILING_SELECTOR} > ${PRIMARY_SELECTOR}`)

  return primary instanceof HTMLElement ? primary : undefined
}

/**
 * 创建按钮节点。
 *
 * `type="button"` 必不可少：它在这一排控件的容器里，不写会被当成表单提交按钮。
 * @returns 已配好类名与初始图标的新节点
 */
function createButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.setAttribute(MARK_ATTRIBUTE, '')
  button.className = BUTTON_CLASS
  button.innerHTML = IDLE_ICON

  return button
}

/**
 * 创建悬停提示气泡。
 *
 * 视觉规格对齐宿主自带的 Tooltip（3px/7px 内边距、8px 圆角、13px 字号、深色底白字）。
 * 用 fixed 定位并挂到 body：输入行有溢出裁剪与层叠上下文，放在按钮内部会被切掉。
 * @returns 尚未放入文档、初始隐藏的气泡节点
 */
function createBubble(): HTMLDivElement {
  const bubble = document.createElement('div')
  bubble.setAttribute('role', 'tooltip')
  bubble.className = [
    'pointer-events-none fixed z-[100] max-w-[240px] rounded-[8px] px-[7px] py-[3px]',
    'bg-tooltip text-[13px] leading-[20px] text-tooltipLabel',
    'transition-opacity duration-150',
  ].join(' ')
  // 用 visibility 而非 display 隐藏：保持可测量，定位时才能读到真实宽度
  bubble.style.visibility = 'hidden'
  bubble.style.opacity = '0'

  return bubble
}

/**
 * 把气泡摆在按钮正上方并夹在视口内。
 *
 * 先测量再定位：按钮贴近右侧时，居中的气泡会溢出视口，这里把它往回收。
 * @param bubble 提示气泡
 * @param anchor 按钮
 */
function placeBubble(bubble: HTMLDivElement, anchor: HTMLElement): void {
  const rect = anchor.getBoundingClientRect()
  const half = bubble.offsetWidth / 2
  const center = rect.left + rect.width / 2
  const minLeft = TOOLTIP_MARGIN + half
  const maxLeft = window.innerWidth - TOOLTIP_MARGIN - half

  bubble.style.left = `${Math.max(minLeft, Math.min(center, maxLeft))}px`
  bubble.style.top = `${rect.top - TOOLTIP_GAP}px`
  bubble.style.transform = 'translate(-50%, -100%)'
}

/**
 * 把按钮放到发送按钮之前。
 *
 * 已经就位时不动节点，避免每帧重建导致悬停与焦点状态丢失。
 * @param button 本按钮
 * @param primary 发送按钮
 * @returns 是否处于正确位置
 */
function placeBefore(button: HTMLButtonElement, primary: HTMLElement): boolean {
  if (button.nextElementSibling === primary) return true

  primary.insertAdjacentElement('beforebegin', button)

  return false
}

/**
 * 在输入行的发送按钮左侧挂载本按钮。
 * @returns 同步状态与卸载的操作面；找不到发送按钮时返回 undefined
 */
export function mountDockButton(): DockButton | undefined {
  const primary = findPrimary()
  if (primary === undefined) {
    console.error('[prompt-optimize] 找不到输入行的发送按钮，优化按钮不会挂载')

    return undefined
  }

  const trailing = primary.parentElement
  if (trailing === null) {
    console.error('[prompt-optimize] 发送按钮没有父容器，优化按钮不会挂载')

    return undefined
  }

  const button = createButton()
  placeBefore(button, primary)

  const bubble = createBubble()
  bubbleSequence += 1
  bubble.id = `dsh-prompt-optimize-tip-${bubbleSequence}`
  button.setAttribute('aria-describedby', bubble.id)
  document.body.append(bubble)

  /** 最近一次同步过来的状态，用于事件回调里读当前值。 */
  let view: DockView | undefined

  /** 延迟显示气泡的计时器；移出、点击、卸载时都要撤掉。 */
  let showTimer: number | undefined

  /**
   * 显示气泡。
   *
   * 按钮处于 disabled 时，浏览器不派发鼠标事件，所以提示只能挂在外面这层容器上；
   * 这里用 pointerenter 检查鼠标是否落在按钮矩形内，从而在禁用态也能给出原因。
   */
  const showBubble = (): void => {
    if (view === undefined || bubble.textContent === '') return

    placeBubble(bubble, button)
    bubble.style.visibility = 'visible'
    bubble.style.opacity = '1'
  }

  /** 立即隐藏气泡并取消待显示的计时器。 */
  const hideBubble = (): void => {
    if (showTimer !== undefined) {
      window.clearTimeout(showTimer)
      showTimer = undefined
    }
    bubble.style.opacity = '0'
    bubble.style.visibility = 'hidden'
  }

  // 鼠标进入按钮矩形后延时显示：先摆好位置再淡入，避免在旧位置闪一下
  const onPointerMove = (event: PointerEvent): void => {
    const rect = button.getBoundingClientRect()
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom

    if (!inside) {
      hideBubble()

      return
    }

    if (showTimer !== undefined || bubble.style.visibility === 'visible') return

    showTimer = window.setTimeout(() => {
      showTimer = undefined
      showBubble()
    }, TOOLTIP_DELAY_MS)
  }

  // 按下时不抢走输入框焦点：与宿主发送按钮的 keepFocus 一致，草稿与光标位置不动
  const onMouseDown = (event: MouseEvent): void => {
    event.preventDefault()
  }

  const onClick = (): void => {
    hideBubble()
    if (view === undefined || view.disabled) return

    view.onActivate()
  }

  // 键盘用户拿到同一份提示：聚焦显示、失焦隐藏
  const onFocus = (): void => {
    showBubble()
  }

  button.addEventListener('mousedown', onMouseDown)
  button.addEventListener('click', onClick)
  button.addEventListener('focus', onFocus)
  button.addEventListener('blur', hideBubble)
  button.addEventListener('mouseleave', hideBubble)
  // 挂在 trailing 上而不是按钮上：disabled 的按钮收不到鼠标事件
  trailing.addEventListener('pointermove', onPointerMove)
  trailing.addEventListener('pointerleave', hideBubble)
  // 输入行会随页面滚动移动；气泡是 fixed 定位，滚动时必须跟着重算或直接收起
  window.addEventListener('scroll', hideBubble, true)

  /**
   * 守护按钮位置。
   *
   * 宿主重渲染会重建发送按钮，我们插入的节点随之被移除；这里在每次变动后重新
   * 定位并插回，同时不碰其它节点。
   */
  const observer = new MutationObserver(() => {
    const current = findPrimary()
    if (current === undefined) return

    // 被换掉的旧节点已经不在文档里；新节点就位后把按钮接在它前面
    if (!button.isConnected) current.insertAdjacentElement('beforebegin', button)

    else placeBefore(button, current)
  })
  observer.observe(trailing, { childList: true })

  return {
    sync(next: DockView): void {
      view = next
      button.setAttribute('aria-label', next.label)
      // 文案变化时同步气泡内容；内容为空说明状态还没算出来，直接收起
      if (bubble.textContent !== next.label) bubble.textContent = next.label
      if (next.label === '') hideBubble()
      button.setAttribute('aria-busy', String(next.pending))
      button.disabled = next.disabled
      button.style.cursor = next.pending ? 'progress' : next.disabled ? 'default' : 'pointer'
      button.style.opacity = next.disabled && !next.pending ? '0.5' : ''

      const icon = next.pending ? BUSY_ICON : IDLE_ICON
      // 只在图标真的换了时改 DOM，避免每次同步都重建 SVG 打断进行中的动画
      if (button.dataset.icon !== (next.pending ? 'busy' : 'idle')) {
        button.dataset.icon = next.pending ? 'busy' : 'idle'
        button.innerHTML = icon
      }
    },
    dispose(): void {
      observer.disconnect()
      hideBubble()
      button.removeEventListener('mousedown', onMouseDown)
      button.removeEventListener('click', onClick)
      button.removeEventListener('focus', onFocus)
      button.removeEventListener('blur', hideBubble)
      button.removeEventListener('mouseleave', hideBubble)
      trailing.removeEventListener('pointermove', onPointerMove)
      trailing.removeEventListener('pointerleave', hideBubble)
      window.removeEventListener('scroll', hideBubble, true)
      bubble.remove()
      button.remove()
    },
  }
}
