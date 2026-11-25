/**
 * 输入框右侧的「提示词优化」按钮。
 *
 * 宿主把它渲染在 `conversation.input.right` 插槽里，与模型选择器同排、在发送按钮
 * 之前。点击后把输入框里的草稿交给宿主侧的模型改写，再把结果整段写回输入框：
 * 用户接着在改写结果上自行增删，不直接发送，所以这一步永远只是「准备草稿」。
 *
 * 这个按钮不在插件的 `.dsh-aio-root` 容器内，样式只依赖宿主主题令牌与 Tailwind
 * 工具类，不套用设置页那套带根节点前缀的规则。
 */
import React, { useState } from 'react'

import { cn } from '../../common/cn'
import type { InputStateApi, Translate } from '../../types/plugin'
import { requestOptimize } from './api'

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

/** 「提示词优化」按钮收到的 props。 */
export interface PromptOptimizeButtonProps {
  /** 当前会话标识；新会话尚未创建时缺省。 */
  sessionId?: string
  /** 输入框状态选择器；宿主未提供时按钮保持禁用。 */
  useInput?: UseInput
  /** 输入框操作面；宿主未提供时按钮保持禁用。 */
  inputActions?: PromptInputActions
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 在输入框上方给出提示；错误原因也走这里，避免只靠悬停发现失败。 */
  notify?: (level: 'info' | 'error', text: string) => void
}

/** 图标：文字行 + 星芒，表达「把这句话改得更好」。 */
function OptimizeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5h7M2.5 8h5M2.5 11.5h3.5" />
      <path d="M11.8 3.2l.55 1.45L13.8 5.2l-1.45.55L11.8 7.2l-.55-1.45L9.8 5.2l1.45-.55z" />
      <path d="M12.6 9.6l.4 1.05 1.05.4-1.05.4-.4 1.05-.4-1.05-1.05-.4 1.05-.4z" />
    </svg>
  )
}

/** 按钮外壳：两种形态共用同一套尺寸与配色，避免禁用态跳动。 */
interface ShellProps {
  /** 悬停提示与可访问名称。 */
  label: string
  /** 是否禁用。 */
  disabled: boolean
  /** 是否正在请求。 */
  pending: boolean
  /** 点击处理。 */
  onClick?: () => void
  /** 图标内容。 */
  children: React.ReactNode
}

/**
 * 渲染按钮外壳。
 *
 * 宿主能力缺失、草稿为空、输入框正在提交时都落到禁用态，此时点击不产生任何动作。
 * @param props 标签、状态与图标
 */
function Shell({ label, disabled, pending, onClick, children }: ShellProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-busy={pending}
      title={label}
      disabled={disabled}
      // 与宿主发送按钮一致：按下时不抢走输入框焦点，避免草稿与光标位置跳动
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0',
        'text-secondary transition-colors',
        disabled ? 'opacity-50' : 'hover:bg-interactive hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        pending ? 'cursor-progress' : disabled ? 'cursor-default' : 'cursor-pointer',
      )}
    >
      {/* 图标：进行中转圈，其余时候是改写图标 */}
      {children}
    </button>
  )
}

/**
 * 渲染「提示词优化」按钮。
 *
 * 输入框能力齐备时才挂载真正读草稿的那个组件：选择器 hook 只在有宿主实现时
 * 才存在，放进同一个组件会让 hook 数量随宿主能力变化，React 会因此报错。
 * @param props 会话标识、输入框操作面、翻译函数与提示回调
 */
export function PromptOptimizeButton(props: PromptOptimizeButtonProps) {
  const { useInput, inputActions, t } = props

  if (useInput === undefined || inputActions === undefined) {
    return (
      <Shell label={t('unavailable')} disabled pending={false}>
        <OptimizeIcon />
      </Shell>
    )
  }

  return <LiveButton {...props} useInput={useInput} inputActions={inputActions} />
}

/**
 * 读得到输入框时渲染的按钮。
 * @param props 与外壳相同的 props，其中输入框能力已收窄为非空
 */
function LiveButton({
  sessionId,
  useInput,
  inputActions,
  t,
  notify,
}: PromptOptimizeButtonProps & { useInput: UseInput; inputActions: PromptInputActions }) {
  // 切换会话时插槽重新渲染，读到的是新会话的草稿与提交阶段
  const draft = useInput((state) => state.draft)
  const phase = useInput((state) => state.phase)
  // 请求进行中：期间禁用按钮，避免连点发出多次模型调用
  const [pending, setPending] = useState(false)

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
  const optimize = () => {
    if (disabled) return

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

  return (
    <Shell label={label} disabled={disabled} pending={pending} onClick={optimize}>
      {/* 进行中显示环形进度，让用户知道模型在跑 */}
      {pending ? (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="animate-spin">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.25" />
          <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <OptimizeIcon />
      )}
    </Shell>
  )
}
