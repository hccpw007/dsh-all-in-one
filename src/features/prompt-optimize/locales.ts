import type { FeatureLocales } from '../../shell/registry'

/** 「提示词优化」的中英文文案；key 由外壳统一加 `prompt-optimize.` 前缀。 */
export const promptOptimizeLocales: FeatureLocales = {
  zh: {
    // 开关标题：卡片只说输入框旁多了一枚按钮，具体效果留给说明行
    title: '提示词优化',
    // 开关用途说明：点明入口位置与「先改写、不直接发送」这一关键行为
    description: '发送按钮旁新增一枚图标：点击把当前输入补成完整需求，回写到输入框由你再改。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 按钮名称与悬停提示：说明点击后发生什么
    action: '优化这段提示词',
    // 请求进行中的悬停提示
    working: '正在优化…',
    // 草稿为空时的悬停提示
    empty: '先在输入框里写点内容',
    // 输入框正在发送或执行命令时的悬停提示
    busy: '输入框正在提交，稍后再试',
    // 新会话页面还没有会话标识时的悬停提示
    unavailable: '当前对话还没就绪',
    // 优化失败时写在输入框上方的提示前缀
    failed: '优化失败',
  },
  en: {
    // Switch title
    title: 'Prompt polish',
    // Switch description: entry position and the rewrite-then-edit behaviour
    description: 'Adds an icon next to send: rewrite the current draft into a complete request, then edit it yourself.',
    // Shown when the switch state cannot be stored
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Button label and hover hint
    action: 'Polish this prompt',
    // Hover hint while the request runs
    working: 'Polishing…',
    // Hover hint on an empty draft
    empty: 'Type something in the composer first',
    // Hover hint while the composer is submitting
    busy: 'The composer is submitting; try again shortly',
    // Hover hint when the session is not ready yet
    unavailable: 'This conversation is not ready yet',
    // Prefix of the composer notice shown on failure
    failed: 'Polish failed',
  },
}
