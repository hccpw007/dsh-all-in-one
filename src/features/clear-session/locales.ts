import type { FeatureLocales } from '../../shell/registry'

/** 「清空会话」的中英文文案；key 由外壳统一加 `clear-session.` 前缀。 */
export const clearSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '清空会话',
    // 开关用途说明：点明入口位置与两种结果（归档或删除）
    description: '输入框左侧新增清空按钮，确认后在同一工作区打开一条空白对话，旧对话按你的选择归档或删除。',
    // 提示切换开关会刷新页面，避免用户丢失滚动位置与未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 输入框按钮的名称与悬停提示
    action: '清空会话',
    // 当前对话正在运行、按钮不可用时的悬停提示
    runningHint: '当前对话正在运行，请先停止',
    // 确认弹窗标题
    dialogTitle: '清空会话',
    // 确认弹窗说明：解释清空不是删除消息，而是换到一条新对话
    dialogMessage: '当前对话不会继续使用，将在同一工作区打开一条新的空白对话。',
    // 「保留当前会话」复选框标签
    keepLabel: '保留当前会话',
    // 勾选时的说明：旧对话走归档，可恢复
    keepHint: '旧对话会被归档，可在归档列表里找回。',
    // 取消勾选时的说明：旧对话被真删，不可恢复
    discardHint: '旧对话的本地记录会被永久删除，无法恢复。',
    // 弹窗取消按钮
    cancel: '取消',
    // 弹窗确认按钮
    confirm: '清空',
    // 执行中的确认按钮文字
    clearing: '清空中…',
    // 清空失败的提示前缀，后面拼接宿主返回的原因
    failed: '清空失败',
  },
  en: {
    // Switch title
    title: 'Clear session',
    // Switch description: entry position and the two possible outcomes
    description:
      'Adds a clear button to the left of the composer. Confirming opens a blank conversation in the same workspace, and the old one is archived or deleted as you choose.',
    // Switching reloads the page so the composer button appears or disappears
    reloadHint: 'Switching reloads the page to take effect.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check the browser storage permission.',
    // Composer button label and hover tooltip
    action: 'Clear session',
    // Tooltip while the current conversation is running
    runningHint: 'This conversation is running. Stop it first.',
    // Dialog title
    dialogTitle: 'Clear session',
    // Dialog message: clearing starts a new conversation instead of deleting messages
    dialogMessage:
      'This conversation will no longer be used. A new blank conversation opens in the same workspace.',
    // Keep-current-session checkbox label
    keepLabel: 'Keep the current conversation',
    // Hint while keeping: the old conversation is archived and recoverable
    keepHint: 'The old conversation is archived and can be restored from the archive list.',
    // Hint after unchecking: the old conversation is deleted for good
    discardHint: 'The local records of the old conversation are deleted permanently.',
    // Dialog cancel button
    cancel: 'Cancel',
    // Dialog confirm button
    confirm: 'Clear',
    // Confirm button while the operation runs
    clearing: 'Clearing…',
    // Failure prefix followed by the reason returned by the host
    failed: 'Clear failed',
  },
}
