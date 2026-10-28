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
    // 把技能包设为新建会话默认选择的按钮
    setDefault: '设为默认',
    // 已是默认技能包的标识
    defaultBadge: '默认',
    // 设置默认技能包失败提示
    setDefaultFailed: '设置默认失败',
    // 保存按钮
    save: '保存',
    // 保存中的按钮文案
    saving: '保存中…',
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
    // 提示词增强字段标签
    systemPromptLabel: '提示词增强',
    // 提示词增强占位
    systemPromptPlaceholder: '例如：只审查代码，先指出潜在缺陷与测试缺口，修改文件前先询问。',
    // 技能分组标签
    skillsTitle: 'Skill 技能',
    // 插件分组标签
    pluginsTitle: '插件与工具',
    // MCP 分组标签
    mcpTitle: 'MCP 服务器',
    // 重试加载按钮
    retry: '重试',
    // 三态模式：全部
    modeAll: '全部',
    // 三态模式：仅应用
    modeInclude: '仅应用',
    // 三态模式：仅排除
    modeExclude: '仅排除',
    // 搜索技能占位
    searchSkills: '搜索技能',
    // 未找到技能
    noSkills: '没有匹配的技能。',
    // 已装插件标记
    installedBadge: '已安装插件',
    // 插件分组下的全局插件说明
    pluginsGlobalHint: '标记「已安装插件」的条目在宿主启动时就已加载：勾选表示保留在会话里，未勾选表示在该技能包的会话里屏蔽它的工具与提示词注入。',
    // 全局 MCP 组标记
    globalMcpBadge: '全局 MCP',
    // 全局 MCP 的工具数量说明；{count} 由界面替换成实际个数
    globalMcpTools: '已在宿主启动时连接，共 {count} 个工具；勾选保留在会话中，取消勾选按会话屏蔽。',
    // 宿主没有已连接的全局 MCP 时的提示
    mcpEmpty: '宿主当前没有已连接的 MCP 服务器。',
    // MCP 分组的说明：服务器在宿主配置文件里声明，此处只决定会话内是否屏蔽
    mcpGlobalHint: 'MCP 服务器在宿主的配置文件里声明、启动时连接：勾选表示保留在会话里，未勾选表示在该技能包的会话里屏蔽它的工具与提示词注入。',
    // 必填校验提示
    nameRequired: '请填写技能包名称。',
    // 存储位置说明
    storageHint: '配置文件位置',
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
    // Button that makes a pack the default choice for new sessions
    setDefault: 'Set as default',
    // Badge shown on the default pack
    defaultBadge: 'Default',
    // Failure when setting the default pack
    setDefaultFailed: 'Could not set default',
    // Save button
    save: 'Save',
    // Save-in-progress label
    saving: 'Saving…',
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
    // Prompt enhancement label
    systemPromptLabel: 'Prompt enhancement',
    // Prompt enhancement placeholder
    systemPromptPlaceholder: 'e.g. Only review code. Point out defects and test gaps, ask before editing files.',
    // Skills group label
    skillsTitle: 'Skills',
    // Plugins group label
    pluginsTitle: 'Plugins and tools',
    // MCP group label
    mcpTitle: 'MCP servers',
    // Retry loading button
    retry: 'Retry',
    // Rule mode: all
    modeAll: 'All',
    // Rule mode: include
    modeInclude: 'Only selected',
    // Rule mode: exclude
    modeExclude: 'All except selected',
    // Skill search placeholder
    searchSkills: 'Search skills',
    // No matching skills
    noSkills: 'No matching skills.',
    // Installed plugin badge
    installedBadge: 'Installed plugin',
    // Global plugin hint under the plugin group
    pluginsGlobalHint: 'Entries marked "Installed plugin" load at host startup: checked keeps them in the session, unchecked masks their tools and prompt injection inside this power pack session.',
    // Global MCP group badge
    globalMcpBadge: 'Global MCP',
    // Global MCP tool-count hint; {count} is replaced with the actual number
    globalMcpTools: 'Connected at host startup with {count} tools; keep it checked to retain it in this session, clear it to mask it per session.',
    // Empty hint when the host has no connected global MCP server
    mcpEmpty: 'The host has no connected MCP servers.',
    // MCP group hint: servers come from the host config file; this only masks them per session
    mcpGlobalHint: 'MCP servers are declared in the host config file and connect at startup: checked keeps one in the session, unchecked masks its tools and prompt injection inside this power pack session.',
    // Required name message
    nameRequired: 'Enter a power pack name.',
    // Storage location hint
    storageHint: 'Config file',
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
