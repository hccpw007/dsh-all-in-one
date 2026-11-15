import type { FeatureLocales } from '../../shell/registry'

/** 「图片直接预览」开关的中英文文案；key 由外壳统一加 `image-preview.` 前缀。 */
export const imagePreviewLocales: FeatureLocales = {
  zh: {
    // 开关标题：消息里的本地图片是否直接显示预览
    title: '图片直接预览',
    // 开关用途说明：点明预览覆盖的图片来源（本地路径与附件库）与点开可缩放，控制在两行以内
    description: '本地图片与附件库图片在原处显示预览，点开可缩放。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 放大层的无障碍名称，读屏软件据此说明当前是图片查看对话框
    lightboxDialog: '查看图片',
    // 放大层右上角关闭按钮的名称
    lightboxClose: '关闭',
    // 放大层工具栏的放大按钮名称
    zoomIn: '放大',
    // 放大层工具栏的缩小按钮名称
    zoomOut: '缩小',
    // 放大层工具栏的「适应窗口」按钮名称，点击后整图收进窗口
    fitWindow: '适应窗口',
    // 放大层工具栏的「原始大小」按钮名称，点击后按 1:1 像素显示
    actualSize: '原始大小',
    // 放大层的图片读取失败提示
    loadFailed: '图片读取失败',
  },
  en: {
    // Switch title
    title: 'Inline image preview',
    // Switch description naming both image sources (local paths, attachment library) and click-to-zoom, kept within two lines
    description: 'Show local and attachment images inline; click to zoom.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Accessible name of the zoom layer dialog
    lightboxDialog: 'Image preview',
    // Name of the close button in the top-right corner of the zoom layer
    lightboxClose: 'Close',
    // Name of the zoom-in button in the zoom layer toolbar
    zoomIn: 'Zoom in',
    // Name of the zoom-out button in the zoom layer toolbar
    zoomOut: 'Zoom out',
    // Name of the fit-to-window button in the zoom layer toolbar
    fitWindow: 'Fit',
    // Name of the actual-size button in the zoom layer toolbar
    actualSize: 'Actual size',
    // Shown when the image cannot be loaded in the zoom layer
    loadFailed: 'Could not load the image',
  },
}
