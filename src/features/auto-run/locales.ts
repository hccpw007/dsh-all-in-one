import type { FeatureLocales } from '../../shell/registry'

/** 「全自动执行」的中英文文案；key 由外壳统一加 `auto-run.` 前缀。 */
export const autoRunLocales: FeatureLocales = {
  zh: {
    // 设置页开关标题
    title: '全自动执行',
    // 设置页开关用途说明：点明入口位置与会话级语义，控制在两行以内
    description: '输入框右侧新增「全自动」开关：打开后不提问、不等确认，改完自行验证。',
    // 设置页开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 默认值选项读取失败时的提示
    loadFailed: '读取默认值失败，请刷新页面重试。',
    // 默认值选项组的无障碍名称（选项标签不显示，避免挤占窄卡片宽度）
    modeGroupLabel: '新对话默认状态',
    // 默认值选项：新对话一律关闭全自动
    modeOff: '默认关',
    // 默认值选项：新对话一律开启全自动
    modeOn: '默认开',
    // 默认值选项：新对话沿用最近一次的全自动状态
    modeLast: '上一次',
    // 默认值选项：新对话沿用所属工作空间最近一次的状态
    modeWorkspace: '工作空间',
    // 「默认关」的悬停说明
    modeOffHint: '新对话默认关闭全自动',
    // 「默认开」的悬停说明
    modeOnHint: '新对话默认开启全自动',
    // 「上一次」的悬停说明
    modeLastHint: '新对话沿用最近一次切换后的状态',
    // 「工作空间」的悬停说明
    modeWorkspaceHint: '新对话沿用所属工作空间最近一次的状态',
    // 输入框按钮的名称与无障碍标签
    action: '全自动',
    // 开启状态下的悬停提示：说明模型不会再来问
    hintOn: '全自动已开启：本对话不向你提问，也不在结尾等待你选择',
    // 关闭状态下的悬停提示：说明打开后的效果
    hintOff: '点击开启全自动：本对话不提问、不等待确认，改完自行验证',
    // 状态尚未从宿主读取回来时的悬停提示
    loading: '正在读取全自动状态…',
    // 会话尚未创建、按钮无法切换时的悬停提示
    unavailable: '会话未就绪，暂时不能切换',
    // 切换失败时的悬停提示前缀，后面拼接宿主返回的原因
    toggleFailed: '切换全自动失败',
  },
  en: {
    // Switch title
    title: 'Full auto',
    // Switch description: entry position and per-conversation semantics, kept within two lines
    description: 'Adds a Full auto switch in the composer: no questions, no waits, self-verified changes.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Saving the switch state failed. Check the browser storage permission.',
    // Shown when the default options cannot be read
    loadFailed: 'Reading the default state failed. Reload the page and try again.',
    // Accessible name of the default state group (its label is hidden to save width)
    modeGroupLabel: 'Default state for new conversations',
    // Default option: new conversations always start with full auto off
    modeOff: 'Off',
    // Default option: new conversations always start with full auto on
    modeOn: 'On',
    // Default option: new conversations reuse the most recent state
    modeLast: 'Previous',
    // Default option: new conversations reuse their workspace's most recent state
    modeWorkspace: 'Workspace',
    // Hover hint for the "Off" option
    modeOffHint: 'New conversations start with full auto off',
    // Hover hint for the "On" option
    modeOnHint: 'New conversations start with full auto on',
    // Hover hint for the "Previous" option
    modeLastHint: 'New conversations reuse the most recently switched state',
    // Hover hint for the "Workspace" option
    modeWorkspaceHint: 'New conversations reuse their workspace’s most recent state',
    // Composer button label and accessible name
    action: 'Full auto',
    // Tooltip while enabled: the model will not come back with questions
    hintOn: 'Full auto is on: this conversation never asks you questions or waits for a choice',
    // Tooltip while disabled: effect of turning it on
    hintOff: 'Turn on full auto: no questions, no confirmation waits, self-verified changes',
    // Tooltip while the host state is still loading
    loading: 'Reading the full auto state…',
    // Tooltip when no conversation exists yet
    unavailable: 'The conversation is not ready; cannot switch yet',
    // Failure tooltip prefix followed by the host error message
    toggleFailed: 'Switching full auto failed',
  },
}
