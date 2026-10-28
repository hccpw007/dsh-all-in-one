/**
 * 「项目记忆」功能页面。
 *
 * 网格里的卡片负责开关，这个页面只配置记忆的落位：根目录决定记忆文件放在哪里，
 * 指向 `~/.claude/projects` 即可与 Claude Code 共用同一套记忆。页面同时展示
 * 「当前实际使用的目录」，避免用户填了路径却不知道生效的是哪一个（填错会回退默认）。
 */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Button } from '../../components/Button'
import { PageActionsContext } from '../../shell/page-actions'
import type { FeaturePageProps } from '../../shell/registry'
import { loadMemorySettings, saveMemorySettings } from './api'
import type { MemorySettingsPayload } from './types'

/** 表单字段样式，与技能包编辑器保持一致。 */
const INPUT_CLASS =
  'w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

/**
 * 判断输入的根目录是否可用：空表示默认目录，否则必须是绝对路径或 `~/` 开头。
 * @param value 输入值
 * @returns 可用时返回 true
 */
function isValidRoot(value: string): boolean {
  const trimmed = value.trim()

  return trimmed === '' || trimmed === '~' || trimmed.startsWith('/') || trimmed.startsWith('~/')
}

/**
 * 「项目记忆」页面：编辑记忆根目录并保存。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ProjectMemoryPage({ t }: FeaturePageProps) {
  // 当前设置；为 null 表示仍在读取
  const [payload, setPayload] = useState<MemorySettingsPayload | null>(null)
  // 输入框草稿，读取成功后与当前设置同步
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 保存成功提示；再次编辑时清掉，避免旧的成功状态误导
  const [saved, setSaved] = useState(false)
  // 外壳头部右侧的操作区投放口
  const setPageActions = useContext(PageActionsContext)

  useEffect(() => {
    let active = true

    // 页面可能在请求返回前关闭，此时不再写入状态
    void loadMemorySettings()
      .then((next) => {
        if (!active) return

        setPayload(next)
        setDraft(next.root)
      })
      .catch((failure: unknown) => {
        if (!active) return

        console.error('[project-memory] 读取设置失败:', failure)
        setError(`${t('loadFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [t])

  /** 保存草稿中的根目录；服务端会再校验一次并返回解析后的实际目录。 */
  const handleSave = useCallback(async (): Promise<void> => {
    if (saving) return

    const trimmed = draft.trim()
    if (!isValidRoot(trimmed)) {
      setError(t('pathInvalid'))
      setSaved(false)

      return
    }

    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const next = await saveMemorySettings({ root: trimmed })
      setPayload(next)
      setDraft(next.root)
      setSaved(true)
    } catch (failure) {
      console.error('[project-memory] 保存记忆路径失败:', failure)
      setError(failure instanceof Error ? failure.message : String(failure))
    } finally {
      setSaving(false)
    }
  }, [draft, saving, t])

  /** 外壳头部右上角的保存按钮；表单里不再重复放置。 */
  const saveAction = useMemo(
    () => (
      <Button variant="outline" disabled={loading || saving} onClick={() => void handleSave()}>
        {/* 保存按钮文案，提交中显示进度 */}
        {saving ? t('saving') : t('save')}
      </Button>
    ),
    [handleSave, loading, saving, t],
  )

  // 挂到外壳头部右侧；离开页面时撤回，避免残留
  useEffect(() => {
    if (!setPageActions) return

    setPageActions(saveAction)

    return () => setPageActions(null)
  }, [saveAction, setPageActions])

  return (
    <div>
      {/* 页面标题 */}
      <h2 className="text-[15px] font-semibold leading-6 text-primary">{t('pathTitle')}</h2>
      {/* 页面用途说明 */}
      <p className="mt-1.5 text-[12px] leading-[18px] text-secondary">{t('pathHint')}</p>
      {/* 根目录设置表单 */}
      <section className="mt-4 rounded-xl border border-line4 bg-layer1 p-4">
        <label className="block">
          {/* 记忆根目录输入框 */}
          <span className="mb-1 block text-[12px] font-semibold text-primary">{t('pathLabel')}</span>
          <input
            value={draft}
            placeholder={t('pathPlaceholder')}
            disabled={loading || saving}
            onChange={(event) => {
              setDraft(event.target.value)
              setSaved(false)
            }}
            className={INPUT_CLASS}
          />
        </label>
        {/* 恢复默认目录：清空输入框即可回落到插件默认路径；保存按钮在外壳头部 */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={loading || saving}
            onClick={() => {
              setDraft('')
              setSaved(false)
            }}
          >
            {t('reset')}
          </Button>
          {/* 保存结果提示：成功或失败都直接显示在表单旁 */}
          {saved ? (
            <span className="text-[12px] leading-[18px] text-secondary">{t('saved')}</span>
          ) : null}
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
      </section>
    </div>
  )
}
