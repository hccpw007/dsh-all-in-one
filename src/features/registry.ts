import { featureList } from './index'
import { createFeatureRegistry } from '../shell/registry'

/**
 * 全插件共享的 feature 注册表；列表在构建期确定，运行期不再变化。
 *
 * 单独成文件供外壳页面与入口共用，避免两处各自创建注册表导致校验结果不一致。
 */
export const registry = createFeatureRegistry(featureList)
