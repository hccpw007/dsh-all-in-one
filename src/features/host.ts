import type { FeatureHostExtension } from '../types/host'

import * as powerPack from './power-pack/host'
import * as expandProcess from './expand-process/host'
import * as deleteSession from './delete-session/host'
import * as projectMemory from './project-memory/host'
import * as autoCompact from './auto-compact/host'

/**
 * 所有 feature 提供的宿主侧扩展，由 src/index.ts 统一注册。
 *
 * 新增宿主能力时在对应 feature 目录内实现 host.ts，然后在这里追加它的导出；
 * 壳子只做聚合，不承载任何具体功能。
 */
export const featureHosts: FeatureHostExtension[] = [
  expandProcess,
  deleteSession,
  projectMemory,
  powerPack,
  autoCompact,
]
