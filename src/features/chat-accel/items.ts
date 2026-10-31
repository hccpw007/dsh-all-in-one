/**
 * 「对话加速」的可勾选条目清单。
 *
 * 条目来自 dsh 的性能诊断结论与用户勾选。这里只保存稳定标识、推荐值、可选项参数
 * 与在当前宿主版本上能否真实生效；名称、说明、收益与风险文案放在 locales.ts。
 *
 * 宿主把工具、持久化与客户端打包在 app.asar 内，插件层拿不到对应接口，
 * 因此 2/7/8/9 四条标记为不可用：页面照常展示原因，但不允许勾选。
 */

/** 条目附带的数值参数：勾选后在条目下方出现输入框。 */
export interface AccelField {
  /** 允许的最小值。 */
  min: number
  /** 允许的最大值。 */
  max: number
  /** 初始值，也是输入非法时的回退值。 */
  defaultValue: number
}

/** 一条可勾选的优化条目。 */
export interface AccelItem {
  /** 稳定标识，同时作为文案 key 前缀与设置里的开关名。 */
  id: string
  /** 推荐值 0–100，页面按它换算星级并倒序排列。 */
  score: number
  /** 当前宿主版本上能否真实生效；false 时页面只展示、不可勾选。 */
  available: boolean
  /** 可选的数值参数；没有参数的条目不渲染输入框。 */
  field?: AccelField
}

/** 全部可勾选条目：页面按推荐值从高到低展示，序号为下标加一。 */
export const ACCEL_ITEMS: AccelItem[] = [
  { id: 'parallelPrompt', score: 95, available: true },
  { id: 'connectionKeepalive', score: 75, available: false },
  { id: 'batchRead', score: 60, available: true },
  { id: 'batchEdit', score: 60, available: true },
  // 裁剪阈值建议值来自实测：默认 8192 字符，降到 4096 更早回收旧结果
  {
    id: 'toolResultPrune',
    score: 60,
    available: true,
    field: { min: 512, max: 16384, defaultValue: 4096 },
  },
  { id: 'readonlyConcurrency', score: 55, available: true },
  { id: 'streamFrameCoalesce', score: 50, available: false },
  { id: 'logBatch', score: 35, available: false },
  { id: 'zstdLevel', score: 35, available: false },
].sort((left, right) => right.score - left.score)

/** 全部条目 id，用作设置文件的白名单，避免历史配置里的旧 id 一直残留。 */
export const ACCEL_ITEM_IDS: string[] = ACCEL_ITEMS.map((item) => item.id)

/**
 * 把 0–100 的推荐值换算成 0–5 星。
 *
 * 每 10 分半星、20 分整星，向下取到半星而不是四舍五入：
 * 推荐值本身是估算，宁可少给半星也不要虚高。95 分及以上视为满星，
 * 避免最高档条目显示成 4.5 星造成误解。
 * @param score 条目推荐值
 * @returns 星数，取值为 0、0.5、1 … 5
 */
export function scoreToStars(score: number): number {
  if (score >= 95) return 5

  return Math.floor(score / 10) / 2
}
