import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { deleteSessionLocales } from './locales'
import { DeleteSessionToggle } from './toggle'

/**
 * 「删除会话」开关的注册定义。
 *
 * 开关型 feature 没有独立页面：网格里是开关，打开后会话列表的悬停操作区
 * 多出一个删除按钮、工作区菜单（「更多」按钮与右键）多出「删除所有会话」
 * （由 client 扩展注册进宿主插槽与上下文菜单），同时收起宿主的归档入口与
 * 工作区删除入口。
 */
const deleteSessionFeature: FeatureDefinition = {
  id: 'delete-session',
  group: 'toggle',
  order: 80,
  reloadsPage: true,
  switch: DeleteSessionToggle,
  client: { apply: applyClient },
  locales: deleteSessionLocales,
}

export default deleteSessionFeature
