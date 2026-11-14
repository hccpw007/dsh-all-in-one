/**
 * 自动重建前的倒计时提示。
 *
 * 自动重建发生在「没人操作」之后，但用户可能正盯着屏幕；直接刷新会让人以为
 * 程序出错。这里给 5 秒可见倒计时与一个取消入口，取消后本次跳过并把空闲计时
 * 复位，等下一个检查点再说。
 *
 * 节点直接挂在 body 上而不是 React 树里：倒计时结束后页面就要重载，挂进 React
 * 反而要先等一次渲染提交，期间可能被宿主的更新覆盖。
 */
import type { Translate } from '../../types/plugin'

/** 倒计时秒数；太短来不及取消，太长又拖慢回收。 */
const COUNTDOWN_SECONDS = 5

/** 浮层层级：高于宿主弹窗，低于系统级提示。 */
const OVERLAY_Z_INDEX = '2147483000'

/** 倒计时结束后是否继续重建。 */
export type ConfirmResult = 'rebuild' | 'cancelled'

/**
 * 显示倒计时提示并等待结果。
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns `rebuild` 表示继续重建，`cancelled` 表示用户取消
 */
export function askRebuildConfirm(t: Translate): Promise<ConfirmResult> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.setAttribute('data-dsh-plugin', 'dsh-all-in-one-memory-guard')
    overlay.style.position = 'fixed'
    overlay.style.insetInline = '0'
    overlay.style.bottom = '24px'
    overlay.style.display = 'flex'
    overlay.style.justifyContent = 'center'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = OVERLAY_Z_INDEX

    const card = document.createElement('div')
    card.setAttribute('role', 'status')
    card.style.display = 'flex'
    card.style.alignItems = 'center'
    card.style.gap = '12px'
    card.style.padding = '8px 12px'
    card.style.borderRadius = '12px'
    card.style.border = '1px solid var(--dsw-alias-border-l4)'
    card.style.background = 'var(--dsw-alias-bg-overlay)'
    card.style.color = 'var(--dsw-alias-label-primary)'
    card.style.fontSize = '13px'
    card.style.lineHeight = '18px'
    card.style.pointerEvents = 'auto'

    const message = document.createElement('span')
    message.textContent = t('noticeCountdown').replace('{seconds}', String(COUNTDOWN_SECONDS))

    const cancel = document.createElement('button')
    cancel.type = 'button'
    cancel.textContent = t('noticeCancel')
    cancel.style.border = '1px solid var(--dsw-alias-border-l4)'
    cancel.style.borderRadius = '8px'
    cancel.style.padding = '2px 10px'
    cancel.style.background = 'transparent'
    cancel.style.color = 'var(--dsw-alias-brand-primary)'
    cancel.style.fontSize = '12px'
    cancel.style.cursor = 'pointer'

    card.append(message, cancel)
    overlay.append(card)
    document.body.append(overlay)

    let remaining = COUNTDOWN_SECONDS
    let settled = false

    /** 收尾：清定时器、移除节点，保证只 resolve 一次。 */
    const finish = (result: ConfirmResult): void => {
      if (settled) return
      settled = true
      window.clearInterval(timer)
      overlay.remove()
      resolve(result)
    }

    const timer = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        finish('rebuild')

        return
      }

      message.textContent = t('noticeCountdown').replace('{seconds}', String(remaining))
    }, 1000)

    cancel.addEventListener('click', () => finish('cancelled'))
  })
}
