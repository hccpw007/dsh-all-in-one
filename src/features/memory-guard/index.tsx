import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { memoryGuardLocales } from './locales'
import { MemoryGuardToggle } from './toggle'

/**
 * 「内存守护」的注册定义。
 *
 * 开关型功能没有独立页面：卡片上直接给出开关、检查间隔、重建阈值、实时读数
 * 与两个手动按钮。定时检查由客户端扩展常驻安装，重建只触发页面重载，
 * 不触碰宿主进程与会话数据。
 */
const memoryGuardFeature: FeatureDefinition = {
  id: 'memory-guard',
  group: 'config',
  order: 40,
  switch: MemoryGuardToggle,
  client: { apply: applyClient },
  locales: memoryGuardLocales,
}

export default memoryGuardFeature
