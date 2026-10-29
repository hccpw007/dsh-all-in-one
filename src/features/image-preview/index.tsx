import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { imagePreviewLocales } from './locales'
import { ImagePreviewToggle } from './toggle'

/**
 * 「会话图片预览」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后客户端扩展在会话区域
 * 扫描本地图片地址并在下方插入预览。
 */
const imagePreviewFeature: FeatureDefinition = {
  id: 'image-preview',
  order: 15,
  switch: ImagePreviewToggle,
  client: { apply: applyClient },
  locales: imagePreviewLocales,
}

export default imagePreviewFeature
