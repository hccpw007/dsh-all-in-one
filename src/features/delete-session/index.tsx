import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { deleteSessionLocales } from './locales'
import { DeleteSessionToggle } from './toggle'

/**
 * 「删除会话」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后会话列表的悬停操作区
 * 多出一个删除按钮（由 client 扩展注册进宿主插槽）。
 */
const deleteSessionFeature: FeatureDefinition = {
  id: 'delete-session',
  order: 20,
  switch: DeleteSessionToggle,
  client: { apply: applyClient },
  locales: deleteSessionLocales,
}

export default deleteSessionFeature
