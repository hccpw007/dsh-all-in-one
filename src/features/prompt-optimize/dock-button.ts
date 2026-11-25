/**
 * 「提示词优化」按钮在输入行里的原生挂载点。
 *
 * 宿主没有「发送按钮之后」的插槽：`conversation.input.right` 渲染在
 * `standardControls` 里，而发送按钮是它的兄弟节点、并且排在这一排的最后，
 * 因此插槽内容只能出现在发送按钮左侧。这里改用装饰器：按 CSS Module 里
 * 稳定保留的 `_trailing` / `_primary` 类名定位发送按钮，把按钮插到它之后。
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
 * 尺寸与旁边 34px 的发送圆对齐（同高、同一基线），图标 20px；再给一层浅底与描边，
 * 让它在未悬停时也读得出「这里可以点」，而不是一枚发灰的装饰图标。
 * `-translate-y-0.5` 跟发送按钮的 `translateY(-2px)` 对齐：宿主把这一排控件整体下移，
 * 发送圆自己又提回去，本按钮跟着提回同样的距离。
 */
const BUTTON_CLASS = [
  'flex h-[34px] w-[34px] shrink-0 -translate-y-0.5 items-center justify-center rounded-lg p-0',
  // line1 只有 4% 不透明，白底上等于没有；line4 是宿主设置卡的描边档，浅色 16%、深色 20%。
  // bg-transparent 不能省：原生 button 的默认底色是写死的浅灰，深色主题下会突兀。
  'border border-solid border-line4 bg-transparent text-primary transition-colors',
  'hover:bg-interactive',
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
 * 把按钮放到发送按钮之后。
 *
 * 已经就位时不动节点，避免每帧重建导致悬停与焦点状态丢失。
 * @param button 本按钮
 * @param primary 发送按钮
 * @returns 是否处于正确位置
 */
function placeAfter(button: HTMLButtonElement, primary: HTMLElement): boolean {
  if (button.previousElementSibling === primary) return true

  primary.insertAdjacentElement('afterend', button)

  return false
}

/**
 * 在输入行的发送按钮之后挂载本按钮。
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
  placeAfter(button, primary)

  /** 最近一次同步过来的状态，用于事件回调里读当前值。 */
  let view: DockView | undefined

  // 按下时不抢走输入框焦点：与宿主发送按钮的 keepFocus 一致，草稿与光标位置不动
  const onMouseDown = (event: MouseEvent): void => {
    event.preventDefault()
  }

  const onClick = (): void => {
    if (view === undefined || view.disabled) return

    view.onActivate()
  }

  button.addEventListener('mousedown', onMouseDown)
  button.addEventListener('click', onClick)

  /**
   * 守护按钮位置。
   *
   * 宿主重渲染会重建发送按钮，我们插入的节点随之被移除；这里在每次变动后重新
   * 定位并插回，同时不碰其它节点。
   */
  const observer = new MutationObserver(() => {
    const current = findPrimary()
    if (current === undefined) return

    // 被换掉的旧节点已经不在文档里；新节点就位后把按钮接在它后面
    if (!button.isConnected) current.insertAdjacentElement('afterend', button)

    else placeAfter(button, current)
  })
  observer.observe(trailing, { childList: true })

  return {
    sync(next: DockView): void {
      view = next
      button.setAttribute('aria-label', next.label)
      button.setAttribute('title', next.label)
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
      button.removeEventListener('mousedown', onMouseDown)
      button.removeEventListener('click', onClick)
      button.remove()
    },
  }
}
