/**
 * 输入框左侧的新会话按钮组。
 *
 * 宿主的 `conversation.input.left` 插槽排在「添加文件 / 调用指令」的加号之后，
 * 而本功能要出现在加号之前，插槽无法满足，只能按 DOM 注入：找到与加号同级的
 * 隐藏文件选择器，取它的父节点作为工具区，把按钮插到第一个子节点之前。
 *
 * 两个按钮语义不同：`+` 直接开新对话、当前会话原样保留；`-` 先请求确认，
 * 确认后才删除当前会话并开新对话。删除这类不可逆动作一律经过弹窗。
 */
import { attachTooltip } from './clear-tooltip'
import type { ClearSessionTarget } from './types'

/** 注入按钮上的标记属性：扫描时判断是否已经插过，值记录按钮种类。 */
const BUTTON_ATTRIBUTE = 'data-aio-clear-session'

/** 按钮样式的节点 id；重复安装时复用同一节点。 */
const STYLE_ID = 'aio-clear-session-style'

/** 按钮类名，样式与宿主加号按钮完全一致（圆形 selector 底色）。 */
const BUTTON_CLASS = 'aio-clear-session'

/** 宿主输入框里的隐藏文件选择器：定位工具区的唯一依据。 */
const FILE_INPUT_SELECTOR = 'input[type="file"]'

/**
 * 变更合并窗口。
 *
 * 观察范围是整个 document，消息区每帧都在变；按帧扫描会让全文档查询也跟着每帧
 * 跑一次，这里改成短防抖，按钮出现只晚一瞬，用户无感。
 */
const RESCAN_DEBOUNCE_MS = 100

/** 图标使用的 SVG 命名空间。 */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/**
 * 气泡轮廓：宿主原生新会话图标 `IconNewChatOutlineMedium` 的外框，
 * 与用户已认识的「新会话」符号保持一致；原数据的五位小数精简到两位，
 * 16 网格下差值远小于 1px，视觉无差别。
 */
const BUBBLE_PATH =
  'M2.37 11.25C1.59 9.89 1.32 8.3 1.62 6.76 1.92 5.22 2.76 3.84 4 2.88 ' +
  '5.23 1.91 6.77 1.43 8.34 1.51 9.9 1.59 11.39 2.24 12.51 3.32 ' +
  '13.64 4.41 14.34 5.87 14.48 7.43 14.61 8.99 14.18 10.55 13.26 11.82 ' +
  '12.34 13.09 10.99 13.98 9.46 14.33 8.19 14.63 6.86 14.53 5.65 14.06 ' +
  '5.17 13.87 4.77 13.49 4.27 13.4 3.67 13.28 2.95 13.56 2.04 14.33'

/** 加号：开启一条新对话，当前会话保留。 */
const PLUS_PATH = 'M8 5V11M5 8H11'

/** 减号：删除当前会话再开启新对话。 */
const MINUS_PATH = 'M5 8H11'

/**
 * 按钮样式。
 *
 * 完全对齐宿主加号按钮（同 `.add` 规则）：28px 圆形、selector 底色、primary 图标色，
 * 一排圆钮才读作同一组工具。圆角重置为圆角而不是宿主的超椭圆，
 * 否则 `--dsw-corner-shape` 会让小尺寸圆钮看起来「不够圆」。
 *
 * 刻意不定义禁用态：宿主加号在任何时候都保持满底色，按钮一旦被置灰就会与它
 * 明显不一致；「当前没有可删除的会话」这类限制改为点击后不响应。
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

/** 按钮种类：加号开启新会话，减号删除当前会话后再开启。 */
type ButtonKind = 'new' | 'delete'

/** 按钮行为：读取当前对话，以及两个图标各自的点击动作。 */
export interface ClearButtonOptions {
  /** 加号按钮的名称，同时作为无障碍标签与悬停提示。 */
  newLabel: string
  /** 减号按钮的名称，同时作为无障碍标签与悬停提示。 */
  deleteLabel: string
  /** 读取当前对话；没有正在浏览的对话时返回 undefined。 */
  readTarget: () => ClearSessionTarget | undefined
  /** 加号点击：开启新会话并保留当前会话；没有当前对话时同样可以开新会话。 */
  onNew: (target: ClearSessionTarget | undefined) => void
  /** 减号点击：请求删除确认，由弹窗执行删除。 */
  onDelete: (target: ClearSessionTarget) => void
}

/**
 * 创建按钮图标：气泡内一个加号或减号。
 * 描边宽度取宿主的 medium 档（1.3px / 16 网格），与左侧加号按钮同一粗细。
 * @param kind 按钮种类，决定气泡中心的符号
 * @returns 14×14 的 svg 元素，16 网格上与图标本身等比例
 */
