import type { FeatureDefinition } from '../../shell/registry'
import { apply as applyClient } from './client'
import { MemoryGuardEntry } from './entry'
import { memoryGuardLocales } from './locales'
import { MemoryGuardPage } from './page'

/**
 * 「内存守护」的注册定义。
 *
 * 页面型功能：网格卡片给出开关、两行说明与设置入口，间隔、阈值、实时读数与手动
 * 按钮都在设置页里。定时检查由客户端扩展常驻安装，重建只触发页面重载，
 * 不触碰宿主进程与会话数据。
 */
const memoryGuardFeature: FeatureDefinition = {
  id: 'memory-guard',
  group: 'page',
  order: 30,
  entry: MemoryGuardEntry,
  page: MemoryGuardPage,
  client: { apply: applyClient },
  locales: memoryGuardLocales,
}

export default memoryGuardFeature
