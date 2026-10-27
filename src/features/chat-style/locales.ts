import type { FeatureLocales } from '../../shell/registry'

/** 「对话风格」的中英文文案；key 由外壳统一加 `chat-style.` 前缀。 */
export const chatStyleLocales: FeatureLocales = {
  zh: {
    // 网格入口标题
    title: '对话风格',
    // 网格入口描述
    description: '为不同任务准备不同的技能、插件与 MCP，新建对话时按风格选择。',
    // 功能页标题
    pageTitle: '对话风格',
    // 功能页说明
    pageDescription:
      '每个风格是一套独立的 Agent 组合。保存后会出现在新建任务的预设选择器中，只对选择它的会话生效。',
    // 新建风格按钮
    newStyle: '新建风格',
    // 空态提示
    empty: '还没有创建任何风格。新建一个风格，勾选它需要的技能与工具。',
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
    confirmDelete: '删除后该风格不再出现在新建任务的预设列表中，确定删除？',
    // 加载失败提示
    loadFailed: '读取风格配置失败',
    // 保存失败提示
    saveFailed: '保存失败',
    // 删除失败提示
    deleteFailed: '删除失败',
    // 名称字段标签
    nameLabel: '风格名称',
    // 名称输入占位
    namePlaceholder: '例如：代码审查',
    // 描述字段标签
    descriptionLabel: '风格描述',
    // 描述输入占位
    descriptionPlaceholder: '一句话说明这个风格适合什么任务',
    // 系统提示词字段标签
    systemPromptLabel: '系统提示词',
    // 系统提示词说明
    systemPromptHint: '这段文字会追加到系统提示词末尾，用来约定该风格的工作方式。',
    // 系统提示词占位
    systemPromptPlaceholder: '例如：只审查代码，先指出潜在缺陷与测试缺口，修改文件前先询问。',
    // 技能区块标题
    skillsTitle: '技能',
    // 技能区块说明
    skillsHint: '只对勾选的技能开放加载；未列出的技能不会出现在该风格的技能目录里。',
    // 插件区块标题
    pluginsTitle: '插件与工具',
    // 插件区块说明
    pluginsHint: '从零组装 Agent：不勾选任何项时，该风格只有对话能力。',
    // MCP 区块标题
    mcpTitle: 'MCP 服务器',
    // MCP 区块说明
    mcpHint: '为风格配置外部 MCP 服务；每个服务器会作为独立的客户端行挂载。',
    // MCP 服务器定义区块标题
    mcpServersTitle: '服务器定义',
    // MCP 启用规则区块标题
    mcpRuleTitle: '启用的服务器',
    // MCP 启用规则说明
    mcpRuleHint: '选择该风格挂载哪些已定义的 MCP 服务器。',
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
    saved: '已保存，新建任务时可在预设列表中选择该风格。',
    // 必填校验提示
    nameRequired: '请填写风格名称。',
    // 存储位置说明
    storageHint: '配置文件位置',
    // 预设选择提示
    presetHint:
      '风格以 Agent 预设的形式注册。新建任务时在「标准模式」旁的预设选择器里选择它。',
  },
  en: {
    // Grid entry title
    title: 'Chat styles',
    // Grid entry description
    description: 'Prepare different skills, plugins and MCP servers per task, then pick a style when starting a chat.',
    // Page title
    pageTitle: 'Chat styles',
    // Page description
    pageDescription:
      'Each style is a standalone agent composition. Once saved it appears in the preset picker for new tasks and only applies to sessions that choose it.',
    // New style button
    newStyle: 'New style',
    // Empty state
    empty: 'No styles yet. Create one and choose the skills and tools it needs.',
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
    confirmDelete: 'This style will no longer appear in the preset picker. Delete it?',
    // Load failure
    loadFailed: 'Could not load styles',
    // Save failure
    saveFailed: 'Could not save',
    // Delete failure
    deleteFailed: 'Could not delete',
    // Name field label
    nameLabel: 'Style name',
    // Name placeholder
    namePlaceholder: 'e.g. Code review',
    // Description field label
    descriptionLabel: 'Description',
    // Description placeholder
    descriptionPlaceholder: 'One sentence about when to use this style',
    // System prompt label
    systemPromptLabel: 'System prompt',
    // System prompt hint
    systemPromptHint: 'Appended to the end of the system prompt to define how this style works.',
    // System prompt placeholder
    systemPromptPlaceholder: 'e.g. Only review code. Point out defects and test gaps, ask before editing files.',
    // Skills section title
    skillsTitle: 'Skills',
    // Skills section hint
    skillsHint: 'Only selected skills can be loaded; unlisted ones are absent from this style.',
    // Plugins section title
    pluginsTitle: 'Plugins and tools',
    // Plugins section hint
    pluginsHint: 'Assemble the agent from scratch: with nothing selected the style can only chat.',
    // MCP section title
    mcpTitle: 'MCP servers',
    // MCP section hint
    mcpHint: 'Configure external MCP services; each server mounts as its own client row.',
    // MCP server definitions title
    mcpServersTitle: 'Server definitions',
    // MCP enabled-servers rule title
    mcpRuleTitle: 'Enabled servers',
    // MCP rule hint
    mcpRuleHint: 'Choose which defined MCP servers this style mounts.',
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
    saved: 'Saved. Pick this style from the preset list when starting a new task.',
    // Required name message
    nameRequired: 'Enter a style name.',
    // Storage location hint
    storageHint: 'Config file',
    // Preset picker hint
    presetHint:
      'Styles register as agent presets. Choose one in the preset picker next to Standard mode when starting a new task.',
  },
}
