/**
 * 设置导航项的自定义图标。
 *
 * 宿主设置壳的导航图标由内置 id 映射，未知 id 回退到齿轮，`settings.section`
 * 插槽只投影 id / order / label，无法传图标。这里沿用 dshmarket 等插件的做法：
 * 按当前语言的导航标签认领本插件自己的那一行，隐藏宿主齿轮，用背景图绘制插件图标。
 *
 * 依赖宿主设置弹窗的 DOM 结构；结构变化时只是不再显示图标，不影响插件运行。
 */
import type { Translate } from '../types/plugin'

/** 标记本插件导航行的属性。 */
const NAV_ICON_MARKER = 'data-dsh-all-in-one-nav-icon'

/** 设置弹窗容器；只在它内部认领导航行。 */
const DIALOG_SELECTOR = '[role="dialog"]'

/** 导航行（相对弹窗）。 */
const NAV_ROW_SELECTOR = 'nav button'

/**
 * 合并 DOM 变化的防抖时间。
 *
 * 此前用 rAF 每帧执行一次全文档查询：流式输出时每秒数十次，而设置弹窗绝大多数
 * 时间并不存在。改成「只关心弹窗内的变化 + 200ms 防抖」，空闲时不再有任何查询。
 */
const SYNC_DEBOUNCE_MS = 200

/** 导航图标的显示尺寸，与宿主其他图标保持一致。 */
const NAV_ICON_SIZE = 16

/** 需要 effect 管理生命周期的客户端上下文。 */
interface NavIconContext {
  effect(callback: () => () => void, label?: string): void
}

/**
 * 判断一行导航是否属于本插件。
 * @param rowText 导航行当前可见文本
 * @param wantedLabel 本插件当前语言下的分区名
 */
function isOwnNavRow(rowText: string | null | undefined, wantedLabel: string): boolean {
  const wanted = wantedLabel.trim()
  if (!wanted) return false

  return (rowText ?? '').trim() === wanted
}

/**
 * 生成标记行的样式：隐藏宿主图标，用背景图绘制插件图标。
 * @param iconDataUrl 插件图标的 data URL
 */
function navIconCss(iconDataUrl: string): string {
  return [
    `[${NAV_ICON_MARKER}] > svg { display: none; }`,
    `[${NAV_ICON_MARKER}]::before {`,
    `  content: '';`,
    `  flex: none;`,
    `  width: ${NAV_ICON_SIZE}px;`,
    `  height: ${NAV_ICON_SIZE}px;`,
    `  background-image: url("${iconDataUrl}");`,
    `  background-repeat: no-repeat;`,
    `  background-position: center;`,
    `  background-size: ${NAV_ICON_SIZE}px ${NAV_ICON_SIZE}px;`,
    `}`,
  ].join('\n')
}

/**
 * 在设置导航中显示本插件图标。
 *
 * 设置弹窗后挂载、语言切换会重建导航行，因此用 MutationObserver 持续认领；
 * 标记与样式都通过 ctx.effect 随插件卸载清理。
 * @param ctx 客户端插件上下文，用于管理副作用
 * @param t 已绑定本插件命名空间的翻译函数
 * @param iconSvg 插件图标 SVG 原文
 */
export function installSettingsNavIcon(ctx: NavIconContext, t: Translate, iconSvg: string): void {
  if (typeof document === 'undefined') return

  ctx.effect(() => {
    const iconDataUrl = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`
    const style = document.createElement('style')
    style.setAttribute('data-dsh-plugin', 'dsh-all-in-one-nav-icon')
    style.textContent = navIconCss(iconDataUrl)
    document.head.appendChild(style)

    let disposed = false
    let timer = 0
    /** 当前设置弹窗；失联后重新查询，避免每次变化都全文档找一遍。 */
    let dialog: Element | null = null

    /** 取当前设置弹窗。 */
    const findDialog = (): Element | null => {
      if (dialog !== null && dialog.isConnected) return dialog
      dialog = document.querySelector(DIALOG_SELECTOR)

      return dialog
    }

    /**
     * 认领一个弹窗里的导航行。
     * @param root 弹窗容器
     * @param wantedLabel 本插件当前语言下的分区名
     * @returns 是否在该弹窗里找到了本插件的导航行
     */
    const markRows = (root: Element, wantedLabel: string): boolean => {
      let matched = false

      for (const row of root.querySelectorAll(NAV_ROW_SELECTOR)) {
        const own = isOwnNavRow(row.textContent, wantedLabel)
        if (own) matched = true

        if (!own) {
          if (row.hasAttribute(NAV_ICON_MARKER)) row.removeAttribute(NAV_ICON_MARKER)
          continue
        }

        // 只在状态变化时写属性：同样的值重复写也会触发样式重算
        if (!row.hasAttribute(NAV_ICON_MARKER)) row.setAttribute(NAV_ICON_MARKER, '')
      }

      return matched
    }

    // 每次导航行变化后重新认领：弹窗打开、语言切换都会重建这些按钮
    const sync = () => {
      timer = 0
      if (disposed) return

      const first = findDialog()
      if (first === null) return

      const wantedLabel = t('shell.navTitle')
      if (markRows(first, wantedLabel)) return

      // 页面可能同时开着别的弹窗（如 IDE 设置）：缓存的那个不一定装着设置导航，
      // 其余弹窗里只要有一行匹配就把它记为新的弹窗缓存
      const dialogs = document.querySelectorAll(DIALOG_SELECTOR)
      if (dialogs.length <= 1) return

      for (const candidate of dialogs) {
        if (candidate === first) continue
        if (!markRows(candidate, wantedLabel)) continue

        dialog = candidate

        return
      }
    }

    const schedule = () => {
      if (timer !== 0 || disposed) return
      timer = window.setTimeout(sync, SYNC_DEBOUNCE_MS)
    }

    /**
     * 只对「弹窗出现 / 弹窗内变化」调度。
     *
     * 宿主把设置弹窗挂在 body 顶层；流式输出新增的节点都在消息区内，没必要为它们
     * 逐个扫描子树。因此只有顶层节点（或弹窗本身）才做 querySelector。
     * @param records 本批 DOM 变化
     * @returns 需要重新认领时返回 true
     */
    const isRelevant = (records: MutationRecord[]): boolean => {
      const current = dialog !== null && dialog.isConnected ? dialog : null

      for (const record of records) {
        if (current !== null && current.contains(record.target)) return true

        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue
          if (node.matches(DIALOG_SELECTOR)) return true

          const topLevel = node.parentElement === document.body
          if (topLevel && node.querySelector(DIALOG_SELECTOR) !== null) return true
          if (current !== null && node.contains(current)) return true
        }
      }

      return false
    }

    sync()
    // 只观察节点增删：导航行是整体重建的，文本变化不属于本图标要跟随的时机
    const observer = new MutationObserver((records) => {
      if (isRelevant(records)) schedule()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      disposed = true
      observer.disconnect()
      if (timer !== 0) window.clearTimeout(timer)

      for (const row of document.querySelectorAll(`[${NAV_ICON_MARKER}]`)) {
        row.removeAttribute(NAV_ICON_MARKER)
      }

      style.remove()
    }
  }, 'dsh-all-in-one: settings nav icon')
}
