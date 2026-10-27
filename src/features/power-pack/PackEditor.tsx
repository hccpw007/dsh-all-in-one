import React, { useState } from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import { McpServerEditor, isValidServerId } from './McpServerEditor'
import { ResourceRuleField, type RuleOption } from './ResourceRuleField'
import type { PowerPack, PowerPackCatalog, ResourceRule } from './types'

/** 表单字段的统一样式。 */
const INPUT_CLASS =
  'w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

interface PackEditorProps {
  /** 编辑中的技能包草稿。 */
  initial: PowerPack
  /** 可勾选的技能与插件清单。 */
  catalog: PowerPackCatalog
  /** 保存请求进行中，禁用操作避免重复提交。 */
  saving: boolean
  /** 保存失败时的提示。 */
  error: string | null
  onSave(pack: PowerPack): void
  onCancel(): void
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 单个技能包的编辑表单。
 *
 * 编辑器只维护草稿，保存动作交给页面；保存前的必填与 MCP 标识校验在这里
 * 完成，避免宿主静默丢弃非法服务器条目。
 * @param props 草稿、清单与回调
 */
export function PackEditor({ initial, catalog, saving, error, onSave, onCancel, t }: PackEditorProps) {
  const [draft, setDraft] = useState<PowerPack>(initial)
  const [localError, setLocalError] = useState<string | null>(null)

  /** 更新草稿的顶层字段。 */
  const patch = (change: Partial<PowerPack>): void => {
    setDraft((current) => ({ ...current, ...change }))
  }

  /** 更新一类资源规则。 */
  const patchRule = (key: 'skills' | 'plugins' | 'mcp', rule: ResourceRule): void => {
    setDraft((current) => ({ ...current, [key]: rule }))
  }

  const skillOptions: RuleOption[] = catalog.skills.map((skill) => ({
    id: skill.name,
    label: skill.name,
    description: skill.description,
  }))

  const pluginOptions: RuleOption[] = catalog.plugins.map((plugin) => ({
    id: plugin.id,
    label: plugin.label,
    description: plugin.description,
    ...plugin.kind === 'installed' ? { badge: t('installedBadge') } : {},
    ...plugin.kind === 'installed' ? { warning: t('installedWarning') } : {},
  }))

  /** 保存前校验，返回错误文案或 undefined。 */
  const validate = (): string | undefined => {
    if (draft.name.trim() === '') return t('nameRequired')

    const ids = new Set<string>()
    for (const server of draft.mcpServers) {
      if (!isValidServerId(server.id)) return t('mcpIdInvalid')
      if (ids.has(server.id)) return t('mcpIdDuplicate')
      ids.add(server.id)
    }

    return undefined
  }

  const handleSave = (): void => {
    const message = validate()
    if (message) {
      setLocalError(message)
      return
    }

    setLocalError(null)
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 基础信息 */}
      <section className="rounded-xl border border-line1 bg-layer1">
        <div className="border-b border-line1 px-4 py-3">
          {/* 区块标题 */}
          <h3 className="text-[13px] font-medium text-primary">{t('title')}</h3>
          {/* 预设选择器说明 */}
          <p className="mt-1 text-[12px] leading-[18px] text-secondary">{t('presetHint')}</p>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <label className="block">
            {/* 技能包名称，显示在新建任务的预设选择器中 */}
            <span className="mb-1 block text-[12px] text-secondary">{t('nameLabel')}</span>
            <input
              value={draft.name}
              placeholder={t('namePlaceholder')}
              onChange={(event) => patch({ name: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            {/* 技能包描述，作为预设列表里的一句话说明 */}
            <span className="mb-1 block text-[12px] text-secondary">{t('descriptionLabel')}</span>
            <input
              value={draft.description}
              placeholder={t('descriptionPlaceholder')}
              onChange={(event) => patch({ description: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            {/* 追加到系统提示词末尾的技能包要求 */}
            <span className="mb-1 block text-[12px] text-secondary">{t('systemPromptLabel')}</span>
            <textarea
              value={draft.systemPrompt}
              placeholder={t('systemPromptPlaceholder')}
              onChange={(event) => patch({ systemPrompt: event.target.value })}
              rows={5}
              className={INPUT_CLASS}
            />
            {/* 系统提示词的并入方式 */}
            <span className="mt-1 block text-[12px] leading-[18px] text-secondary">
              {t('systemPromptHint')}
            </span>
          </label>
        </div>
      </section>

      <ResourceRuleField
        title={t('skillsTitle')}
        hint={t('skillsHint')}
        rule={draft.skills}
        options={skillOptions}
        modeLabels={{ all: t('modeAll'), include: t('modeInclude'), exclude: t('modeExclude') }}
        modeHint={
          draft.skills.mode === 'all'
            ? t('modeAllHint')
            : draft.skills.mode === 'include'
              ? t('modeIncludeHint')
              : t('modeExcludeHint')
        }
        emptyText={t('noSkills')}
        searchPlaceholder={t('searchSkills')}
        onChange={(rule) => patchRule('skills', rule)}
      />

      <ResourceRuleField
        title={t('pluginsTitle')}
        hint={t('pluginsHint')}
        rule={draft.plugins}
        options={pluginOptions}
        modeLabels={{ all: t('modeAll'), include: t('modeInclude'), exclude: t('modeExclude') }}
        modeHint={
          draft.plugins.mode === 'all'
            ? t('modeAllHint')
            : draft.plugins.mode === 'include'
              ? t('modeIncludeHint')
              : t('modeExcludeHint')
        }
        emptyText={t('noSkills')}
        onChange={(rule) => patchRule('plugins', rule)}
      />

      <McpServerEditor
        servers={draft.mcpServers}
        onChange={(mcpServers) => patch({ mcpServers })}
        t={t}
      />

      <ResourceRuleField
        title={t('mcpRuleTitle')}
        hint={t('mcpRuleHint')}
        rule={draft.mcp}
        options={draft.mcpServers.map((server) => ({
          id: server.id,
          label: server.label || server.id,
        }))}
        modeLabels={{ all: t('modeAll'), include: t('modeInclude'), exclude: t('modeExclude') }}
        modeHint={
          draft.mcp.mode === 'all'
            ? t('modeAllHint')
            : draft.mcp.mode === 'include'
              ? t('modeIncludeHint')
              : t('modeExcludeHint')
        }
        emptyText={t('mcpEmpty')}
        onChange={(rule) => patchRule('mcp', rule)}
      />

      {/* 保存失败或校验失败的提示 */}
      {localError ?? error ? (
        <p className="text-[12px] leading-[18px] text-danger" role="alert">
          {localError ?? error}
        </p>
      ) : null}

      {/* 表单操作 */}
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={saving} onClick={handleSave}>
          {saving ? t('saving') : t('save')}
        </Button>
        <Button variant="ghost" disabled={saving} onClick={onCancel}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  )
}
