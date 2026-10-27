/**
 * Feature 注册表。
 *
 * Feature 定义契约（详见 src/features/demo/index.jsx）：
 *   id            string   唯一标识，同时用作渲染 key
 *   title         string   网格卡片标题
 *   description   string   网格卡片描述
 *   page          function React 组件，在外壳内渲染该功能页面
 *   icon          function 可选，返回图标的 React 组件
 *   order         number   可选，网格排序权重，越小越靠前，默认 100
 */

/**
 * 校验并排序 feature 列表，产出只读注册表。
 *
 * 非法条目（缺少 id 或 page、id 重复）会被跳过，避免单个功能出错拖垮整页。
 */
export function createFeatureRegistry(list) {
  const seen = new Set()
  const features = []

  for (const feature of list) {
    if (!feature || typeof feature.id !== 'string' || feature.id === '') continue
    if (typeof feature.page !== 'function') continue
    if (seen.has(feature.id)) continue

    seen.add(feature.id)
    features.push(feature)
  }

  features.sort((a, b) => (a.order ?? 100) - (b.order ?? 100))

  return {
    /** 通过校验的 feature，按 order 升序。 */
    list: features,
    /** 按 id 查找，未注册时返回 undefined。 */
    find(id) {
      return features.find((feature) => feature.id === id)
    },
  }
}
