import type { FeatureLocales } from '../../shell/registry'

/** 「删除会话」的中英文文案；key 由外壳统一加 `delete-session.` 前缀。 */
export const deleteSessionLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '删除会话',
    // 开关用途说明：解释打开后会话列表里会出现什么、以及为什么需要刷新
    description:
      '在会话行的悬停操作里增加删除按钮，点击直接删除该会话的本地历史（宿主只提供归档）。切换后页面会自动刷新。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 会话行删除按钮的可访问名称与悬停提示
    action: '删除会话',
    // 删除进行中的可访问名称
    deleting: '正在删除会话',
    // 删除失败时的提示前缀，后面拼接宿主返回的原因
    deleteFailed: '删除会话失败',
  },
  en: {
    // Switch title
    title: 'Delete sessions',
    // Switch description explaining the row action and why a reload happens
    description:
      'Adds a delete button to each session row’s hover actions, removing that conversation’s local history (the host only offers archive). The page reloads after switching.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Accessible name and hover hint of the row delete button
    action: 'Delete session',
    // Accessible name while the delete request is in flight
    deleting: 'Deleting session',
    // Prefix for a failed delete, followed by the host's reason
    deleteFailed: 'Could not delete the session',
  },
}
