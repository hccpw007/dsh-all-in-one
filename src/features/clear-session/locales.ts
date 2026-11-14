import type { FeatureLocales } from '../../shell/registry'

/** 「清空会话」的中英文文案；key 由外壳统一加 `clear-session.` 前缀。 */
export const clearSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '清空会话',
    // 开关用途说明：点明入口位置与两个可选结果
    description: '输入框左侧新增按钮，确认后在同一工作区打开一条空白对话，可选择是否删掉原对话。',
    // 提示切换开关会刷新页面，避免用户丢失滚动位置与未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 输入框按钮的名称与悬停提示
    action: '清空会话',
    // 当前对话正在运行、按钮不可用时的悬停提示
    runningHint: '当前对话正在运行，请先停止',
    // 确认弹窗标题
    dialogTitle: '新会话',
    // 确认弹窗说明：点明动作结果是换一条新对话
    dialogMessage: '将在同一工作区打开一条新的空白对话。',
    // 「保留会话」按钮：开新对话，原对话原样不动
    keepAction: '保留会话',
    // 「保留会话」的含义说明
    keepHint: '原对话保持不变，仍留在会话列表里。',
    // 「删除会话」按钮：开新对话，并删掉原对话
    deleteAction: '删除会话',
    // 「删除会话」的含义说明
    deleteHint: '原对话的本地记录会被永久删除，无法恢复。',
    // 弹窗取消按钮
    cancel: '取消',
    // 任一动作执行中，按钮显示的进行态文字
    processing: '处理中…',
    // 操作失败的提示前缀，后面拼接宿主返回的原因
    failed: '操作失败',
  },
  en: {
    // Switch title
    title: 'Clear session',
    // Switch description: entry position and the two possible outcomes
    description:
      'Adds a button left of the composer. Confirming opens a blank conversation in the same workspace, with the option to delete the previous one.',
    // Switching reloads the page so the composer button appears or disappears
    reloadHint: 'Switching reloads the page to take effect.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check the browser storage permission.',
    // Composer button label and hover tooltip
    action: 'Clear session',
    // Tooltip while the current conversation is running
    runningHint: 'This conversation is running. Stop it first.',
    // Dialog title
    dialogTitle: 'New session',
    // Dialog message: the action opens another conversation
    dialogMessage: 'A new blank conversation opens in the same workspace.',
    // Keep button: open a new conversation without touching the current one
    keepAction: 'Keep session',
    // What keeping means
    keepHint: 'The current conversation stays as it is and remains in the session list.',
    // Delete button: open a new conversation and remove the current one
    deleteAction: 'Delete session',
    // What deleting means
    deleteHint: 'The local records of the current conversation are deleted permanently.',
    // Dialog cancel button
    cancel: 'Cancel',
    // Text shown on the pressed button while the action runs
    processing: 'Working…',
    // Failure prefix followed by the reason returned by the host
    failed: 'Failed',
  },
}
