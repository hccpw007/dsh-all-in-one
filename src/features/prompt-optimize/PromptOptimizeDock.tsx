/**
 * 输入行「提示词优化」按钮的挂载与状态同步。
 *
 * 宿主把本组件渲染在 `conversation.input.right` 插槽里，但用户要求按钮出现在
 * **发送按钮之后** —— 那一位置没有插槽可用。所以这里只借插槽拿到会话标识、
 * `useInput` 与 `inputActions`，再按 DOM 定位把真正的按钮插到发送按钮后面
 * （见 `dock-button.ts`）；React 这一层不渲染任何可见内容。
 *
 * 这样做的代价是按钮不在 React 树里，状态靠 `sync()` 单向写入；好处是位置完全
 * 由我们自己控制，且不影响宿主原有控件的排布。
 */
import { useEffect, useRef, useState } from 'react'

import type { InputStateApi, Translate } from '../../types/plugin'
import { requestOptimize } from './api'
import { mountDockButton, type DockButton, type DockView } from './dock-button'

/** 输入框状态缺省时的替身：返回空草稿与可编辑阶段，按钮据此禁用。 */
const EMPTY_STATE: InputStateApi = { draft: '', attachmentIds: [], phase: 'plain' }

/** 没有选择器时的兜底读取；返回兜底状态里的字段。 */
const useEmptyInput: UseInput = (selector) => selector(EMPTY_STATE)

/**
 * 插槽传给本组件的输入框操作面；只声明用到的两个动作。
 *
 * 宿主没有公开「聚焦输入框」的动作（`InputActions` 里只有 setDraft / persistDraft
 * 这类语法动作），因此这里不假设它存在：改写完只回写草稿。
 */
export interface PromptInputActions {
  /** 用一段纯文本替换整个草稿。 */
  setDraft(text: string): void
  /** 把当前草稿写进会话持久化。 */
  persistDraft(): void
}

/** 输入框选择器 hook 的形状，与宿主的 `SnapshotSelectorHook<InputState>` 一致。 */
export type UseInput = <S>(selector: (state: InputStateApi) => S) => S

/** 「提示词优化」挂载器收到的 props。 */
export interface PromptOptimizeDockProps {
  /** 当前会话标识；新会话尚未创建时缺省。 */
  sessionId?: string
  /** 输入框状态选择器；宿主未提供时按钮保持禁用。 */
  useInput?: UseInput
  /** 输入框操作面；宿主未提供时按钮保持禁用。 */
  inputActions?: PromptInputActions
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 在输入框上方给出提示；失败原因走这里，避免只靠悬停发现失败。 */
  notify?: (level: 'info' | 'error', text: string) => void
}

/**
 * 挂载按钮并把输入框状态同步过去。
 * @param props 会话标识、输入框操作面、翻译函数与提示回调
 */
export function PromptOptimizeDock({
  sessionId,
  useInput,
  inputActions,
  t,
  notify,
}: PromptOptimizeDockProps) {
  /** 挂载后的按钮操作面；宿主能力缺失时保持 undefined。 */
  const dockRef = useRef<DockButton | undefined>(undefined)
  // 请求进行中的本地标记：宿主输入框状态不变，只能自己记
  const [pending, setPending] = useState(false)

  // 切换会话时插槽会重新渲染，读到的是新会话的草稿与提交阶段。
  // 选择器 hook 只在宿主提供时存在，因此调用点必须无条件：缺省时用返回空草稿的替身，
  // 否则 hook 数量会随宿主能力变化，React 会直接抛错。
  const readInput = useInput ?? useEmptyInput
  const draft = readInput((state) => state.draft)
  const phase = readInput((state) => state.phase)

  // 没有原文、新会话未就绪、或正在提交时都不能优化：此时写草稿会被输入框忽略
  const empty = draft.trim() === ''
  const disabled = pending || sessionId === undefined || phase !== 'plain' || empty

  /** 悬停提示：先说明为什么不可用，再说明点击后的效果。 */
  const label = (() => {
    if (pending) return t('working')
    if (sessionId === undefined) return t('unavailable')
    if (phase !== 'plain') return t('busy')
    if (empty) return t('empty')

    return t('action')
  })()

  /** 点按钮：请求宿主改写，成功后整段回写输入框。 */
  const activate = (): void => {
    if (disabled || inputActions === undefined || sessionId === undefined) return

    setPending(true)

    void requestOptimize(draft, sessionId)
      .then((optimized) => {
        inputActions.setDraft(optimized)
        // 立即落盘：刷新或切换会话后，改写结果仍留在输入框里
        inputActions.persistDraft()
      })
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : String(error)

        console.error('[prompt-optimize] 优化失败:', error)
        notify?.('error', `${t('failed')}：${reason}`)
      })
      .finally(() => {
        setPending(false)
      })
  }

  // 宿主能力齐备时才挂载：没有输入框操作面时按钮点了也没用
  useEffect(() => {
    if (useInput === undefined || inputActions === undefined) return undefined

    const dock = mountDockButton()
    if (dock === undefined) return undefined

    dockRef.current = dock

    return () => {
      dockRef.current = undefined
      dock.dispose()
    }
    // 只在挂载能力变化时重建；会话切换不重建节点，靠下面的 sync 跟随
  }, [useInput !== undefined, inputActions !== undefined])

  // 每次状态变化都把最新值写进 DOM 按钮
  useEffect(() => {
    const view: DockView = { label, disabled, pending, onActivate: activate }
    dockRef.current?.sync(view)
  })

  // React 这一层不产生可见内容：按钮已经在发送按钮之后
  return null
}

export default PromptOptimizeDock
