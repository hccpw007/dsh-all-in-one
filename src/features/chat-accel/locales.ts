import type { FeatureLocales } from '../../shell/registry'

/** 「对话加速」的中英文文案；key 由外壳统一加 `chat-accel.` 前缀。 */
export const chatAccelLocales: FeatureLocales = {
  zh: {
    // 网格入口标题
    title: '对话加速',
    // 网格入口描述：说明这个功能解决什么问题
    description: '勾选要优化的 dsh 环节，减少每步等待与来回次数。',
    // 卡片右下角「设置」入口的文案
    settingsAction: '设置',
    // 功能页标题
    pageTitle: '对话加速',
    // 功能页说明：勾选即时保存并生效
    pageDescription: '勾选即生效并保存到宿主，之后每个会话都按这份设置运行。',
    // 已选条目计数的前缀
    selectedLabel: '已选',
    // 已选条目计数的单位
    itemUnit: '项',
    // 保存中的状态提示
    saving: '保存中…',
    // 读取或保存失败时的前缀
    saveFailed: '保存失败',
    // 每条条目收益文案的前缀
    gainLabel: '收益',
    // 每条条目风险文案的前缀
    riskLabel: '风险',

    // 第 1 条：提示词要求同一步并发
    parallelPromptName: '提示词要求同一步并发',
    // 第 1 条说明：多数步骤只发一个工具调用
    parallelPromptHint: '多数步骤只发 1 个工具调用，能一次做完的事被拆成多次来回。',
    // 第 1 条收益：减少步骤数与耗时
    parallelPromptGain: '步骤减 25–35%，10 步任务省 20–30 秒。',
    // 第 1 条风险：只改提示词
    parallelPromptRisk: '几乎为零，只加 3 行提示词。',

    // 第 2 条：一次提交多处修改
    batchEditName: '一次提交多处修改',
    // 第 2 条说明：edit 一次只改一处
    batchEditHint: 'edit 一次只能改一处，改 4 个文件要 4 次来回。',
    // 第 2 条收益：多文件改动的节省
    batchEditGain: '多文件改动省 30% 步骤，4 个文件省 24 秒。',
    // 第 2 条风险：半途失败留下半改状态
    batchEditRisk: '半途失败会留下半改状态。',

    // 第 3 条：更早裁剪旧工具结果
    toolResultPruneName: '更早裁剪旧工具结果',
    // 第 3 条说明：旧输出会一直留在上下文里
    toolResultPruneHint: '读文件和命令输出会一直留在上下文里，反复重传。',
    // 第 3 条收益：上下文增速下降
    toolResultPruneGain: '每步少几 KB，上下文增速降 20–30%。',
    // 第 3 条风险：模型可能重复读取
    toolResultPruneRisk: '模型可能重复读同一文件。',
    // 第 3 条参数输入框的标签：裁剪字符数阈值
    toolResultPruneThreshold: '裁剪阈值',
    // 第 3 条参数输入框的单位
    toolResultPruneUnit: '字符',
    // 第 3 条参数输入不合法时的提示，含允许范围
    toolResultPruneInvalid: '请输入 512–16384 之间的整数。',

    // 第 4 条：只读工具声明可并发
    readonlyConcurrencyName: '只读工具声明可并发',
    // 第 4 条说明：未声明的工具只能排队
    readonlyConcurrencyHint: '没声明「安全」的工具一律排队，现在只有读文件声明了。',
    // 第 4 条收益：需配合第 1 条
    readonlyConcurrencyGain: '单独做几乎无效，配合第 1 条省 1–2 秒/步。',
    // 第 4 条风险：声明错误会导致并发写冲突
    readonlyConcurrencyRisk: '标错会让写操作并发冲突。',
  },
  en: {
    // Grid entry title
    title: 'Chat acceleration',
    // Grid entry description: what this feature is for
    description: 'Pick the dsh optimizations to cut per-step waiting and round trips.',
    // Label of the "settings" entry at the card's bottom-right corner
    settingsAction: 'Settings',
    // Feature page title
    pageTitle: 'Chat acceleration',
    // Feature page description: selections apply and persist immediately
    pageDescription: 'Changes apply and save immediately; every session then runs with these settings.',
    // Prefix of the selected-count line
    selectedLabel: 'Selected',
    // Unit of the selected-count line
    itemUnit: 'items',
    // Saving indicator
    saving: 'Saving…',
    // Prefix shown when loading or saving fails
    saveFailed: 'Save failed',
    // Prefix of each item's gain text
    gainLabel: 'Gain',
    // Prefix of each item's risk text
    riskLabel: 'Risk',

    // Item 1: parallel tool calls in one step
    parallelPromptName: 'Parallel tool calls in one step',
    // Item 1 hint: most steps issue a single tool call
    parallelPromptHint: 'Most steps issue one tool call, so one-shot work becomes several round trips.',
    // Item 1 gain: fewer steps and the time that saves
    parallelPromptGain: '25–35% fewer steps; a 10-step task saves 20–30 s.',
    // Item 1 risk: prompt-only change
    parallelPromptRisk: 'Almost none — three lines of prompt text.',

    // Item 2: submit several edits at once
    batchEditName: 'Submit several edits at once',
    // Item 2 hint: edit changes one location per call
    batchEditHint: 'edit changes one location per call, so four files cost four round trips.',
    // Item 2 gain: steps and time saved on multi-file changes
    batchEditGain: '30% fewer steps; four files save 24 s.',
    // Item 2 risk: a half-finished batch
    batchEditRisk: 'A failed batch leaves files half changed.',

    // Item 3: prune old tool results earlier
    toolResultPruneName: 'Prune old tool results earlier',
    // Item 3 hint: old output stays in the context
    toolResultPruneHint: 'File and command output stays in the context and is re-sent every request.',
    // Item 3 gain: slower context growth
    toolResultPruneGain: 'Saves a few KB per step; context grows 20–30% slower.',
    // Item 3 risk: the model may re-read files
    toolResultPruneRisk: 'The model may read the same file again.',
    // Item 3 threshold input label: prune size in characters
    toolResultPruneThreshold: 'Prune threshold',
    // Item 3 threshold input unit
    toolResultPruneUnit: 'chars',
    // Item 3 invalid input hint with the allowed range
    toolResultPruneInvalid: 'Enter a whole number between 512 and 16384.',

    // Item 4: mark read-only tools as concurrency-safe
    readonlyConcurrencyName: 'Mark read-only tools as concurrency-safe',
    // Item 4 hint: only tools that declare themselves safe may run together
    readonlyConcurrencyHint: 'Tools without a safe declaration run one at a time; only file reading has one.',
    // Item 4 gain: needs item 1 to matter
    readonlyConcurrencyGain: 'Nearly zero alone; with item 1 saves 1–2 s per step.',
    // Item 4 risk: a wrong declaration causes conflicting concurrent writes
    readonlyConcurrencyRisk: 'A wrong declaration runs conflicting writes together.',
  },
}
