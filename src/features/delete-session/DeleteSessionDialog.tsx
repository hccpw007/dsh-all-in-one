/**
 * 删除会话的确认弹窗。
 *
 * 会话行按钮只负责发起请求，弹窗挂在宿主的 `shell.overlay` 插槽里渲染：删除
 * 不可撤销，确认前不碰磁盘；失败时把宿主返回的原因留在弹窗内，用户可重试。
 */
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import type { DeleteConfirmRequest } from './confirm-store'

/** 宿主插槽注入的快照 hook：按选择器读取待确认请求。 */
export type DeleteConfirmSelector = <T>(
  selector: (value: DeleteConfirmRequest | null) => T,
  isEqual?: (left: T, right: T) => boolean,
) => T

/** 弹窗收到的 props：t 由 feature 注入，其余来自插槽。 */
export interface DeleteSessionDialogProps {
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
  /** 由客户端扩展注入：读取当前待确认请求。 */
  useRequest?: DeleteConfirmSelector
  /** 由客户端扩展注入：请求宿主删除会话并同步本地列表。 */
  deleteSession?: (sessionId: string) => Promise<void>
  /** 由客户端扩展注入：清空待确认请求。 */
  settle?: () => void
}

/**
 * 没有注入 hook 时的空实现，保证 Hook 调用顺序固定（始终返回「无请求」）。
 * 选择器泛型允许任意返回类型，这里需要显式断言成同一签名。
 */
const useNoRequest = (() => null) as unknown as DeleteConfirmSelector

/**
 * 确认弹窗：没有待确认请求时不渲染任何内容。
 * @param props 插槽注入的请求读取与删除动作
 */
export function DeleteSessionDialog({
  t,
  useRequest,
  deleteSession,
  settle,
}: DeleteSessionDialogProps) {
  // 请求进行中禁用两个按钮，避免重复提交
  const [pending, setPending] = useState(false)
  // 宿主拒绝删除时把原因留在弹窗里，而不是关掉弹窗只弹提示
  const [error, setError] = useState<string | null>(null)

  const readRequest = useRequest ?? useNoRequest
  const request = readRequest((value) => value)
  const activeSessionId = request?.sessionId

  // 换了一条会话时清掉上一条的失败原因，避免把无关的错误带到新弹窗里
  useEffect(() => {
    setError(null)
  }, [activeSessionId])

  if (request === null) return null

  const close = () => {
    if (pending) return

    setError(null)
    settle?.()
  }

  const confirm = async () => {
    if (pending) return

    setPending(true)
    setError(null)

    try {
      await deleteSession?.(request.sessionId)
    } catch (failure) {
      console.error('[delete-session] 删除会话失败:', failure)
      setPending(false)
      setError(failure instanceof Error ? failure.message : String(failure))
      return
    }

    setPending(false)
    settle?.()
  }

  return (
    <Modal
      open
      onClose={close}
      closeLabel={t('confirmCancel')}
      title={t('confirmTitle')}
      description={t('confirmTarget')}
      footer={
        <>
          <Button variant="outline" disabled={pending} onClick={close}>
            {t('confirmCancel')}
          </Button>
          <Button variant="danger" disabled={pending} onClick={() => void confirm()}>
            {pending ? t('deleting') : t('confirmDelete')}
          </Button>
        </>
      }
    >
      {/* 被删除的会话标题：让用户确认点的是哪一条 */}
      <p className="mt-1 text-[13px] font-medium leading-5 text-primary">{request.title}</p>
      {/* 删除范围说明：解释正文、标题缓存与列表记录都会被清掉且无法恢复 */}
      <p className="mt-3 text-[12px] leading-[18px] text-secondary">{t('confirmMessage')}</p>
      {/* 删除失败原因：宿主拒绝时保留弹窗，用户可重试或取消 */}
      {error !== null ? (
        <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
          {`${t('deleteFailed')}：${error}`}
        </p>
      ) : null}
    </Modal>
  )
}
