/**
 * 宿主客户端 API 的最小类型声明。
 *
 * 宿主包只发布运行时代码，没有对外类型，这里按本插件实际用到的能力声明，
 * 避免在业务代码里散落 `any`。
 */
import type { ComponentType } from 'react'

/** 宿主注入的翻译函数，按语言包 key 取当前语言的文案。 */
export type Translate = (key: string) => string

/** 宿主 locale 服务：本插件只用到注册字典与绑定命名空间。 */
export interface LocaleApi {
  /** 注册某命名空间的语言字典，返回注销函数。 */
  register(namespace: string, locale: string, dictionary: Record<string, string>): () => void
  /** 绑定命名空间，得到只查该命名空间的翻译函数。 */
  bind(namespace: string): Translate
}

/** 设置页插槽的注册描述，label 决定左侧导航项的名称。 */
export interface SlotDescriptor {
  name: string
  id: string
  order?: number
  label?: () => string
}

/** 宿主 slot 服务：插槽就绪时执行工厂并注册组件。 */
export interface SlotsApi {
  /** 在插槽可用后执行工厂，返回的注销函数随插件卸载调用。 */
  inject(slot: string, factory: () => () => void): void
  /** 把组件注册进插槽，返回注销函数。 */
  register(descriptor: SlotDescriptor, component: ComponentType): () => void
}

/** 插件上下文：只声明本插件实际依赖的宿主能力。 */
export interface PluginContext {
  /** 注册随插件生命周期自动清理的副作用，回调返回清理函数。 */
  effect(effect: () => () => void, label?: string): void
  locale: LocaleApi
  slots: SlotsApi
}

/** 客户端插件定义，作为 ModuleLoader 工厂的默认导出。 */
export interface ClientPlugin {
  inject: string[]
  apply(ctx: PluginContext): void
}
