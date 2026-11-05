/**
 * All In One 的宿主侧入口。
 *
 * 壳子只负责装配：合并各 feature 的宿主服务依赖，并依次调用它们的 apply。
 * 具体能力（如「展开过程」的 index.html 注入）由 feature 目录内的 host.ts 实现。
 *
 * 宿主按 package.json 的 exports 直接加载根目录 index.js（JS），
 * 源码放在这里，由 build.ts 产出同名产物。
 */
import { featureHosts } from './features/host'
import type { HostPluginContext } from './types/host'

/** 合并全部 feature 的宿主服务依赖，去重后作为插件的 inject。 */
export const inject = Array.from(new Set(featureHosts.flatMap((feature) => feature.inject ?? [])))

/**
 * 宿主加载插件时调用：逐个执行 feature 的宿主扩展。
 *
 * 单个 feature 失败只影响它自己：任何异常都不得截断后续 feature 的注册，也不能
 * 冒泡到宿主插件加载器——那会让整个插件（含设置页）被判为加载失败。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  for (const feature of featureHosts) {
    try {
      feature.apply(ctx)
    } catch (error) {
      console.error('[all-in-one] 宿主扩展启动失败:', feature.id, error)
    }
  }
}
