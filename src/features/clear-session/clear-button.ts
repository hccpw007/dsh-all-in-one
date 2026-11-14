/**
 * 输入框左侧的清空按钮。
 *
 * 宿主的 `conversation.input.left` 插槽排在「添加文件 / 调用指令」的加号之后，
 * 而本功能要出现在加号之前，插槽无法满足，只能按 DOM 注入：找到与加号同级的
 * 隐藏文件选择器，取它的父节点作为工具区，把按钮插到第一个子节点之前。
 *
 * 按钮只是入口：点击时读取当前对话并写入待确认请求，真正的清空由确认弹窗执行。
 */
import { attachTooltip } from './clear-tooltip'
import type { ClearSessionTarget } from './types'

/** 注入按钮上的标记属性，扫描时用它判断是否已经插过。 */
const BUTTON_ATTRIBUTE = 'data-aio-clear-session'

/** 按钮样式的节点 id；重复安装时复用同一节点。 */
const STYLE_ID = 'aio-clear-session-style'

/** 按钮类名，样式与宿主加号按钮完全一致（圆形 selector 底色）。 */
const BUTTON_CLASS = 'aio-clear-session'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/**
 * 按钮样式。
 *
 * 完全对齐宿主加号按钮（同 `.add` 规则）：28px 圆形、selector 底色、primary 图标色，
 * 两个圆钮并排才读作同一组工具。圆角重置为圆角而不是宿主的超椭圆，
 * 否则 `--dsw-corner-shape` 会让小尺寸圆钮看起来「不够圆」。
 *
 * 刻意不定义禁用态：宿主加号在任何时候都保持满底色，按钮一旦被置灰就会与它
 * 明显不一致；「当前对话在运行」这类限制改由弹窗说明，外观始终对齐。
 */
const STYLE_TEXT = `
.${BUTTON_CLASS} {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  corner-shape: round;
  background: var(--dsw-specific-selector, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-primary, currentColor);
  cursor: pointer;
}
@media (hover: hover) {
  .${BUTTON_CLASS}:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover-solid, var(--dsw-specific-selector));
  }
}
.${BUTTON_CLASS} svg {
  display: block;
}
`

/** 按钮行为：读取当前对话，以及用户点击后的动作。 */
export interface ClearButtonOptions {
  /** 按钮名称，同时作为无障碍标签与悬停提示。 */
  label: string
  /** 读取当前对话；没有正在浏览的对话时返回 undefined。 */
  readTarget: () => ClearSessionTarget | undefined
  /** 点击后发起确认请求。 */
  onRequest: (target: ClearSessionTarget) => void
}

/**
 * 创建清空图标：一道开口圆环内嵌一条横线，表达「把对话内容清掉」；
 * 圆环开口留出缺口，比闭合圆更像一次操作而不是状态标记。
 * @returns 16×16 的 svg 元素
 */
function createClearIcon(): Element {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('width', '14')
  svg.setAttribute('height', '14')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.5')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')

  // 圆环：从顶部顺时针绕到左侧，左上留缺口
  const ring = document.createElementNS(SVG_NAMESPACE, 'path')
  ring.setAttribute('d', 'M8 3.2a4.8 4.8 0 1 1-4.8 4.8')
  svg.appendChild(ring)

  // 中心横线：被清掉的那段内容
  const bar = document.createElementNS(SVG_NAMESPACE, 'path')
  bar.setAttribute('d', 'M5.9 8h4.2')
  svg.appendChild(bar)

  return svg
}

/** 注入样式；重复安装时复用同一节点。 */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLE_TEXT
  document.head.appendChild(style)
}

/**
 * 找到所有宿主输入框的工具区。
 *
 * 定位依据是宿主输入框里的隐藏文件选择器：它与「+」按钮同级，父节点就是工具区。
 * 只认带按钮的父节点，避免把设置页等其它地方的文件选择器当成输入框。
 * @returns 尚未注入按钮的工具区
 */
function findToolbars(): HTMLElement[] {
  const toolbars: HTMLElement[] = []

  for (const input of document.querySelectorAll('input[type="file"]')) {
    const parent = input.parentElement
    if (parent === null) continue
    if (parent.querySelector('button') === null) continue
    if (parent.querySelector(`[${BUTTON_ATTRIBUTE}]`) !== null) continue

    toolbars.push(parent)
  }

  return toolbars
}

/**
 * 在输入框工具区最左侧安装清空按钮。
 * @param options 按钮文案与点击行为
 * @returns 卸载函数：移除按钮、样式与观察器
 */
export function installClearButton(options: ClearButtonOptions): () => void {
  ensureStyle()

  const buttons = new Set<HTMLButtonElement>()
  /** 每个按钮的提示卸载函数：按钮被宿主摘掉时一并解绑。 */
  const detachers = new Map<HTMLButtonElement, () => void>()
  let frame = 0
  let scheduled = false
  let disposed = false

  /** 宿主整块重建输入框时按钮会被摘掉，这里顺手清理失效引用与事件。 */
  const pruneButtons = (): void => {
    for (const button of buttons) {
      if (button.isConnected) continue

      detachers.get(button)?.()
      detachers.delete(button)
      buttons.delete(button)
    }
  }

  /** 扫描并注入；节点增删很频繁，回调里只做少量查询。 */
  const scan = (): void => {
    frame = 0
    scheduled = false
    if (disposed) return

    pruneButtons()

    for (const toolbar of findToolbars()) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = BUTTON_CLASS
      button.setAttribute(BUTTON_ATTRIBUTE, '')
      button.appendChild(createClearIcon())

      // 阻止默认行为与冒泡：输入框区域有点击聚焦与快捷键处理，按钮不应触发它们
      button.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()

        const target = options.readTarget()
        // 会话未就绪时没有可清空的目标；运行中的对话仍打开弹窗，由弹窗说明需先停止
        if (target === undefined) return

        options.onRequest(target)
      })

      // 提示与无障碍标签用同一份文案，外观与相邻的加号按钮一致
      button.setAttribute('aria-label', options.label)
      detachers.set(button, attachTooltip(button, () => options.label))

      toolbar.insertBefore(button, toolbar.firstElementChild)
      buttons.add(button)
    }
  }

  const schedule = (): void => {
    if (scheduled || disposed) return
    scheduled = true
    frame = window.requestAnimationFrame(scan)
  }

  // 只监听节点增删：流式输出会频繁改动文本节点，回调已是合并到每帧一次
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  schedule()

  return () => {
    disposed = true
    observer.disconnect()
    if (frame !== 0) window.cancelAnimationFrame(frame)

    for (const button of buttons) {
      detachers.get(button)?.()
      button.remove()
    }
    detachers.clear()
    buttons.clear()
    document.getElementById(STYLE_ID)?.remove()
  }
}
