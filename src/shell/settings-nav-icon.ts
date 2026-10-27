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

/** 设置弹窗中每个分区对应一个 nav 按钮。 */
const NAV_ROW_SELECTOR = '[role="dialog"] nav button'

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
    let scheduled = false

    // 每次导航行变化后重新认领：弹窗打开、语言切换都会重建这些按钮
    const sync = () => {
      scheduled = false
      if (disposed) return

      const wantedLabel = t('shell.navTitle')

      for (const row of document.querySelectorAll(NAV_ROW_SELECTOR)) {
        if (isOwnNavRow(row.textContent, wantedLabel)) {
          row.setAttribute(NAV_ICON_MARKER, '')
        } else {
          row.removeAttribute(NAV_ICON_MARKER)
        }
      }
    }

    // 合并一批 DOM 变化，并在下一次绘制前完成标记，避免先闪一下齿轮
    const schedule = () => {
      if (scheduled || disposed) return
      scheduled = true
      queueMicrotask(sync)
    }

    sync()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })

    return () => {
      disposed = true
      observer.disconnect()

      for (const row of document.querySelectorAll(`[${NAV_ICON_MARKER}]`)) {
        row.removeAttribute(NAV_ICON_MARKER)
      }

      style.remove()
    }
  }, 'dsh-all-in-one: settings nav icon')
}
