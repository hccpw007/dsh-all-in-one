import type { ComponentType } from 'react'

import type { LocaleDictionaries } from '../common/locale'
import type { Translate } from '../types/plugin'

/** feature 页面收到的 props。 */
export interface FeaturePageProps {
  /** 已绑定本 feature key 前缀的翻译函数，页面内直接用 `sectionTitle` 这类短 key。 */
  t: Translate
}

/** feature 自带语言包：按语言分组，key 不含 feature id 前缀，注册时由外壳统一加。 */
export type FeatureLocales = LocaleDictionaries

/**
 * Feature 定义契约，新增功能的模板结构见 src/features/demo/：
 *   id                string   唯一标识，同时作为语言 key 前缀与渲染 key
 *   titleKey          string   网格卡片标题的语言 key（相对本 feature 字典）
 *   descriptionKey    string   网格卡片描述的语言 key（相对本 feature 字典）
 *   page              function React 组件，在外壳内渲染该功能页面
 *   icon              function 可选，返回图标的 React 组件
 *   order             number   可选，网格排序权重，越小越靠前，默认 100
 *   locales           object   本功能的中英文文案，外壳统一注册，新增功能无需改外壳
 */
export interface FeatureDefinition {
  id: string
  titleKey: string
  descriptionKey: string
  page: ComponentType<FeaturePageProps>
  icon?: ComponentType
  order?: number
  locales: FeatureLocales
}

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
 * locales 缺失会让卡片文案取不到值，因此与 id/page 一同视为无效定义。
 */
function isFeatureDefinition(value: unknown): value is FeatureDefinition {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Partial<FeatureDefinition>

  return (
    typeof candidate.id === 'string' &&
    candidate.id !== '' &&
    typeof candidate.titleKey === 'string' &&
    typeof candidate.descriptionKey === 'string' &&
    typeof candidate.page === 'function' &&
    typeof candidate.locales === 'object' &&
    candidate.locales !== null
  )
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
