import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { Button } from '../../components/Button'
import { PageActionsContext } from '../../shell/page-actions'
import type { Translate } from '../../types/plugin'
import { ResourceRuleField, type RuleOption } from './ResourceRuleField'
import type { PowerPack, PowerPackCatalog, ResourceRule } from './types'

/** 表单字段的统一样式。 */
const INPUT_CLASS =
  'w-full rounded-lg border border-line4 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

/** 分组之间的分隔线与间距：整页只用一张卡片，靠分隔线而不是区块标题分组。 */
const GROUP_CLASS = 'border-t border-line4 pt-4'

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
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 单个技能包的编辑表单。
 *
 * 编辑器只维护草稿，保存动作交给页面；保存前的必填校验在这里完成。
 * 保存按钮投放到外壳头部，与返回按钮同行。
 * @param props 草稿、清单与回调
 */
export function PackEditor({ initial, catalog, saving, error, onSave, t }: PackEditorProps) {
  const [draft, setDraft] = useState<PowerPack>(initial)
  const [localError, setLocalError] = useState<string | null>(null)
  const setPageActions = useContext(PageActionsContext)

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
  }))

  // MCP 服务器由宿主配置文件声明并在启动时连接，这里只列出已连接的服务器，
  // 勾选结果决定是否在本技能包的会话里屏蔽它们。
  // 宿主进程可能仍是未重载的旧版本，此时清单字段缺失，按「没有全局 MCP」处理。
  const globalMcpOptions: RuleOption[] = (catalog.globalGroups ?? [])
    .filter((group) => group.kind === 'global-mcp')
    .map((group) => ({
      id: group.id,
      label: group.label,
      description: t('globalMcpTools').replace('{count}', String(group.tools.length)),
      badge: t('globalMcpBadge'),
    }))

  // 三处规则编辑共用同一组模式文案，只取一次避免重复调用翻译函数
  const modeLabels = {
    all: t('modeAll'),
    include: t('modeInclude'),
    exclude: t('modeExclude'),
  }

  /** 保存前校验，返回错误文案或 undefined。 */
  const validate = useCallback((): string | undefined => {
    if (draft.name.trim() === '') return t('nameRequired')

    return undefined
  }, [draft, t])

  const handleSave = useCallback((): void => {
    const message = validate()
    if (message) {
      setLocalError(message)
      return
    }

    setLocalError(null)
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() })
  }, [draft, onSave, validate])

  /** 外壳头部的保存按钮；表单底部不再重复放置操作区。 */
  const saveAction = useMemo(
    () => (
      <Button variant="outline" disabled={saving} onClick={handleSave}>
        {/* 保存按钮文案，提交中显示进度 */}
        {saving ? t('saving') : t('save')}
      </Button>
    ),
    [handleSave, saving, t],
  )

  // 把保存按钮挂到外壳头部右侧；离开编辑器时撤回，避免残留到其他功能页
  useEffect(() => {
    if (!setPageActions) return

    setPageActions(saveAction)
    return () => setPageActions(null)
  }, [saveAction, setPageActions])

  return (
    <div className="rounded-xl border border-line4 bg-layer1">
      <div className="flex flex-col gap-4 p-4">
        <label className="block">
          {/* 技能包名称，显示在新建任务的技能包选择器中 */}
          <span className="mb-1 block text-[12px] font-semibold text-primary">{t('nameLabel')}</span>
          <input
            value={draft.name}
            placeholder={t('namePlaceholder')}
            onChange={(event) => patch({ name: event.target.value })}
            className={INPUT_CLASS}
          />
        </label>

        <label className="block">
          {/* 技能包描述，作为技能包列表里的一句话说明 */}
          <span className="mb-1 block text-[12px] font-semibold text-primary">{t('descriptionLabel')}</span>
          <input
            value={draft.description}
            placeholder={t('descriptionPlaceholder')}
            onChange={(event) => patch({ description: event.target.value })}
            className={INPUT_CLASS}
          />
        </label>

        <div className={GROUP_CLASS}>
          <ResourceRuleField
            title={t('skillsTitle')}
            rule={draft.skills}
            options={skillOptions}
            modeLabels={modeLabels}
            emptyText={t('noSkills')}
            searchPlaceholder={t('searchSkills')}
            onChange={(rule) => patchRule('skills', rule)}
          />
        </div>

        <div className={GROUP_CLASS}>
          <ResourceRuleField
            title={t('pluginsTitle')}
            rule={draft.plugins}
            options={pluginOptions}
            modeLabels={modeLabels}
            emptyText={t('noSkills')}
            onChange={(rule) => patchRule('plugins', rule)}
          />
          {/* 「仅应用」会隐式屏蔽未勾选的已装插件，这里说明全局条目的取舍方式 */}
          <p className="text-[12px] leading-[18px] text-secondary">{t('pluginsGlobalHint')}</p>
        </div>

        <div className={`flex flex-col gap-3 ${GROUP_CLASS}`}>
          {/* MCP 分组标签：只保留已安装服务器的取舍规则 */}
          <span className="text-[12px] font-semibold text-primary">{t('mcpTitle')}</span>
          <ResourceRuleField
            rule={draft.mcp}
            options={globalMcpOptions}
            modeLabels={modeLabels}
            emptyText={t('mcpEmpty')}
            onChange={(rule) => patchRule('mcp', rule)}
          />
          {/* 「仅排除」会按会话屏蔽未勾选的已安装 MCP，这里说明它的作用范围 */}
          <p className="text-[12px] leading-[18px] text-secondary">{t('mcpGlobalHint')}</p>
        </div>

        <label className={`block ${GROUP_CLASS}`}>
          {/* 插到系统提示词前部的增强要求；放在最后，作为整个技能包的收尾设置 */}
          <span className="mb-1 block text-[12px] font-semibold text-primary">{t('systemPromptLabel')}</span>
          <textarea
            value={draft.systemPrompt}
            placeholder={t('systemPromptPlaceholder')}
            onChange={(event) => patch({ systemPrompt: event.target.value })}
            rows={15}
            className={INPUT_CLASS}
          />
        </label>

        {/* 保存失败或校验失败的提示 */}
        {localError ?? error ? (
          <p className="text-[12px] leading-[18px] text-danger" role="alert">
            {localError ?? error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
