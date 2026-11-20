/**
 * 「项目记忆」功能页面。
 *
 * 网格里的卡片负责开关，这个页面配置记忆的落位与写入行为：根目录决定记忆文件放在哪里，
 * 指向 `~/.claude/projects` 即可与 Claude Code 共用同一套记忆；「写入前先确认」决定助手
 * 自行发现关键信息时是否先征询用户。页面同时展示「当前实际使用的目录」，避免用户
 * 填了路径却不知道生效的是哪一个（填错会回退默认）。
 */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '../../common/cn'
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
 * 「项目记忆」页面：编辑记忆根目录并保存，切换「写入前先确认」开关。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ProjectMemoryPage({ t }: FeaturePageProps) {
  // 当前设置；为 null 表示仍在读取
  const [payload, setPayload] = useState<MemorySettingsPayload | null>(null)
  // 输入框草稿，读取成功后与当前设置同步
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // 「写入前先确认」的请求进行中；与路径保存互不阻塞
  const [savingAsk, setSavingAsk] = useState(false)
  // 开关切换失败的原因；成功后清掉，避免旧错误留在页面上
  const [askError, setAskError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // 保存成功提示；再次编辑时清掉，避免旧的成功状态误导
  const [saved, setSaved] = useState(false)
  // 外壳头部右侧的操作区投放口
  const setPageActions = useContext(PageActionsContext)
  // 保存按钮通过 ref 读取最新草稿与保存状态：让按钮节点的引用在输入时保持不变，
  // 避免每敲一个字符就「清空头部 → 重新投放」，导致按钮闪烁与整棵子树重渲染
  const draftRef = useRef(draft)
  const savingRef = useRef(saving)

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    savingRef.current = saving
  }, [saving])

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
    if (savingRef.current) return

    const trimmed = draftRef.current.trim()
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
  }, [t])

  /** 切换「写入前先确认」：点击立即写回宿主，下一次提示词装配即按新状态注入。 */
  const handleAskToggle = useCallback(async (): Promise<void> => {
    if (payload === null || savingAsk) return

    setSavingAsk(true)
    setAskError(null)

    try {
      const updated = await saveMemorySettings({ askBeforeSave: !payload.askBeforeSave })
      setPayload(updated)
    } catch (failure) {
      console.error('[project-memory] 保存写入前确认开关失败:', failure)
      setAskError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setSavingAsk(false)
    }
  }, [payload, savingAsk, t])

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

  // 开关的当前状态：设置未读到之前按关闭显示，避免短暂显示成开启又跳回
  const askEnabled = payload?.askBeforeSave === true

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
      {/* 写入行为区：控制助手自行发现关键信息时是否先询问 */}
      <section className="mt-4 rounded-xl border border-line4 bg-layer1 p-4">
        <div className="flex items-start gap-3">
          {/* 开关标题与用途说明 */}
          <div className="min-w-0 flex-1">
            {/* 开关标题 */}
            <p className="text-[12px] font-semibold leading-[18px] text-primary">{t('askLabel')}</p>
            {/* 开关用途说明：何时先询问、何时直接写入 */}
            <p className="mt-1 text-[12px] leading-[18px] text-secondary">{t('askHint')}</p>
          </div>
          {/* 切换开关：点击立即写回宿主设置，下一次对话按新状态注入 */}
          <button
            type="button"
            role="switch"
            aria-checked={askEnabled}
            aria-label={t('askLabel')}
            disabled={loading || savingAsk || payload === null}
            onClick={() => void handleAskToggle()}
            className={cn(
              'flex h-5 w-9 shrink-0 items-center aio-switch border-0 p-0 transition disabled:opacity-50',
              askEnabled ? 'bg-brand' : 'bg-line2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'h-4 w-4 aio-switch bg-base shadow transition-transform',
                askEnabled ? 'translate-x-[18px]' : 'translate-x-0.5',
              )}
            />
          </button>
        </div>
        {/* 切换失败提示：说明开关状态没有保存 */}
        {askError !== null ? (
          <p className="mt-2 text-[12px] leading-[18px] text-danger" role="alert">
            {askError}
          </p>
        ) : null}
      </section>
    </div>
  )
}
