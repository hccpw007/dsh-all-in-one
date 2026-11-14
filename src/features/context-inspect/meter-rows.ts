/**
 * 上下文弹层的行接管。
 *
 * 宿主的上下文气泡点开后是一个挂在 `body` 上的弹层：条形图下面用 `dl` 列出
 * 「系统提示词 / 工具定义 / 对话消息」三行。宿主没有给这三行留扩展点，这里按
 * 结构认领前两行（固定顺序、数值以 `~` 开头的三行列表），给它们加上点击与键盘
 * 操作，点击后打开本功能的详情窗口。
 *
 * 依赖宿主弹层的 DOM 结构；结构变化时只是不再接管，气泡本身照常工作。
 */
import type { InspectSection } from './types'

/** 弹层容器：宿主的上下文气泡用 `role="dialog"` 声明。 */
const PANEL_SELECTOR = '[role="dialog"]'

/** 弹层里被接管的行，值为区块名；用于样式与重复接管判定。 */
const ROW_ATTRIBUTE = 'data-dsh-aio-context-inspect'

/** 行接管需要的界面文案。 */
export interface MeterRowLabels {
  /** 系统提示词行的可点击提示 */
  systemHint: string
  /** 工具定义行的可点击提示 */
  toolsHint: string
}

/** 安装参数。 */
export interface MeterRowOptions {
  /** 行上的无障碍提示文案 */
  labels: MeterRowLabels
  /** 点击某一行后打开对应区块 */
  open: (section: InspectSection) => void
}

/** 弹层行样式：只做指针、悬停反馈与行内小图标，不改宿主布局。 */
const ROW_STYLE = [
  `[${ROW_ATTRIBUTE}] {`,
  '  cursor: pointer;',
  '  margin-inline: -4px;',
  '  padding-inline: 4px;',
  '  border-radius: 4px;',
  '  transition: background-color 120ms;',
  '}',
  `[${ROW_ATTRIBUTE}]:hover { background: var(--dsw-alias-interactive-bg-hover); }`,
  `[${ROW_ATTRIBUTE}]:focus-visible {`,
  '  outline: 2px solid var(--dsw-alias-brand-primary);',
  '  outline-offset: 1px;',
  '}',
  `[${ROW_ATTRIBUTE}] > dt::after {`,
  `  content: 'ⓘ';`,
  '  margin-inline-start: 4px;',
  '  font-size: 10px;',
  '  color: var(--dsw-alias-label-tertiary);',
  '}',
].join('\n')

/**
 * 判断一行是否属于上下文构成列表。
 * @param row 列表里的一行
 * @returns 带 `dd` 且数值以 `~` 开头时返回 true
 */
function isBreakdownRow(row: Element): boolean {
  const value = row.querySelector(':scope > dd')

  return value !== null && (value.textContent ?? '').trim().startsWith('~')
}

/**
 * 在弹层里找出三行上下文构成。
 *
 * 宿主按「系统提示词、工具定义、对话消息」的固定顺序渲染，且每行的 token 数都带
 * `~` 前缀；用「三行 + 都有 dd + 都以 ~ 开头」三个条件认领，避免误伤设置弹窗等
 * 其它带 `dl` 的对话框。
 * @param panel 宿主弹层
 * @returns 三行元素；结构不符时返回 null
 */
function findBreakdownRows(panel: Element): Element[] | null {
  for (const list of panel.querySelectorAll('dl')) {
    const rows = Array.from(list.children).filter((child) => child.tagName === 'DIV')
    if (rows.length !== 3) continue
    if (!rows.every(isBreakdownRow)) continue

    return rows
  }

  return null
}

/**
 * 给一行绑定点击与键盘操作。
 * @param row 行元素
 * @param section 该行对应的区块
 * @param options 安装参数
 */
function claimRow(row: Element, section: InspectSection, options: MeterRowOptions): void {
  if (row.hasAttribute(ROW_ATTRIBUTE)) return

  row.setAttribute(ROW_ATTRIBUTE, section)
  row.setAttribute('role', 'button')
  row.setAttribute('tabindex', '0')
  row.setAttribute('title', section === 'system' ? options.labels.systemHint : options.labels.toolsHint)

  /**
   * 打开详情窗口。
   * @param event 触发事件
   */
  const activate = (event: Event): void => {
    event.preventDefault()
    event.stopPropagation()
    options.open(section)
  }

  row.addEventListener('click', activate)
  row.addEventListener('keydown', (event) => {
    if (!(event instanceof KeyboardEvent)) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    activate(event)
  })
}

/**
 * 扫描当前打开的弹层，接管上下文构成的前两行。
 * @param options 安装参数
 */
function claimPanels(options: MeterRowOptions): void {
  for (const panel of document.querySelectorAll(PANEL_SELECTOR)) {
    const rows = findBreakdownRows(panel)
    if (rows === null) continue

    claimRow(rows[0], 'system', options)
    claimRow(rows[1], 'tools', options)
  }
}

/**
 * 安装上下文弹层的行接管。
 * @param options 文案与打开回调
 * @returns 清理函数：断开观察器并移除注入的样式
 */
export function installMeterRows(options: MeterRowOptions): () => void {
  if (typeof document === 'undefined') return () => undefined

  const style = document.createElement('style')
  style.setAttribute('data-dsh-plugin', 'dsh-all-in-one-context-inspect-rows')
  style.textContent = ROW_STYLE
  document.head.appendChild(style)

  let timer = 0
  let disposed = false

  /**
   * 合并同一批 DOM 变化里的扫描，避免每次插入都同步查询整棵文档。
   */
  const schedule = (): void => {
    if (timer !== 0) return

    timer = window.setTimeout(() => {
      timer = 0
      if (disposed) return

      claimPanels(options)
    }, 30)
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue
        // 只关心新出现的弹层：弹层由 portal 直接插到 body 下
        if (node.matches(PANEL_SELECTOR) || node.querySelector(PANEL_SELECTOR) !== null) {
          schedule()
          return
        }
      }
    }
  })

  observer.observe(document.body, { childList: true })

  // 插件加载时弹层可能已经打开（例如热重载），先补一次扫描
  claimPanels(options)

  return () => {
    disposed = true
    window.clearTimeout(timer)
    observer.disconnect()
    style.remove()

    // 行上的标记与监听器不再清理：宿主弹层关闭时这些节点整体被移除，
    // 而标记留着还能挡住热重载后的重复绑定（重复绑定会让一次点击打开两个窗口）
  }
}
