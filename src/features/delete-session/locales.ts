import type { FeatureLocales } from '../../shell/registry'

/** 「删除会话」的中英文文案；key 由外壳统一加 `delete-session.` 前缀。 */
export const deleteSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '删除会话',
    // 开关用途说明：说明打开后会话行会出现删除入口、工作区菜单会出现批量删除入口，且删除前需要先在弹窗里确认
    description: '会话悬停操作里新增删除按钮，工作区「更多」菜单可一键删除全部会话，确认后清除本地记录。',
    // 提示切换开关会刷新页面，避免用户丢失滚动位置与未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 会话行删除按钮的可访问名称与悬停提示
    action: '删除会话',
    // 工作区「更多」菜单里的批量删除入口
    deleteAllAction: '删除所有会话',
    // 确认弹窗标题
    confirmTitle: '删除会话',
    // 确认弹窗的说明文字，指出弹窗里给出的是哪一条会话
    confirmTarget: '即将删除以下会话：',
    // 确认弹窗的删除范围说明
    confirmMessage:
      '将删除该会话的本地记录：对话正文、标题缓存与列表记录，删除后无法恢复。',
    // 批量删除确认弹窗标题
    confirmAllTitle: '删除所有会话',
    // 批量删除确认弹窗的说明文字，指出弹窗里给出的是哪个工作区
    confirmAllTarget: '即将删除以下工作区中的会话：',
    // 批量删除确认弹窗的会话数量说明，{count} 为条数
    confirmAllCount: '共 {count} 条会话',
    // 批量删除的删除范围说明：说明跳过运行中的会话、包含归档会话且无法恢复
    confirmAllMessage:
      '将删除该工作区中所有不在运行中的会话（含已归档会话）的本地记录，删除后无法恢复；正在执行任务的会话会保留。',
    // 确认弹窗的取消按钮
    confirmCancel: '取消',
    // 确认弹窗的确认按钮
    confirmDelete: '删除',
    // 删除进行中的按钮与状态文字
    deleting: '正在删除',
    // 删除失败时的提示前缀，后面拼接宿主返回的原因
    deleteFailed: '删除会话失败',
    // 批量删除部分失败时的提示，{count} 为失败条数
    deleteAllPartial: '有 {count} 条会话删除失败，可关闭后重新操作。',
  },
  en: {
    // Switch title
    title: 'Delete sessions',
    // Switch description covering the row action, the bulk workspace entry, and the confirmation step
    description: 'Adds a delete button to session hover actions and a delete-all entry to the workspace menu; a dialog confirms first.',
    // Tells the user that toggling reloads the page so state applies everywhere
    reloadHint: 'Reloads the page so the change takes effect.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Accessible name and hover hint of the row delete button
    action: 'Delete session',
    // Bulk delete entry in the workspace More menu
    deleteAllAction: 'Delete all sessions',
    // Confirmation dialog title
    confirmTitle: 'Delete session',
    // Dialog line introducing the session being deleted
    confirmTarget: 'About to delete:',
    // Dialog text describing what is removed
    confirmMessage:
      'This removes the session’s local records: the conversation log, its title cache, and its list entry. It cannot be undone.',
    // Bulk confirmation dialog title
    confirmAllTitle: 'Delete all sessions',
    // Dialog line introducing the workspace whose sessions are deleted
    confirmAllTarget: 'About to delete sessions in:',
    // Session count line of the bulk dialog; {count} is the number of sessions
    confirmAllCount: '{count} sessions in total',
    // Bulk dialog text: running sessions are kept, archived ones included, irreversible
    confirmAllMessage:
      'This removes every non-running session in this workspace, including archived ones: conversation logs, title caches, and list entries. It cannot be undone; sessions with running work are kept.',
    // Cancel button of the confirmation dialog
    confirmCancel: 'Cancel',
    // Confirming delete button
    confirmDelete: 'Delete',
    // Button label and status text while deleting
    deleting: 'Deleting',
    // Prefix for a failed delete, followed by the host's reason
    deleteFailed: 'Could not delete the session',
    // Shown when part of a bulk delete failed; {count} is the number of failed sessions
    deleteAllPartial: '{count} sessions could not be deleted. Close and try again.',
  },
}
