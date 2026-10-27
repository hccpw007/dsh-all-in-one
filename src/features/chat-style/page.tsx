import React, { useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { FeaturePageProps } from '../../shell/registry'
import { deleteChatStyle, loadChatStyles, saveChatStyle } from './api'
import { StyleEditor } from './StyleEditor'
import type { ChatStyle, ChatStylesPayload, RuleMode } from './types'
import type { Translate } from '../../types/plugin'

/**
 * 把规则模式转成界面文案。
 * @param mode 规则模式
 * @param t 已绑定本 feature 前缀的翻译函数
 * @returns 模式按钮同款文案
 */
function modeLabel(mode: RuleMode, t: Translate): string {
  if (mode === 'include') return t('modeInclude')
  if (mode === 'exclude') return t('modeExclude')

  return t('modeAll')
}

/** 新建风格时的空白草稿；默认全部可用，用户再按需收窄。 */
function createDraft(): ChatStyle {
  return {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    name: '',
    description: '',
    systemPrompt: '',
    skills: { mode: 'all', items: [] },
    plugins: { mode: 'all', items: [] },
    mcp: { mode: 'all', items: [] },
    mcpServers: [],
  }
}

/**
 * 「对话风格」页面：列出风格、进入编辑、保存与删除。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function ChatStylePage({ t }: FeaturePageProps) {
  const [payload, setPayload] = useState<ChatStylesPayload | null>(null)
  // 当前编辑中的草稿；为 null 时显示风格列表
  const [editing, setEditing] = useState<ChatStyle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  /** 拉取最新风格与清单。 */
  const reload = async (): Promise<void> => {
    try {
      setPayload(await loadChatStyles())
      setError(null)
    } catch (failure) {
      console.error('[chat-style] 加载风格失败:', failure)
      setError(`${t('loadFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setLoading(false)
    }
  }

  // 页面首次打开时读取配置；卸载后不再写入状态
  useEffect(() => {
    let active = true

    void (async () => {
      try {
        const next = await loadChatStyles()
        if (!active) return
        setPayload(next)
      } catch (failure) {
        console.error('[chat-style] 加载风格失败:', failure)
        if (active) {
          setError(
            `${t('loadFailed')}：${failure instanceof Error ? failure.message : String(failure)}`,
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [t])

  /** 保存草稿并刷新列表。 */
  const handleSave = async (style: ChatStyle): Promise<void> => {
    setSaving(true)
    try {
      setPayload(await saveChatStyle(style))
      setEditing(null)
      setError(null)
      setNotice(t('saved'))
    } catch (failure) {
      console.error('[chat-style] 保存风格失败:', failure)
      setError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setSaving(false)
    }
  }

  /** 删除风格，确认后调用宿主接口。 */
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(t('confirmDelete'))) return

    try {
      setPayload(await deleteChatStyle(id))
      setError(null)
      setNotice(null)
    } catch (failure) {
      console.error('[chat-style] 删除风格失败:', failure)
      setError(
        `${t('deleteFailed')}：${failure instanceof Error ? failure.message : String(failure)}`,
      )
    }
  }

  // 编辑态：显示表单，取消后回到列表
  if (editing && payload) {
    return (
      <div className="flex flex-col gap-4">
        <header>
          {/* 功能页标题 */}
          <h1 className="text-[17px] font-semibold leading-6 text-primary">{t('pageTitle')}</h1>
          {/* 功能页说明 */}
          <p className="mt-1.5 text-[13px] leading-5 text-secondary">{t('pageDescription')}</p>
        </header>

        <StyleEditor
          initial={editing}
          catalog={payload.catalog}
          saving={saving}
          error={error}
          onSave={(style) => void handleSave(style)}
          onCancel={() => {
            setEditing(null)
            setError(null)
          }}
          t={t}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {/* 功能页标题 */}
          <h1 className="text-[17px] font-semibold leading-6 text-primary">{t('pageTitle')}</h1>
          {/* 功能页说明 */}
          <p className="mt-1.5 text-[13px] leading-5 text-secondary">{t('pageDescription')}</p>
        </div>
        {/* 新建风格入口 */}
        <Button
          variant="outline"
          disabled={loading || !payload}
          onClick={() => {
            setNotice(null)
            setError(null)
            setEditing(createDraft())
          }}
        >
          {t('newStyle')}
        </Button>
      </header>

      {/* 操作结果提示 */}
      {notice ? (
        <p className="rounded-lg border border-line1 bg-layer1 px-3 py-2 text-[12px] text-success">
          {notice}
        </p>
      ) : null}

      {/* 加载或保存失败的提示 */}
      {error ? (
        <p className="rounded-lg border border-line1 bg-layer1 px-3 py-2 text-[12px] text-danger" role="alert">
          {error}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => void reload()}
          >
            {t('retry')}
          </button>
        </p>
      ) : null}

      {loading ? (
        // 首次加载中的占位
        <p className="text-[12px] text-secondary">…</p>
      ) : (payload?.styles.length ?? 0) === 0 ? (
        // 尚未创建风格时的空态
        <p className="rounded-xl border border-dashed border-line1 px-4 py-6 text-center text-[12px] text-secondary">
          {t('empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {payload?.styles.map((style) => (
            <li
              key={style.id}
              className="rounded-xl border border-line1 bg-layer1 px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  {/* 风格名称 */}
                  <h3 className="text-[13px] font-medium text-primary">{style.name}</h3>
                  {/* 风格描述 */}
                  {style.description ? (
                    <p className="mt-1 text-[12px] leading-[18px] text-secondary">
                      {style.description}
                    </p>
                  ) : null}
                  {/* 规则摘要：技能与 MCP 的启用范围 */}
                  <p className="mt-1 text-[12px] text-secondary">
                    {t('skillsTitle')}: {modeLabel(style.skills.mode, t)} · {t('pluginsTitle')}:{' '}
                    {modeLabel(style.plugins.mode, t)} · {t('mcpTitle')}: {style.mcpServers.length}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {/* 编辑该风格 */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotice(null)
                      setError(null)
                      setEditing(style)
                    }}
                  >
                    {t('edit')}
                  </Button>
                  {/* 删除该风格 */}
                  <Button variant="ghost" onClick={() => void handleDelete(style.id)}>
                    {t('delete')}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 配置文件位置，方便备份与排查 */}
      {payload ? (
        <p className="text-[12px] text-secondary">
          {t('storageHint')}: <code className="break-all">{payload.storagePath}</code>
        </p>
      ) : null}
    </div>
  )
}
