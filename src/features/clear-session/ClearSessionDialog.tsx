/**
 * 清空会话的确认弹窗。
 *
 * 输入框旁的按钮只发起请求，弹窗挂在宿主的 `shell.overlay` 插槽里渲染。
 * 宿主没有「清空同一条会话历史」的能力，所以两个动作都是先开一条新对话，
 * 区别只在于对原对话的处理：保留（原对话原样留在列表里）或删除（连同本地记录一起删掉）。
 * 原对话还在执行任务时不必让用户先手动停止：动作会先中断那一轮再继续。
 */
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import type { ClearSessionAction, ClearSessionTarget } from './types'

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
  /** 由客户端扩展注入：按所选动作开新对话并处理原对话。 */
  clear?: (target: ClearSessionTarget, action: ClearSessionAction) => Promise<unknown>
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
 * @param props 插槽注入的目标读取与动作入口
 */
export function ClearSessionDialog({ t, useTarget, clear, settle }: ClearSessionDialogProps) {
  // 正在执行的动作；非空时三个按钮都禁用，避免重复提交
  const [pending, setPending] = useState<ClearSessionAction | null>(null)
  // 失败原因留在弹窗里，用户可换一个动作或取消
  const [error, setError] = useState<string | null>(null)

  const readTarget = useTarget ?? useNoTarget
  const target = readTarget((value) => value)
  // 换了一个目标时清掉上一次的错误，避免把无关状态带进新弹窗
  const targetKey = target?.sessionId ?? ''

  useEffect(() => {
    setError(null)
  }, [targetKey])

  if (target === null) return null

  const busy = pending !== null

  const close = () => {
    if (busy) return

    setError(null)
    settle?.()
  }

  const run = async (action: ClearSessionAction) => {
    if (busy) return

    setPending(action)
    setError(null)

    try {
      await clear?.(target, action)
    } catch (failure) {
      console.error('[clear-session] 处理失败:', action, failure)
      setPending(null)
      setError(`${t('failed')}：${failure instanceof Error ? failure.message : String(failure)}`)
      return
    }

    setPending(null)
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
          {/* 取消：关闭弹窗，不做任何改动 */}
          <Button variant="outline" disabled={busy} onClick={close}>
            {t('cancel')}
          </Button>
          {/* 保留会话：开新对话，原对话原样不动；作为默认焦点，回车不会误删 */}
          <Button
            variant="outline"
            data-modal-autofocus=""
            disabled={busy}
            onClick={() => void run('keep')}
          >
            {pending === 'keep' ? t('processing') : t('keepAction')}
          </Button>
          {/* 删除会话：开新对话，并删除原对话的本地记录 */}
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => void run('delete')}
          >
            {pending === 'delete' ? t('processing') : t('deleteAction')}
          </Button>
        </>
      }
    >
      {/* 两个动作的结果差异：保留不动原对话，删除则不可恢复 */}
      <p className="mt-3 text-[12px] leading-[18px] text-secondary">{t('keepHint')}</p>
      <p className="mt-1 text-[12px] leading-[18px] text-secondary">{t('deleteHint')}</p>

      {/* 当前对话仍在执行任务：提示两个动作都会先中断那一轮，不必手动停止 */}
      {target.running ? (
        <p className="mt-2 text-[12px] leading-[18px] text-warn" role="alert">
          {t('runningHint')}
        </p>
      ) : null}

      {/* 失败提示：保留弹窗，用户可重试或取消 */}
      {error !== null ? (
        <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  )
}
