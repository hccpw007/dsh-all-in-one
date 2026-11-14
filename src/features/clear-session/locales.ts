import type { FeatureLocales } from '../../shell/registry'

/** 「清空会话」的中英文文案；key 由外壳统一加 `clear-session.` 前缀。 */
export const clearSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '清空会话',
    // 开关用途说明：点明入口位置与两个可选结果
    description: '输入框左侧新增按钮，确认后在同一工作区打开一条空白对话，可选择保留还是删除当前会话。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 输入框按钮的名称与悬停提示
    action: '开启新会话',
    // 当前对话正在执行任务时的提示：按钮悬停与弹窗内都会显示，点明保留不停、删除先停
    runningHint: '当前会话正在执行任务：「直接开启」让它继续在后台运行，「删除本次会话」会先停止它。',
    // 确认弹窗标题
    dialogTitle: '开启新会话',
    // 确认弹窗说明：点明动作结果是换一条新对话
    dialogMessage: '将在同一工作区打开一条新的空白对话。',
    // 「直接开启」按钮：开新对话，当前会话原样不动
    keepAction: '直接开启',
    // 「直接开启」的含义说明
    keepHint: '当前会话保持不变，仍留在会话列表里。',
    // 「删除本次会话」按钮：开新对话，并删掉当前会话
    deleteAction: '删除本次会话',
    // 「删除本次会话」的含义说明
    deleteHint: '当前会话及其本地记录会被永久删除，无法恢复。',
    // 弹窗取消按钮
    cancel: '取消',
    // 任一动作执行中，按钮显示的进行态文字
    processing: '处理中…',
    // 停止任务超时（等不到运行标记落下）时的提示
    stopTimeout: '任务未能及时停止，请稍后重试。',
    // 操作失败的提示前缀，后面拼接宿主返回的原因
    failed: '操作失败',
  },
  en: {
    // Switch title
    title: 'Clear session',
    // Switch description: entry position and the two possible outcomes
    description:
      'Adds a button left of the composer. Confirming opens a blank conversation in the same workspace, keeping or deleting the current one.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check the browser storage permission.',
    // Composer button label and hover tooltip
    action: 'Start a new session',
    // Shown both as the button tooltip and inside the dialog while the conversation works:
    // start-now leaves the turn running, delete-this-session stops it first
    runningHint: 'This session is still working: "Start now" leaves it running in the background, "Delete this session" stops it first.',
    // Dialog title
    dialogTitle: 'Start a new session',
    // Dialog message: the action opens another conversation
    dialogMessage: 'A new blank conversation opens in the same workspace.',
    // Start button: open a new conversation without touching the current one
    keepAction: 'Start now',
    // What starting without deleting means
    keepHint: 'The current session stays unchanged and remains in the session list.',
    // Delete button: open a new conversation and remove the current session
    deleteAction: 'Delete this session',
    // What deleting the current session means
    deleteHint: 'The current session and its local records are deleted permanently.',
    // Dialog cancel button
    cancel: 'Cancel',
    // Text shown on the pressed button while the action runs
    processing: 'Working…',
    // Shown when the running turn does not settle within the stop timeout
    stopTimeout: 'The task did not stop in time. Please try again.',
    // Failure prefix followed by the reason returned by the host
    failed: 'Failed',
  },
}
