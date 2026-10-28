import React, { useCallback, useEffect, useState } from 'react'

import { Button } from '../../components/Button'
import type { FeaturePageProps } from '../../shell/registry'
import { deletePowerPack, loadPowerPacks, savePowerPack, setDefaultPowerPack } from './api'
import { PackEditor } from './PackEditor'
import type { PowerPack, PowerPacksPayload, RuleMode } from './types'
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

/** 新建技能包时的空白草稿；默认全部可用，用户再按需收窄。 */
function createDraft(): PowerPack {
  return {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    name: '',
    description: '',
    systemPrompt: '',
    skills: { mode: 'all', items: [] },
    plugins: { mode: 'all', items: [] },
    mcp: { mode: 'all', items: [] },
  }
}

/**
 * 「技能包」页面：列出技能包、进入编辑、保存与删除。
 * @param props t 已绑定本 feature 的 key 前缀
 */
export function PowerPackPage({ t }: FeaturePageProps) {
  const [payload, setPayload] = useState<PowerPacksPayload | null>(null)
  // 当前编辑中的草稿；为 null 时显示技能包列表
  const [editing, setEditing] = useState<PowerPack | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // 设置默认技能包的请求进行中，避免重复点击
  const [defaulting, setDefaulting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** 拉取最新技能包与清单。 */
  const reload = async (): Promise<void> => {
    try {
      setPayload(await loadPowerPacks())
      setError(null)
    } catch (failure) {
      console.error('[power-pack] 加载技能包失败:', failure)
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
        const next = await loadPowerPacks()
        if (!active) return
        setPayload(next)
      } catch (failure) {
        console.error('[power-pack] 加载技能包失败:', failure)
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

  /**
   * 保存草稿并刷新列表。
   *
   * 必须保持引用稳定：编辑器据此创建的保存按钮会写回外壳头部状态，
   * 每次渲染换新函数会触发重复投放。
   */
  const handleSave = useCallback(async (pack: PowerPack): Promise<void> => {
    setSaving(true)
    try {
      setPayload(await savePowerPack(pack))
      setEditing(null)
      setError(null)
    } catch (failure) {
      console.error('[power-pack] 保存技能包失败:', failure)
      setError(`${t('saveFailed')}：${failure instanceof Error ? failure.message : String(failure)}`)
    } finally {
      setSaving(false)
    }
  }, [t])

  /** 编辑器回调要求同步签名，异步保存结果由 handleSave 自己处理错误。 */
  const submitDraft = useCallback((pack: PowerPack): void => {
    void handleSave(pack)
  }, [handleSave])

  /** 删除技能包，确认后调用宿主接口。 */
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(t('confirmDelete'))) return

    try {
      setPayload(await deletePowerPack(id))
      setError(null)
    } catch (failure) {
      console.error('[power-pack] 删除技能包失败:', failure)
      setError(
        `${t('deleteFailed')}：${failure instanceof Error ? failure.message : String(failure)}`,
      )
    }
  }

  /** 把某个技能包设为新建会话的默认选择。 */
  const handleSetDefault = async (id: string): Promise<void> => {
    setDefaulting(true)
    try {
      setPayload(await setDefaultPowerPack(id))
      setError(null)
    } catch (failure) {
      console.error('[power-pack] 设置默认技能包失败:', failure)
      setError(
        `${t('setDefaultFailed')}：${failure instanceof Error ? failure.message : String(failure)}`,
      )
    } finally {
      setDefaulting(false)
    }
  }

  // 编辑态：显示表单，保存成功后回到列表；离开本页由外壳的返回按钮负责
  if (editing && payload) {
    return (
      <div className="flex flex-col gap-4">
        <header>
          {/* 功能页标题 */}
          <h1 className="text-[17px] font-semibold leading-6 text-primary">{t('pageTitle')}</h1>
          {/* 功能页说明 */}
          <p className="mt-1.5 text-[13px] leading-5 text-secondary">{t('pageDescription')}</p>
        </header>

        <PackEditor
          initial={editing}
          catalog={payload.catalog}
          saving={saving}
          error={error}
          onSave={submitDraft}
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
        {/* 新建技能包入口 */}
        <Button
          variant="outline"
          disabled={loading || !payload}
          onClick={() => {
            setError(null)
            setEditing(createDraft())
          }}
        >
          {t('newPack')}
        </Button>
      </header>

      {/* 加载或保存失败的提示 */}
      {error ? (
        <p className="rounded-lg border border-line4 bg-layer1 px-3 py-2 text-[12px] text-danger" role="alert">
          {error}
          {/* 重新加载列表 */}
          <button
            type="button"
            className="ml-2 cursor-pointer border-0 bg-transparent p-0 text-[12px] underline"
            onClick={() => void reload()}
          >
            {t('retry')}
          </button>
        </p>
      ) : null}

      {loading ? (
        // 首次加载中的占位
        <p className="text-[12px] text-secondary">…</p>
      ) : (payload?.packs.length ?? 0) === 0 ? (
        // 尚未创建技能包时的空态
        <p className="rounded-xl border border-dashed border-line4 px-4 py-6 text-center text-[12px] text-secondary">
          {t('empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {payload?.packs.map((pack) => (
            <li
              key={pack.id}
              className="rounded-xl border border-line4 bg-layer1 px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  {/* 技能包名称 */}
                  <h3 className="text-[13px] font-medium text-primary">{pack.name}</h3>
                  {/* 技能包描述 */}
                  {pack.description ? (
                    <p className="mt-1 text-[12px] leading-[18px] text-secondary">
                      {pack.description}
                    </p>
                  ) : null}
                  {/* 规则摘要：技能、插件与已安装 MCP 的启用范围 */}
                  <p className="mt-1 text-[12px] text-secondary">
                    {t('skillsTitle')}: {modeLabel(pack.skills.mode, t)} · {t('pluginsTitle')}:{' '}
                    {modeLabel(pack.plugins.mode, t)} · {t('mcpTitle')}:{' '}
                    {modeLabel(pack.mcp.mode, t)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {/* 默认技能包：已是默认只显示标识，否则提供设置入口 */}
                  {payload?.defaultPackId === pack.id ? (
                    // 默认技能包标识：绿色描边与打钩，和可点击的「设为默认」按钮区分开
                    <span className="inline-flex items-center gap-1 rounded-lg border border-success px-3 py-1.5 text-[12px] text-success">
                      {/* 打钩图标，表示该技能包已设为默认 */}
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {t('defaultBadge')}
                    </span>
                  ) : (
                    // 设为默认按钮：新建会话时自动预选该技能包
                    <Button
                      variant="outline"
                      disabled={defaulting}
                      onClick={() => void handleSetDefault(pack.id)}
                    >
                      {t('setDefault')}
                    </Button>
                  )}
                  {/* 编辑该技能包 */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      setEditing(pack)
                    }}
                  >
                    {t('edit')}
                  </Button>
                  {/* 删除该技能包 */}
                  <Button variant="danger" onClick={() => void handleDelete(pack.id)}>
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
