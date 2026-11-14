import type { FeatureLocales } from '../../shell/registry'

/** 「编辑排队消息」开关的中英文文案；key 由外壳统一加 `queue-edit.` 前缀。 */
export const queueEditLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '编辑排队消息',
    // 开关用途说明：解释点编辑会撤回排队并把内容放回输入框
    description: '排队中的消息点编辑即撤回，文字和图片回到输入框，改完直接重新发送。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 排队条上编辑按钮的名称，同时作为悬停提示
    recall: '撤回并编辑',
    // 输入框正在发送时不允许改写草稿
    unavailable: '输入框正在发送消息，稍后再撤回这条排队。',
    // 含文件附件的排队消息无法回填：客户端没有读取这类附件的入口
    unsupported: '这条排队消息包含文件附件，无法放回输入框，可改用删除后重新添加。',
    // 宿主拒绝撤回或读取图片失败
    failed: '撤回排队消息失败，请重试。',
    // 排队已撤回但图片没能放回输入框
    imageFailed: '消息已撤回，但图片没能放回输入框，请重新添加。',
  },
  en: {
    // Switch title
    title: 'Edit queued messages',
    // Switch description explaining that editing recalls the queued message into the composer
    description: 'Edit recalls a queued message: its text and images return to the composer so you can resend.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Name and hover hint of the edit button on a queued row
    recall: 'Recall and edit',
    // The composer is busy sending, so the draft cannot be rewritten
    unavailable: 'The composer is sending a message. Recall this queued item in a moment.',
    // Queued messages carrying file attachments cannot be restored: the client cannot read them back
    unsupported: 'This queued message carries file attachments, so it cannot return to the composer. Remove it and attach the files again.',
    // The host refused the recall or the image bytes failed to load
    failed: 'Could not recall the queued message. Try again.',
    // The queue item was recalled but its images did not make it back
    imageFailed: 'The message was recalled, but its images did not return to the composer. Add them again.',
  },
}
