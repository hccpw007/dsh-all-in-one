/**
 * 清空会话的确认弹窗。
 *
 * 输入框旁的按钮只发起请求，弹窗挂在宿主的 `shell.overlay` 插槽里渲染。
 * 宿主无法清空同一条会话的历史，清空等于换一条新对话，因此弹窗要把「旧对话
 * 是否保留」交给用户决定：勾选走归档（可从归档列表找回），不勾选则永久删除
 * 本地记录，两种结果的文案都在弹窗内说明。
 */
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import type { ClearSessionTarget } from './types'

/** 宿主插槽注入的快照 hook：按选择器读取待确认目标。 */
export type ClearTargetSelector = <T>(
  selector: (value: ClearSessionTarget | null) => T,
  isEqual?: (left: T, right: T) => boolean,
) => T

/** 弹窗收到的 props：t 由 feature 注入，其余来自插槽。 */
export interface ClearSessionDialogProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 由客户端扩展注入：读取当前待确认目标。 */
  useTarget?: ClearTargetSelector
  /** 由客户端扩展注入：执行清空。 */
  clear?: (target: ClearSessionTarget, keepSource: boolean) => Promise<unknown>
  /** 由客户端扩展注入：清空待确认目标。 */
  settle?: () => void
}

/**
 * 没有注入 hook 时的空实现，保证 Hook 调用顺序固定（始终返回「无目标」）。
 * 选择器泛型允许任意返回类型，这里需要显式断言成同一签名。
 */
const useNoTarget = (() => null) as unknown as ClearTargetSelector

/**
 * 确认弹窗：没有待确认目标时不渲染任何内容。
 * @param props 插槽注入的目标读取与清空动作
 */
export function ClearSessionDialog({ t, useTarget, clear, settle }: ClearSessionDialogProps) {
  // 是否保留旧对话；默认勾选，避免用户顺手确认就把记录删掉
  const [keepSource, setKeepSource] = useState(true)
  // 请求进行中禁用两个按钮，避免重复提交
  const [pending, setPending] = useState(false)
  // 失败原因留在弹窗里，用户可重试或取消
  const [error, setError] = useState<string | null>(null)

  const readTarget = useTarget ?? useNoTarget
  const target = readTarget((value) => value)
  // 换了一个目标时恢复默认选择并清掉上一次的错误，避免把无关状态带进新弹窗
  const targetKey = target?.sessionId ?? ''

  useEffect(() => {
    setKeepSource(true)
    setError(null)
  }, [targetKey])

  if (target === null) return null

  const close = () => {
    if (pending) return

    setError(null)
    settle?.()
  }

  const confirm = async () => {
    if (pending || target.running) return

    setPending(true)
    setError(null)

    try {
      await clear?.(target, keepSource)
    } catch (failure) {
      console.error('[clear-session] 清空会话失败:', failure)
      setPending(false)
      setError(`${t('failed')}：${failure instanceof Error ? failure.message : String(failure)}`)
      return
    }

    setPending(false)
    settle?.()
  }

  return (
    <Modal
      open
      onClose={close}
      closeLabel={t('cancel')}
      title={t('dialogTitle')}
      description={t('dialogMessage')}
      footer={
        <>
          <Button variant="outline" disabled={pending} onClick={close}>
            {t('cancel')}
          </Button>
          {/* data-modal-autofocus 让弹窗打开时把焦点交给确认按钮，回车即可执行 */}
          <Button
            variant="danger"
            data-modal-autofocus=""
            disabled={pending || target.running}
            onClick={() => void confirm()}
          >
            {pending ? t('clearing') : t('confirm')}
          </Button>
        </>
      }
    >
      {/* 旧对话的去向选择：勾选即归档可找回，不勾选即永久删除 */}
      <label className="mt-3 flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          className="mt-0.5 h-3.5 w-3.5 flex-none accent-[var(--dsw-alias-brand-primary)]"
          checked={keepSource}
          disabled={pending}
          onChange={(event) => setKeepSource(event.target.checked)}
        />
        <span className="text-[13px] font-medium leading-5 text-primary">{t('keepLabel')}</span>
      </label>

      {/* 随勾选状态切换的结果说明，让用户确认前就知道旧对话会不会被删掉 */}
      <p className="mt-1 pl-[22px] text-[12px] leading-[18px] text-secondary">
        {keepSource ? t('keepHint') : t('discardHint')}
      </p>

      {/* 当前对话仍在执行任务时不允许清空，提示用户先停止 */}
      {target.running ? (
        <p className="mt-2 pl-[22px] text-[12px] leading-[18px] text-warn" role="alert">
          {t('runningHint')}
        </p>
      ) : null}

      {/* 清空失败提示：保留弹窗，用户可重试或取消 */}
      {error !== null ? (
        <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  )
}
