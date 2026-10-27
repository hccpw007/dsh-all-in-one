import type { FeatureLocales } from '../../shell/registry'

/** 「技能包」的中英文文案；key 由外壳统一加 `power-pack.` 前缀。 */
export const powerPackLocales: FeatureLocales = {
  zh: {
    // 网格入口标题
    title: '技能包',
    // 网格入口描述
    description: '为不同任务准备不同的技能、插件与 MCP，新建对话时按技能包选择。',
    // 功能页标题
    pageTitle: '技能包',
    // 功能页说明
    pageDescription:
      '每个技能包是一套叠加在模式之上的技能与工具配置。保存后在新建任务的「技能包」下拉里选择，只对选择它的会话生效。',
    // 新建技能包按钮
    newPack: '新建技能包',
    // 空态提示
    empty: '还没有创建任何技能包。新建一个技能包，勾选它需要的技能与工具。',
    // 编辑按钮
    edit: '编辑',
    // 删除按钮
    delete: '删除',
    // 保存按钮
    save: '保存',
    // 保存中的按钮文案
    saving: '保存中…',
    // 取消按钮
    cancel: '取消',
    // MCP 服务器标识非法时的提示
    mcpIdInvalid: '标识只能包含字母、数字、下划线和短横线，长度 1–32。',
    // MCP 服务器标识重复时的提示
    mcpIdDuplicate: 'MCP 服务器标识不能重复。',
    // 删除确认提示
    confirmDelete: '删除后该技能包不再出现在新建任务的下拉列表中，确定删除？',
    // 加载失败提示
    loadFailed: '读取技能包配置失败',
    // 保存失败提示
    saveFailed: '保存失败',
    // 删除失败提示
    deleteFailed: '删除失败',
    // 名称字段标签
    nameLabel: '技能包名称',
    // 名称输入占位
    namePlaceholder: '例如：代码审查',
    // 描述字段标签
    descriptionLabel: '技能包描述',
    // 描述输入占位
    descriptionPlaceholder: '一句话说明这个技能包适合什么任务',
    // 系统提示词字段标签
    systemPromptLabel: '系统提示词',
    // 系统提示词说明
    systemPromptHint: '这段文字会追加到系统提示词末尾，用来约定该技能包的工作方式。',
    // 系统提示词占位
    systemPromptPlaceholder: '例如：只审查代码，先指出潜在缺陷与测试缺口，修改文件前先询问。',
    // 技能区块标题
    skillsTitle: '技能',
    // 技能区块说明
    skillsHint: '只对勾选的技能开放加载；未列出的技能不会出现在该技能包的技能目录里。',
    // 插件区块标题
    pluginsTitle: '插件与工具',
    // 插件区块说明
    pluginsHint: '在所选的模式之上筛选工具：勾选项由规则决定保留或剔除。',
    // MCP 区块标题
    mcpTitle: 'MCP 服务器',
    // MCP 区块说明
    mcpHint: '为技能包配置外部 MCP 服务；每个服务器会作为独立的客户端行挂载。',
    // MCP 服务器定义区块标题
    mcpServersTitle: '服务器定义',
    // MCP 启用规则区块标题
    mcpRuleTitle: '启用的服务器',
    // MCP 启用规则说明
    mcpRuleHint: '选择该技能包挂载哪些已定义的 MCP 服务器。',
    // 重试加载按钮
    retry: '重试',
    // 三态模式：全部
    modeAll: '全部',
    // 三态模式：仅引用
    modeInclude: '仅引用',
    // 三态模式：仅排除
    modeExclude: '仅排除',
    // 全部模式的说明
    modeAllHint: '使用全部可用项，不需要逐个勾选。',
    // 仅引用模式的说明
    modeIncludeHint: '只有勾选的项会被使用。',
    // 仅排除模式的说明
    modeExcludeHint: '除勾选项外全部使用。',
    // 搜索技能占位
    searchSkills: '搜索技能',
    // 未找到技能
    noSkills: '没有匹配的技能。',
    // 已装插件标记
    installedBadge: '已安装插件',
    // 已装插件风险提示
    installedWarning: '已安装插件可能已在 profile 中全局加载，重复挂载可能冲突，仅在必要时勾选。',
    // 添加 MCP 服务器按钮
    addMcp: '添加 MCP 服务器',
    // 尚未配置 MCP 时的提示
    mcpEmpty: '还没有配置 MCP 服务器。',
    // MCP 标识字段
    mcpIdLabel: '标识',
    // MCP 展示名字段
    mcpLabelLabel: '名称',
    // MCP 传输方式字段
    mcpTransportLabel: '传输方式',
    // stdio 传输选项
    mcpStdio: '命令（stdio）',
    // HTTP 传输选项
    mcpHttp: 'HTTP',
    // MCP 启动命令字段
    mcpCommandLabel: '命令',
    // MCP 命令参数说明
    mcpArgsLabel: '参数（每行一个）',
    // MCP 环境变量说明
    mcpEnvLabel: '环境变量（每行 KEY=VALUE）',
    // MCP 地址字段
    mcpUrlLabel: '地址',
    // MCP 请求头说明
    mcpHeadersLabel: '请求头（每行 KEY=VALUE）',
    // 移除 MCP 服务器按钮
    remove: '移除',
    // 保存成功提示
    saved: '已保存，新建任务时可在「技能包」下拉中选择。',
    // 必填校验提示
    nameRequired: '请填写技能包名称。',
    // 存储位置说明
    storageHint: '配置文件位置',
    // 预设选择提示
    presetHint:
      '技能包叠加在新建任务时所选的模式之上：模式提供基础工具，技能包再筛选技能与工具、追加 MCP 与系统提示词。',
    // 新会话选择器的模式下拉占位文案
    modeLabel: '模式',
    // 新会话选择器的技能包下拉占位文案
    seatLabel: '技能包',
    // 内置标准模式的显示名
    presetStandardName: '标准模式',
    // 内置 PTC 模式的显示名
    presetPtcName: 'PTC 模式',
    // 内置极简模式的显示名
    presetMinimalName: '极简模式',
    // 内置创造模式的显示名
    presetCordisName: '创造模式',
    // 内置标准模式的说明
    presetStandardDescription:
      '处理代码、文件和资料，适合大多数任务。Agent 会按需使用检索、编辑和终端等工具。',
    // 内置 PTC 模式的说明
    presetPtcDescription:
      '包含标准模式的所有能力，更适合批量调用工具，并对结果进行筛选、整理、去重、统计或汇总的任务。',
    // 内置极简模式的说明
    presetMinimalDescription:
      'Agent 使用终端和图片读取工具，并支持上下文压缩，适合测试和对比其基础表现。',
    // 内置创造模式的说明
    presetCordisDescription:
      '用对话定制 DSH：让 Agent 编写插件，添加新功能或界面；也能组合工具和提示词，创建自己的模式。',
    // 会话已开始后尝试切换技能包的提示
    seatSessionStarted: '会话已开始，无法再切换技能包。请在新建任务时选择。',
    // 技能包切换失败的提示前缀
    seatSelectFailed: '切换失败',
  },
  en: {
    // Grid entry title
    title: 'Power packs',
    // Grid entry description
    description: 'Prepare skills, plugins and MCP servers per task, then pick a power pack when starting a chat.',
    // Page title
    pageTitle: 'Power packs',
    // Page description
    pageDescription:
      'Each power pack layers on top of the mode chosen for a new task. Pick it from the Power pack dropdown when starting a task; it only applies to sessions that choose it.',
    // New power pack button
    newPack: 'New power pack',
    // Empty state
    empty: 'No power packs yet. Create one and choose the skills and tools it needs.',
    // Edit button
    edit: 'Edit',
    // Delete button
    delete: 'Delete',
    // Save button
    save: 'Save',
    // Save-in-progress label
    saving: 'Saving…',
    // Cancel button
    cancel: 'Cancel',
    // Invalid MCP server id
    mcpIdInvalid: 'ID may contain letters, digits, underscores and hyphens, 1–32 characters.',
    // Duplicate MCP server id
    mcpIdDuplicate: 'MCP server IDs must be unique.',
    // Delete confirmation
    confirmDelete: 'This power pack will no longer appear in the new-task dropdown. Delete it?',
    // Load failure
    loadFailed: 'Could not load power packs',
    // Save failure
    saveFailed: 'Could not save',
    // Delete failure
    deleteFailed: 'Could not delete',
    // Name field label
    nameLabel: 'Power pack name',
    // Name placeholder
    namePlaceholder: 'e.g. Code review',
    // Description field label
    descriptionLabel: 'Description',
    // Description placeholder
    descriptionPlaceholder: 'One sentence about when to use this power pack',
    // System prompt label
    systemPromptLabel: 'System prompt',
    // System prompt hint
    systemPromptHint: 'Appended to the end of the system prompt to define how this power pack works.',
    // System prompt placeholder
    systemPromptPlaceholder: 'e.g. Only review code. Point out defects and test gaps, ask before editing files.',
    // Skills section title
    skillsTitle: 'Skills',
    // Skills section hint
    skillsHint: 'Only selected skills can be loaded; unlisted ones are absent from this power pack.',
    // Plugins section title
    pluginsTitle: 'Plugins and tools',
    // Plugins section hint
    pluginsHint: 'Filter the tools of the chosen mode: each selection is kept or dropped by the rule.',
    // MCP section title
    mcpTitle: 'MCP servers',
    // MCP section hint
    mcpHint: 'Configure external MCP services; each server mounts as its own client row.',
    // MCP server definitions title
    mcpServersTitle: 'Server definitions',
    // MCP enabled-servers rule title
    mcpRuleTitle: 'Enabled servers',
    // MCP rule hint
    mcpRuleHint: 'Choose which defined MCP servers this power pack mounts.',
    // Retry loading button
    retry: 'Retry',
    // Rule mode: all
    modeAll: 'All',
    // Rule mode: include
    modeInclude: 'Only selected',
    // Rule mode: exclude
    modeExclude: 'All except selected',
    // All mode hint
    modeAllHint: 'Use everything available; no selection needed.',
    // Include mode hint
    modeIncludeHint: 'Only the selected items are used.',
    // Exclude mode hint
    modeExcludeHint: 'Everything except the selected items is used.',
    // Skill search placeholder
    searchSkills: 'Search skills',
    // No matching skills
    noSkills: 'No matching skills.',
    // Installed plugin badge
    installedBadge: 'Installed plugin',
    // Installed plugin warning
    installedWarning: 'Installed plugins may already load globally in the profile; mounting them again can conflict. Select only when needed.',
    // Add MCP server button
    addMcp: 'Add MCP server',
    // Empty MCP hint
    mcpEmpty: 'No MCP servers configured yet.',
    // MCP id field
    mcpIdLabel: 'ID',
    // MCP label field
    mcpLabelLabel: 'Name',
    // MCP transport field
    mcpTransportLabel: 'Transport',
    // stdio option
    mcpStdio: 'Command (stdio)',
    // HTTP option
    mcpHttp: 'HTTP',
    // MCP command field
    mcpCommandLabel: 'Command',
    // MCP args hint
    mcpArgsLabel: 'Arguments (one per line)',
    // MCP env hint
    mcpEnvLabel: 'Environment (KEY=VALUE per line)',
    // MCP URL field
    mcpUrlLabel: 'URL',
    // MCP headers hint
    mcpHeadersLabel: 'Headers (KEY=VALUE per line)',
    // Remove MCP server
    remove: 'Remove',
    // Saved notice
    saved: 'Saved. Pick this power pack from the Power pack dropdown when starting a new task.',
    // Required name message
    nameRequired: 'Enter a power pack name.',
    // Storage location hint
    storageHint: 'Config file',
    // Preset picker hint
    presetHint:
      'A power pack layers on top of the mode chosen for a new task: the mode supplies base tools, and the power pack filters skills and tools, then adds MCP servers and a system prompt.',
    // Placeholder for the mode dropdown
    modeLabel: 'Mode',
    // Placeholder for the power pack dropdown
    seatLabel: 'Power pack',
    // Display name for the built-in Standard mode
    presetStandardName: 'Standard mode',
    // Display name for the built-in PTC mode
    presetPtcName: 'PTC mode',
    // Display name for the built-in Minimal mode
    presetMinimalName: 'Minimal mode',
    // Display name for the built-in Creator mode
    presetCordisName: 'Creator mode',
    // Description for the built-in Standard mode
    presetStandardDescription:
      'Work with code, files, and information. Suitable for most tasks, with search, editing, terminal commands, and other tools available as needed.',
    // Description for the built-in PTC mode
    presetPtcDescription:
      'Includes all Standard mode capabilities. Better suited to tasks that call tools in batches and then filter, organize, deduplicate, count, or summarize the results.',
    // Description for the built-in Minimal mode
    presetMinimalDescription:
      'The agent uses a terminal and image reading, with context compaction. Useful for testing and comparing its basic performance.',
    // Description for the built-in Creator mode
    presetCordisDescription:
      'Customize DSH through conversation. Let the agent write plugins that add features or UI, or combine tools and prompts to create your own mode.',
    // Shown when trying to switch a session that already started
    seatSessionStarted: 'This session has started; a power pack can only be chosen for a new task.',
    // Prefix for a failed power pack switch
    seatSelectFailed: 'Could not switch',
  },
}
