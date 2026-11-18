/**
 * 删除当前会话并开启新会话的确认弹窗。
 *
 * 减号按钮只发起请求，弹窗挂在宿主的 `shell.overlay` 插槽里渲染。
 * 宿主没有「清空同一条会话历史」的能力，所以动作是：先开一条新的空白对话，
 * 再删除当前会话的本地记录。
 * 当前会话还在执行任务时不必让用户先手动停止：确认后会先中断那一轮，再清理记录。
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
  /** 由客户端扩展注入：开新对话并删除原对话。 */
  clear?: (target: ClearSessionTarget) => Promise<unknown>
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
  // 删除是否正在执行；执行期间两个按钮都禁用，避免重复提交
  const [pending, setPending] = useState(false)
  // 失败原因留在弹窗里，用户可重试或取消
  const [error, setError] = useState<string | null>(null)

  const readTarget = useTarget ?? useNoTarget
  const target = readTarget((value) => value)
  // 换了一个目标时清掉上一次的错误，避免把无关状态带进新弹窗
  const targetKey = target?.sessionId ?? ''

  useEffect(() => {
    setError(null)
  }, [targetKey])

  if (target === null) return null

  const close = () => {
    if (pending) return

    setError(null)
    settle?.()
  }

  const run = async () => {
    if (pending) return

    setPending(true)
    setError(null)

    try {
      await clear?.(target)
    } catch (failure) {
      console.error('[clear-session] 删除会话失败:', failure)
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
          {/*
            footer 内部是宿主的一行按钮容器（右对齐），这里撑满整行再分两端：
            取消留在左下角，删除收在右下角，避免误点
          */}
          <div className="flex w-full items-center justify-between">
            {/* 取消：关闭弹窗，不做任何改动 */}
            <Button variant="outline" disabled={pending} onClick={close}>
              {t('cancel')}
            </Button>
            {/* 删除并开启新会话：开新对话并删除当前会话的本地记录；默认焦点在这里，回车即确认 */}
            <Button variant="danger" data-modal-autofocus="" disabled={pending} onClick={() => void run()}>
              {pending ? t('processing') : t('confirmAction')}
            </Button>
          </div>
        </>
      }
    >
      {/* 删除范围说明：点明记录不可恢复 */}
      <p className="mt-3 text-[12px] leading-[18px] text-secondary">{t('deleteHint')}</p>

      {/* 当前会话仍在执行任务：说明确认后会先中断那一轮再删除 */}
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