function createIcon(kind: ButtonKind): Element {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('width', '14')
  svg.setAttribute('height', '14')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.3')
  svg.setAttribute('aria-hidden', 'true')

  // 气泡轮廓与中心符号分开成两条路径：符号粗细不受轮廓影响，也方便逐个替换
  const bubble = document.createElementNS(SVG_NAMESPACE, 'path')
  bubble.setAttribute('d', BUBBLE_PATH)
  const mark = document.createElementNS(SVG_NAMESPACE, 'path')
  mark.setAttribute('d', kind === 'new' ? PLUS_PATH : MINUS_PATH)
  svg.append(bubble, mark)

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
 * 找到一个按钮：样式、标记属性、图标与点击拦截都由这里统一处理。
 * @param options 按钮文案与点击行为
 * @param kind 按钮种类
 * @returns 尚未挂到工具区上的按钮
 */
function createButton(options: ClearButtonOptions, kind: ButtonKind): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = BUTTON_CLASS
  button.setAttribute(BUTTON_ATTRIBUTE, kind)
  button.appendChild(createIcon(kind))

  // 阻止默认行为与冒泡：输入框区域有点击聚焦与快捷键处理，按钮不应触发它们
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const target = options.readTarget()

    // 加号不依赖当前对话：空白的新会话页面同样可以开新会话
    if (kind === 'new') {
      options.onNew(target)
      return
    }

    // 减号没有当前对话就没有可删除的目标，直接忽略
    if (target === undefined) return

    options.onDelete(target)
  })

  return button
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

  for (const input of document.querySelectorAll(FILE_INPUT_SELECTOR)) {
    const parent = input.parentElement
    if (parent === null) continue
    if (parent.querySelector('button') === null) continue
    if (parent.querySelector(`[${BUTTON_ATTRIBUTE}]`) !== null) continue

    toolbars.push(parent)
  }

  return toolbars
}

/**
 * 判断一条变更记录是否需要重新扫描。
 *
 * 只关心两类变动：宿主插入或重建输入框（含隐藏文件选择器），以及把我们注入的
 * 按钮摘掉。流式输出改的是消息区，与工具区无关，不该带着全文档查询一起跑。
 * @param record 变更记录
 * @returns 需要重新扫描时返回 true
 */
function touchesToolbar(record: MutationRecord): boolean {
  for (const node of [...record.addedNodes, ...record.removedNodes]) {
    if (!(node instanceof Element)) continue
    if (node.matches(FILE_INPUT_SELECTOR)) return true
    if (node.matches(`[${BUTTON_ATTRIBUTE}]`)) return true
    if (node.firstElementChild !== null && node.querySelector(FILE_INPUT_SELECTOR) !== null) return true
  }

  return false
}

/**
 * 在输入框工具区最左侧安装新会话按钮组。
 * @param options 按钮文案与点击行为
 * @returns 卸载函数：移除按钮、样式与观察器
 */
export function installClearButton(options: ClearButtonOptions): () => void {
  ensureStyle()

  const buttons = new Set<HTMLButtonElement>()
  /** 每个按钮的提示卸载函数：按钮被宿主摘掉时一并解绑。 */
  const detachers = new Map<HTMLButtonElement, () => void>()
  let timer: number | undefined
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
    timer = undefined
    if (disposed) return

    pruneButtons()

    for (const toolbar of findToolbars()) {
      const newButton = createButton(options, 'new')
      const deleteButton = createButton(options, 'delete')

      // 提示与无障碍标签用同一份文案，外观与相邻的加号按钮一致
      newButton.setAttribute('aria-label', options.newLabel)
      deleteButton.setAttribute('aria-label', options.deleteLabel)
      detachers.set(newButton, attachTooltip(newButton, () => options.newLabel))
      detachers.set(deleteButton, attachTooltip(deleteButton, () => options.deleteLabel))

      // 先插加号再把减号插到它前面，工具区最左侧的顺序固定为「- +」
      toolbar.insertBefore(newButton, toolbar.firstElementChild)
      toolbar.insertBefore(deleteButton, newButton)
      buttons.add(newButton)
      buttons.add(deleteButton)
    }
  }

  const schedule = (): void => {
    if (timer !== undefined || disposed) return
    timer = window.setTimeout(scan, RESCAN_DEBOUNCE_MS)
  }

  // 只监听节点增删：流式输出会频繁改动文本节点，回调先按变更记录过滤再合并
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (!touchesToolbar(record)) continue

      schedule()

      return
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  schedule()

  return () => {
    disposed = true
    observer.disconnect()
    if (timer !== undefined) window.clearTimeout(timer)

    for (const button of buttons) {
      detachers.get(button)?.()
      button.remove()
    }
    detachers.clear()
    buttons.clear()
    document.getElementById(STYLE_ID)?.remove()
  }
}
