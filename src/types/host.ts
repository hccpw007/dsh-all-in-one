/**
 * 宿主侧插件 API 的最小类型声明。
 *
 * 宿主只提供运行时代码，这里按本插件实际用到的能力声明，
 * 避免在业务代码里散落 `any`。
 */

/** index.html 注入行；本插件只使用 head 里的内联脚本。 */
export interface IndexInjectRow {
  kind: 'script'
  placement: 'head'
  text: string
}

/** `webserver/index-inject` 的事件负载：按顺序写入 index.html 的行表。 */
export type IndexInjectTable = IndexInjectRow[]

/** 宿主侧插件上下文：只声明本插件实际依赖的能力。 */
export interface HostPluginContext {
  /** 注册随插件生命周期自动清理的副作用，回调返回清理函数。 */
  effect(effect: () => () => void, label?: string): void
  /** 订阅 index.html 注入事件，返回取消订阅函数。 */
  on(event: 'webserver/index-inject', listener: (table: IndexInjectTable) => void): () => void
}
