import type { FeatureLocales } from '../../shell/registry'

/** 「全自动执行」的中英文文案；key 由外壳统一加 `auto-run.` 前缀。 */
export const autoRunLocales: FeatureLocales = {
  zh: {
    // 设置页开关标题
    title: '全自动执行',
    // 设置页开关用途说明：点明入口位置与会话级语义
    description: '输入框右侧新增「全自动」开关：打开后本对话不提问、不等待确认，改完自行验证；关闭即恢复原有流程。',
    // 提示切换设置页开关会刷新页面，避免用户丢失未保存的输入
    reloadHint: '切换后会刷新页面以生效。',
    // 设置页开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 输入框按钮的名称与无障碍标签
    action: '全自动',
    // 开启状态下的悬停提示：说明模型不会再来问
    hintOn: '全自动已开启：本对话不向你提问，也不在结尾等待你选择',
    // 关闭状态下的悬停提示：说明打开后的效果
    hintOff: '点击开启全自动：本对话不提问、不等待确认，改完自行验证',
    // 状态尚未从宿主读取回来时的悬停提示
    loading: '正在读取全自动状态…',
    // 会话尚未创建、按钮无法切换时的悬停提示
    unavailable: '会话未就绪，暂时不能切换',
    // 切换失败时的悬停提示前缀，后面拼接宿主返回的原因
    toggleFailed: '切换全自动失败',
  },
  en: {
    // Switch title
    title: 'Full auto',
    // Switch description: entry position and per-conversation semantics
    description:
      'Adds a Full auto switch right of the composer: while on, this conversation never asks or waits for confirmation and verifies its own changes; turn it off to restore the normal flow.',
    // Switching reloads the page so the composer button appears or disappears
    reloadHint: 'Switching reloads the page to take effect.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Saving the switch state failed. Check the browser storage permission.',
    // Composer button label and accessible name
    action: 'Full auto',
    // Tooltip while enabled: the model will not come back with questions
    hintOn: 'Full auto is on: this conversation never asks you questions or waits for a choice',
    // Tooltip while disabled: effect of turning it on
    hintOff: 'Turn on full auto: no questions, no confirmation waits, self-verified changes',
    // Tooltip while the host state is still loading
    loading: 'Reading the full auto state…',
    // Tooltip when no conversation exists yet
    unavailable: 'The conversation is not ready; cannot switch yet',
    // Failure tooltip prefix followed by the host error message
    toggleFailed: 'Switching full auto failed',
  },
}
