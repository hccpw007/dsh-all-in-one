import type { FeatureLocales } from '../../shell/registry'

/** 「会话图片预览」开关的中英文文案；key 由外壳统一加 `image-preview.` 前缀。 */
export const imagePreviewLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '会话图片预览',
    // 开关用途说明：解释打开后会话里的哪些内容会出现预览，并点明只读
    description: '本地图片地址下方直接显示预览，只读取文件，不改动任何内容。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
  },
  en: {
    // Switch title
    title: 'Inline image preview',
    // Switch description explaining what gets previewed and that files stay untouched
    description: 'Show previews under local image paths. Files are only read, never changed.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
  },
}
