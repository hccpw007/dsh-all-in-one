/**
 * 删除会话的确认弹窗。
 *
 * 删除入口（会话行按钮、工作区「更多」菜单）只负责发起请求，弹窗挂在宿主的
 * `shell.overlay` 插槽里渲染：删除不可撤销，确认前不碰磁盘；失败时把宿主返回
 * 的原因留在弹窗内，用户可重试。
 *
 * 两种请求共用同一个弹窗：单条会话删除，以及工作区里所有非运行中会话的批量
 * 删除。批量删除部分失败时保留弹窗并给出失败条数，已删的会话已经从列表消失，
 * 用户关闭后重新打开菜单即可处理剩余会话。
 */
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import type { DeleteConfirmRequest } from './confirm-store'
import type { DeleteSessionsResponse } from './types'

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
  /** 由客户端扩展注入：请求宿主删除单条会话并同步本地列表。 */
  deleteSession?: (sessionId: string) => Promise<void>
  /** 由客户端扩展注入：批量删除工作区里的会话并同步本地列表。 */
  deleteWorkspaceSessions?: (
    workspaceId: string,
    sessionIds: string[],
  ) => Promise<DeleteSessionsResponse>
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
  deleteWorkspaceSessions,
  settle,
}: DeleteSessionDialogProps) {
  // 请求进行中禁用两个按钮，避免重复提交
  const [pending, setPending] = useState(false)
  // 删除失败或批量删除部分失败时把提示留在弹窗里，而不是关掉弹窗只弹通知
  const [error, setError] = useState<string | null>(null)

  const readRequest = useRequest ?? useNoRequest
  const request = readRequest((value) => value)
  // 换了一个删除目标时清掉上一次的失败原因，避免把无关的错误带到新弹窗里
  const requestKey = request === null ? '' : request.kind === 'session' ? request.sessionId : request.workspaceId

  useEffect(() => {
    setError(null)
  }, [requestKey])

  if (request === null) return null

  const isWorkspace = request.kind === 'workspace'

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
      // 工作区批量删除：有会话删不掉时保留弹窗，让用户知道还剩几条
      if (request.kind === 'workspace') {
        const report = await deleteWorkspaceSessions?.(request.workspaceId, request.sessionIds)
        if (report !== undefined && report.failed.length > 0) {
          setPending(false)
          setError(t('deleteAllPartial').replace('{count}', String(report.failed.length)))
          return
        }
      } else {
        await deleteSession?.(request.sessionId)
      }
    } catch (failure) {
      console.error('[delete-session] 删除会话失败:', failure)
      setPending(false)
      setError(`${t('deleteFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
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
      title={isWorkspace ? t('confirmAllTitle') : t('confirmTitle')}
      description={isWorkspace ? t('confirmAllTarget') : t('confirmTarget')}
      footer={
        <>
          <Button variant="outline" disabled={pending} onClick={close}>
            {t('confirmCancel')}
          </Button>
          {/* data-modal-autofocus 让宿主弹窗打开时把焦点交给删除按钮：
              回车即确认删除，而不是落在默认的第一个按钮（取消）上 */}
          <Button
            variant="danger"
            data-modal-autofocus=""
            disabled={pending}
            onClick={() => void confirm()}
          >
            {pending ? t('deleting') : t('confirmDelete')}
          </Button>
        </>
      }
    >
      {/* 删除目标：单条会话显示会话标题，批量删除显示工作区标题 */}
      <p className="mt-1 text-[13px] font-medium leading-5 text-primary">{request.title}</p>
      {/* 批量删除时显示本次会删掉多少条会话 */}
      {request.kind === 'workspace' ? (
        <p className="mt-1 text-[12px] leading-[18px] text-secondary">
          {t('confirmAllCount').replace('{count}', String(request.sessionIds.length))}
        </p>
      ) : null}
      {/* 删除范围说明：解释哪些本地记录会被清掉且无法恢复 */}
      <p className="mt-3 text-[12px] leading-[18px] text-secondary">
        {isWorkspace ? t('confirmAllMessage') : t('confirmMessage')}
      </p>
      {/* 删除失败或部分失败提示：保留弹窗，用户可重试或取消 */}
      {error !== null ? (
        <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  )
}
