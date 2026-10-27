import type { ComponentType } from 'react'

import type { LocaleDictionaries } from '../common/locale'
import type { PluginContext, Translate } from '../types/plugin'

/** feature 页面收到的 props。 */
export interface FeaturePageProps {
  /** 已绑定本 feature key 前缀的翻译函数，页面内直接用 `sectionTitle` 这类短 key。 */
  t: Translate
}

/** 网格入口组件收到的 props。 */
export interface FeatureEntryProps {
  /** 已绑定本 feature key 前缀的翻译函数。 */
  t: Translate
  /** 打开本功能；点击区域与交互形式由 feature 自行决定。 */
  open: () => void
}

/** 开关型入口组件收到的 props。 */
export interface FeatureSwitchProps {
  /** 已绑定本 feature key 前缀的翻译函数。 */
  t: Translate
}

/** feature 自带语言包：按语言分组，key 不含 feature id 前缀，注册时由外壳统一加。 */
export type FeatureLocales = LocaleDictionaries

/**
 * feature 的客户端扩展：除网格入口与功能页之外的宿主界面挂载点。
 *
 * 例如「技能包」需要在新会话界面注入选择器。扩展由外壳统一执行，
 * 依赖的服务由扩展在自己的 apply 里用 `ctx.inject` 按需声明，服务缺失时
 * 只跳过扩展，不影响设置页主体。
 */
export interface FeatureClientExtension {
  /** 注册本扩展；t 已绑定本 feature 的 key 前缀。 */
  apply(ctx: PluginContext, t: Translate): void
}

/** 所有 feature 共有的字段。 */
interface FeatureCommon {
  /** 唯一标识，同时作为语言 key 前缀与渲染 key，重复时只保留第一个。 */
  id: string
  /** 网格排序权重，越小越靠前，默认 100，相同权重保持注册顺序。 */
  order?: number
  /** 本功能的中英文文案，外壳统一加 id 前缀后注册。 */
  locales: FeatureLocales
  /** 网格与功能页之外的客户端扩展，可选。 */
  client?: FeatureClientExtension
}

/** 页面型 feature：网格入口打开一个功能页面。 */
export interface FeaturePageDefinition extends FeatureCommon {
  entry: ComponentType<FeatureEntryProps>
  page: ComponentType<FeaturePageProps>
}

/** 开关型 feature：在网格中直接渲染开关，没有独立页面。 */
export interface FeatureSwitchDefinition extends FeatureCommon {
  switch: ComponentType<FeatureSwitchProps>
}

/**
 * Feature 定义契约，新增功能的模板结构见 src/features/ 下的示例目录：
 *   id       string   唯一标识，同时作为语言 key 前缀与渲染 key
 *   locales  object   本功能的中英文文案，外壳统一注册，新增功能无需改外壳
 *   order    number   可选，网格排序权重，越小越靠前，默认 100
 *
 * 入口形态二选一：
 *   页面型  entry + page   网格入口由 feature 自行渲染，点击打开功能页
 *   开关型  switch         网格中直接渲染开关，无功能页
 */
export type FeatureDefinition = FeaturePageDefinition | FeatureSwitchDefinition

/** 只读注册表：通过校验的 feature 列表与按 id 查询能力。 */
export interface FeatureRegistry {
  /** 通过校验的 feature，按 order 升序。 */
  list: FeatureDefinition[]
  /** 按 id 查找，未注册时返回 undefined。 */
  find(id: string): FeatureDefinition | undefined
}

/** 未声明 order 的 feature 排在已声明者之后。 */
const DEFAULT_FEATURE_ORDER = 100

/**
 * 判定单条 feature 是否满足最小契约。
 *
 * 输入来自各功能文件夹的默认导出，可能漏写字段或写成非函数，先收窄再使用。
 * locales 缺失会让文案取不到值，因此与 id 一同视为必需字段；
 * 入口形态必须二选一：页面型需要 entry 与 page，开关型需要 switch。
 */
function isFeatureDefinition(value: unknown): value is FeatureDefinition {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as {
    id?: unknown
    locales?: unknown
    entry?: unknown
    page?: unknown
    switch?: unknown
    client?: unknown
  }

  if (typeof candidate.id !== 'string' || candidate.id === '') return false
  if (typeof candidate.locales !== 'object' || candidate.locales === null) return false

  // 客户端扩展是可选字段；一旦声明，apply 必须是函数，否则整页渲染会中断
  if (candidate.client !== undefined) {
    if (typeof candidate.client !== 'object' || candidate.client === null) return false
    if (typeof (candidate.client as { apply?: unknown }).apply !== 'function') return false
  }

  const hasPage = typeof candidate.entry === 'function' && typeof candidate.page === 'function'
  const hasSwitch = typeof candidate.switch === 'function'

  return hasPage || hasSwitch
}

/**
 * 校验并排序 feature 列表，产出只读注册表。
 *
 * 非法条目（缺少必需字段、id 重复）会被跳过，避免单个功能出错拖垮整页。
 * @param list 各功能文件夹默认导出的集合
 * @returns 按 order 升序的注册表
 */
export function createFeatureRegistry(list: readonly unknown[]): FeatureRegistry {
  const seen = new Set<string>()
  const features: FeatureDefinition[] = []

  // 逐条收窄并过滤非法定义，重复 id 只保留第一个
  for (const item of list) {
    if (!isFeatureDefinition(item)) continue
    if (seen.has(item.id)) continue

    seen.add(item.id)
    features.push(item)
  }

  // 权重相同时保持注册顺序，避免网格顺序随构建波动
  features.sort((a, b) => (a.order ?? DEFAULT_FEATURE_ORDER) - (b.order ?? DEFAULT_FEATURE_ORDER))

  return {
    list: features,
    find(id) {
      return features.find((feature) => feature.id === id)
    },
  }
}
