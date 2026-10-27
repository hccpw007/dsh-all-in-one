/**
 * 标准预设的插件行清单。
 *
 * 与宿主 `@deepseek-ai/dsh-web-app/presets/standard.patch.yml` 保持一致：
 * 「对话风格」从零组装 Agent，编辑器把这份清单作为可选工具集。宿主升级后
 * 该文件若新增或改名插件行，需要同步这里。
 */
import type { PluginCatalogItem } from '../types'

/** 预设组合里的一行，字段与宿主 cordis 组合一致。 */
export interface PresetRow {
  id: string
  name: string
  config?: unknown
  group?: true
  isolate?: Record<string, boolean>
}

/** 一个可勾选的功能项，包含它需要的全部组合行。 */
export interface StandardPluginItem extends PluginCatalogItem {
  rows: PresetRow[]
}

/** 计划模式的提示词段落，取自标准预设。 */
const PLAN_MODE_SECTION = `You are in plan mode. Stay in plan mode until the user approves your plan through exit_plan_mode or switches the session mode. Imperative language to implement changes means plan the implementation, not execute it. A user's conversational agreement — including an answer confirming something you asked — approves nothing and does not end plan mode; fold the confirmed decision into the plan and submit it through exit_plan_mode.

Explore first. Use non-mutating reads, searches, static analysis, and checks to ground the plan in the actual repository. Do not edit or write files, change configuration, run formatters or code generation that rewrites tracked files, commit, or otherwise carry out the plan. Prefer existing functions and patterns over new machinery.

The tool catalog stays the same across modes for request-cache stability. These plan-mode rules override any later tool description or guidance that suggests using mutation tools; those tools remain listed to keep the tool catalog unchanged. Do not use todo_write to track this planning phase: it tracks implementation after an approved plan, while the plan itself belongs in exit_plan_mode.

Resolve discoverable facts by inspection. Use ask_user_question only for user-owned choices or material ambiguity that inspection cannot answer. Do not ask the user where code lives or how current behavior works when you can find out.

Make the plan decision-complete: state the goal and success criteria; group implementation changes by subsystem; identify public API, schema, and data-flow changes; cover edge cases, failure modes, tests, acceptance criteria, and explicit assumptions. Keep it concise enough to review but detailed enough that another engineer can implement it without making design decisions.

When ready, call exit_plan_mode with the complete plan markdown, starting with a # title. Make exit_plan_mode the only and final tool call in that assistant response: it presents the plan for approval, and implementation begins only in a later step after approval. Do not paste the final plan as a plain reply or ask "should I proceed?" through prose or ask_user_question. If review rejects it, incorporate the feedback and present again. If the review channel is unavailable or aborted, stay in plan mode and ask the user to switch modes manually; do not proceed with implementation.`

