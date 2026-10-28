/**
 * 记忆根目录设置弹窗。
 *
 * 根目录决定记忆文件落在哪里：指向 `~/.claude/projects` 即可与 Claude Code
 * 共用同一套记忆。弹窗里同时展示「当前实际使用的目录」，避免用户填了路径却不知道
 * 生效的是哪一个（填错时会回退到默认目录）。
 */
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import { saveMemorySettings } from './api'
import type { MemorySettingsPayload } from './types'

/** 表单字段样式，与技能包编辑器保持一致。 */
const INPUT_CLASS =
  'w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

export interface MemoryPathDialogProps {
  /** 是否打开弹窗。 */
  open: boolean
  /** 当前设置；为 null 表示尚未读取完成。 */
  payload: MemorySettingsPayload | null
  /** 关闭弹窗。 */
  onClose(): void
  /** 保存成功后的新负载，交给卡片更新显示。 */
  onSaved(next: MemorySettingsPayload): void
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 记忆根目录弹窗：编辑路径、恢复默认并保存。
 * @param props 当前设置与回调
 */
export function MemoryPathDialog({ open, payload, onClose, onSaved, t }: MemoryPathDialogProps) {
  // 输入框草稿；打开弹窗时与当前设置同步
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setDraft(payload?.root ?? '')
    setError(null)
  }, [open, payload])

  const handleSave = async () => {
    if (saving) return

    const trimmed = draft.trim()
    // 与服务端同样的判定：空表示默认目录，否则必须是绝对路径或 ~/ 开头
    if (trimmed !== '' && !trimmed.startsWith('/') && !trimmed.startsWith('~/') && trimmed !== '~') {
      setError(t('pathInvalid'))
      return
    }

    setSaving(true)
    setError(null)

    try {
      const next = await saveMemorySettings({ root: trimmed })
      onSaved(next)
      onClose()
    } catch (failure) {
      console.error('[project-memory] 保存记忆路径失败:', failure)
      setError(failure instanceof Error ? failure.message : String(failure))
    } finally {
      setSaving(false)
    }
  }

  // 关闭时不渲染任何内容：不让遮罩与表单残留在网格里
  if (!open) return null

  return (
    <Modal
      open
      onClose={onClose}
      closeLabel={t('close')}
      title={t('pathTitle')}
      description={t('pathHint')}
      footer={
        <>
          <Button variant="outline" disabled={saving} onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="outline" disabled={saving} onClick={() => void handleSave()}>
            {saving ? t('saving') : t('save')}
          </Button>
        </>
      }
    >
      <label className="mt-1 block">
        {/* 记忆根目录输入框 */}
        <span className="mb-1 block text-[12px] font-semibold text-primary">{t('pathLabel')}</span>
        <input
          value={draft}
          placeholder={t('pathPlaceholder')}
          onChange={(event) => setDraft(event.target.value)}
          className={INPUT_CLASS}
        />
      </label>
      {/* 恢复默认目录：清空输入框即可回落到插件默认路径 */}
      <div className="mt-2">
        <Button variant="ghost" disabled={saving} onClick={() => setDraft('')}>
          {t('reset')}
        </Button>
      </div>
      {/* 当前实际生效的目录：填错时这里会显示回退后的默认目录 */}
      <dl className="mt-3 space-y-1 text-[12px] leading-[18px]">
        <div className="flex gap-2">
          <dt className="shrink-0 text-secondary">{t('effectivePath')}</dt>
          <dd className="min-w-0 break-all text-primary">{payload?.effectiveRoot || '—'}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-secondary">{t('defaultPath')}</dt>
          <dd className="min-w-0 break-all text-primary">{payload?.defaultRoot || '—'}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-secondary">{t('settingsFile')}</dt>
          <dd className="min-w-0 break-all text-primary">{payload?.settingsPath || '—'}</dd>
        </div>
      </dl>
      {/* 记忆文件名规则说明 */}
      <p className="mt-2 text-[12px] leading-[18px] text-secondary">{t('namingHint')}</p>
      {/* 保存失败或路径校验失败的提示 */}
      {error !== null ? (
        <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  )
}
