import type { FeatureLocales } from '../../shell/registry'

/** 「新会话入口」的中英文文案；key 由外壳统一加 `clear-session.` 前缀。 */
export const clearSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题：卡片只说输入框旁多了入口，动作语义留给下面的按钮文案
    title: '新会话入口',
    // 开关用途说明：点明入口位置（输入框左下角、加号按钮左侧）与两个按钮的分工，控制在两行以内
    description: '输入框左下角新增 + / - 按钮：直接开新会话，或删除当前会话再开。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 加号按钮的名称与悬停提示：开新对话并保留当前会话
    newAction: '开启新会话',
    // 减号按钮的名称与悬停提示：删除当前会话后开新对话
    deleteAction: '删除当前会话并开启新会话',
    // 当前对话正在执行任务时的提示：确认删除会先停止这一轮
    runningHint: '当前会话正在执行任务：确认后会先停止它，再删除并开启新会话。',
    // 确认弹窗标题
    dialogTitle: '删除当前会话并开启新会话',
    // 确认弹窗说明：点明动作结果是换一条新对话并删除旧记录
    dialogMessage: '将在同一工作区打开一条新的空白对话，并删除当前会话。',
    // 删除范围说明：点明本地记录不可恢复
    deleteHint: '当前会话及其本地记录会被永久删除，无法恢复。',
    // 弹窗取消按钮
    cancel: '取消',
    // 删除执行中，按钮显示的进行态文字
    processing: '处理中…',
    // 停止任务超时（等不到运行标记落下）时的提示
    stopTimeout: '任务未能及时停止，请稍后重试。',
    // 操作失败的提示前缀，后面拼接宿主返回的原因
    failed: '操作失败',
  },
  en: {
    // Switch title: the card names the added entry; the action stays in the button labels
    title: 'New session buttons',
    // Switch description: entry position and the two buttons, kept within two lines
    description: 'Add + / - composer buttons: start a new session, or delete this one first.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check the browser storage permission.',
    // Plus button label and hover tooltip: open a new conversation and keep the current one
    newAction: 'Start a new session',
    // Minus button label and hover tooltip: delete this session, then open a new one
    deleteAction: 'Delete this session and start a new one',
    // Shown inside the dialog while the conversation works: confirming stops the turn first
    runningHint: 'This session is still working: confirming stops it before deleting and starting a new one.',
    // Dialog title
    dialogTitle: 'Delete this session and start a new one',
    // Dialog message: the action opens another conversation and removes the current one
    dialogMessage: 'A new blank conversation opens in the same workspace, and this session is deleted.',
    // What deleting the current session means
    deleteHint: 'This session and its local records are deleted permanently.',
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