/** 终端项按平台二选一，避免把另一平台的工具行放进组合。 */
const TERMINAL_ITEM: StandardPluginItem =
  process.platform === 'win32'
    ? {
        id: 'tool-terminal',
        label: '终端命令',
        description: 'Windows PowerShell 命令执行工具。',
        kind: 'standard',
        rows: [{ id: 'tool-pwsh', name: '@deepseek-ai/dsh-tool-pwsh' }],
      }
    : {
        id: 'tool-terminal',
        label: '终端命令',
        description: 'Bash 命令执行工具。',
        kind: 'standard',
        rows: [{ id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash' }],
      }

/** 可选的标准预设功能项，顺序即编辑页的展示顺序。 */
export const STANDARD_PLUGIN_ITEMS: StandardPluginItem[] = [
  {
    id: 'agent-instructions',
    label: '项目说明',
    description: '读取工作区的 AGENTS.md 等说明文件并注入上下文。',
    kind: 'standard',
    rows: [
      {
        id: 'agent-instructions',
        name: '@deepseek-ai/dsh-agent-instructions',
        config: { maxBytes: 65536 },
      },
    ],
  },
  {
    id: 'time-context',
    label: '时间上下文',
    description: '把当前日期与时间注入系统提示词。',
    kind: 'standard',
    rows: [{ id: 'time-context', name: '@deepseek-ai/dsh-time-context' }],
  },
  TERMINAL_ITEM,
  {
    id: 'tool-fs',
    label: '文件读写',
    description: '读取、写入与编辑工作区文件。',
    kind: 'standard',
    rows: [{ id: 'tool-fs', name: '@deepseek-ai/dsh-tool-fs' }],
  },
  {
    id: 'tool-fs-search',
    label: '文件检索',
    description: '按文件名与内容搜索工作区。',
    kind: 'standard',
    rows: [
      {
        id: 'tool-fs-search',
        name: '@deepseek-ai/dsh-tool-fs-search',
        config: { sampleOverCapGlobResults: false },
      },
    ],
  },
  {
    id: 'tool-jobs',
    label: '后台任务',
    description: '启动、查看与停止后台命令。',
    kind: 'standard',
    rows: [{ id: 'tool-jobs', name: '@deepseek-ai/dsh-tool-jobs' }],
  },
  {
    id: 'tool-schedule',
    label: '定时任务',
    description: '创建按时间触发的任务。',
    kind: 'standard',
    rows: [{ id: 'tool-schedule', name: '@deepseek-ai/dsh-tool-schedule' }],
  },
  {
    id: 'tool-goal',
    label: '目标',
    description: '设定与追踪多轮任务目标。',
    kind: 'standard',
    rows: [
      { id: 'command-goal', name: '@deepseek-ai/dsh-command-goal' },
      { id: 'tool-goal', name: '@deepseek-ai/dsh-tool-goal' },
    ],
  },
  {
    id: 'plan-mode',
    label: '计划模式',
    description: '先出计划、经确认后再执行的协作模式。',
    kind: 'standard',
    rows: [
      {
        id: 'planning',
        name: 'cordis:group',
        group: true,
        isolate: { planMode: true },
        config: [
          {
            id: 'plan-mode',
            name: '@deepseek-ai/dsh-plan-mode',
            config: { section: PLAN_MODE_SECTION },
          },
        ],
      },
    ],
  },
  {
    id: 'compaction',
    label: '上下文压缩',
    description: '长会话自动压缩与工具结果裁剪。',
    kind: 'standard',
    rows: [
      {
        id: 'compaction',
        name: 'cordis:group',
        group: true,
        isolate: { compaction: true, toolResultPruner: true },
        config: [
          { id: 'compaction-basic', name: '@deepseek-ai/dsh-compaction-basic' },
          { id: 'command-compact', name: '@deepseek-ai/dsh-command-compact' },
          {
            id: 'tool-result-pruner',
            name: '@deepseek-ai/dsh-compaction-tool-result-pruner',
            config: { thresholdChars: 8192, headChars: 4096, tailChars: 1024 },
          },
        ],
      },
    ],
  },
  {
    id: 'delegation',
    label: '子智能体',
    description: '派发子任务、工作流与并行执行。',
    kind: 'standard',
    rows: [
      {
        id: 'delegation',
        name: 'cordis:group',
        group: true,
        isolate: { workflowEngine: true },
        config: [
          { id: 'tool-subagent-control', name: '@deepseek-ai/dsh-tool-subagent-control' },
          {
            id: 'tool-subagent-list-agents',
            name: '@deepseek-ai/dsh-tool-subagent-control/list-agents',
          },
          {
            id: 'tool-subagent',
            name: '@deepseek-ai/dsh-tool-subagent',
            config: { provider: 'spawn', toolName: 'subagent', modelSelectionSettings: true },
          },
          {
            id: 'tool-subagent-fork',
            name: '@deepseek-ai/dsh-tool-subagent',
            config: { provider: 'fork', toolName: 'subagent_fork' },
          },
          {
            id: 'workflow-ptc',
            name: '@deepseek-ai/dsh-workflow-ptc',
            config: { provider: 'spawn' },
          },
          { id: 'tool-workflow', name: '@deepseek-ai/dsh-tool-workflow' },
        ],
      },
    ],
  },
  {
    id: 'tool-ask-user',
    label: '询问用户',
    description: '需要决策时向用户提问。',
    kind: 'standard',
    rows: [{ id: 'tool-ask-user', name: '@deepseek-ai/dsh-tool-ask-user' }],
  },
  {
    id: 'tool-todo',
    label: '待办清单',
    description: '在长任务中维护待办列表。',
    kind: 'standard',
    rows: [
      {
        id: 'tool-todo',
        name: '@deepseek-ai/dsh-tool-todo',
        config: { allowParallelInProgress: true },
      },
    ],
  },
  {
    id: 'tool-web',
    label: '网页搜索',
    description: '搜索与抓取网页内容。',
    kind: 'standard',
    rows: [
      {
        id: 'tool-web',
        name: '@deepseek-ai/dsh-tool-web',
        config: { fetch: true, searchTimeoutMs: 60000 },
      },
    ],
  },
  {
    id: 'present',
    label: '交付物展示',
    description: '把结果以文件或页面形式展示给用户。',
    kind: 'standard',
    rows: [{ id: 'present', name: '@deepseek-ai/dsh-tool-present' }],
  },
]
