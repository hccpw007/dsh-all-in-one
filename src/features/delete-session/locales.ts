import type { FeatureLocales } from '../../shell/registry'

/** 「删除会话」的中英文文案；key 由外壳统一加 `delete-session.` 前缀。 */
export const deleteSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '删除会话',
    // 开关用途说明：解释打开后会话列表里会出现什么、删除前会先确认、以及为什么需要刷新
    description:
      '在会话行的悬停操作里增加删除按钮，点击后先在弹窗里确认，确认后才删除该会话的本地历史（宿主只提供归档）。切换后页面会自动刷新。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 会话行删除按钮的可访问名称与悬停提示
    action: '删除会话',
    // 确认弹窗标题
    confirmTitle: '删除会话',
    // 确认弹窗的说明文字，指出弹窗里给出的是哪一条会话
    confirmTarget: '即将删除以下会话：',
    // 确认弹窗的删除范围说明
    confirmMessage:
      '将删除该会话的本地记录：对话正文、标题缓存与列表记录，删除后无法恢复。',
    // 确认弹窗的取消按钮
    confirmCancel: '取消',
    // 确认弹窗的确认按钮
    confirmDelete: '删除',
    // 删除进行中的按钮与状态文字
    deleting: '正在删除',
    // 删除失败时的提示前缀，后面拼接宿主返回的原因
    deleteFailed: '删除会话失败',
  },
  en: {
    // Switch title
    title: 'Delete sessions',
    // Switch description explaining the row action, the confirmation step, and the reload
    description:
      'Adds a delete button to each session row’s hover actions. A dialog confirms first, then the conversation’s local history is removed (the host only offers archive). The page reloads after switching.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Accessible name and hover hint of the row delete button
    action: 'Delete session',
    // Confirmation dialog title
    confirmTitle: 'Delete session',
    // Dialog line introducing the session being deleted
    confirmTarget: 'About to delete:',
    // Dialog text describing what is removed
    confirmMessage:
      'This removes the session’s local records: the conversation log, its title cache, and its list entry. It cannot be undone.',
    // Cancel button of the confirmation dialog
    confirmCancel: 'Cancel',
    // Confirming delete button
    confirmDelete: 'Delete',
    // Button label and status text while deleting
    deleting: 'Deleting',
    // Prefix for a failed delete, followed by the host's reason
    deleteFailed: 'Could not delete the session',
  },
}
