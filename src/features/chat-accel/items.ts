/**
 * 「对话加速」的可勾选条目清单。
 *
 * 条目来自 dsh 的性能诊断结论与用户勾选，只保留插件层能真正带来收益的部分：
 * 连接保活、流式合帧、日志批量写入、压缩级别这四条需要宿主内部接口，做不出实际效果；
 * 「一次读多个文件」虽然能实现，但模型本来就常在同一步并发发多个 read，批量入口用不上。
 * 它们都已从清单移除，不再占位。
 *
 * 名称、说明、收益与风险文案放在 locales.ts。
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
  /** 可选的数值参数；没有参数的条目不渲染输入框。 */
  field?: AccelField
}

/** 全部可勾选条目：页面按推荐值从高到低展示，序号为下标加一。 */
export const ACCEL_ITEMS: AccelItem[] = [
  { id: 'parallelPrompt', score: 95 },
  { id: 'batchEdit', score: 60 },
  // 裁剪阈值建议值来自实测：默认 8192 字符，降到 4096 更早回收旧结果
  {
    id: 'toolResultPrune',
    score: 60,
    field: { min: 512, max: 16384, defaultValue: 4096 },
  },
  { id: 'readonlyConcurrency', score: 55 },
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
