/**
 * 关键路径的轻量耗时埋点。
 *
 * 性能改动必须能给出前后数字，否则无法判断是否真的变快。这里默认不输出
 * 任何内容，只有设置 `DSH_ALL_IN_ONE_PERF=1` 时记录；埋点只包在请求级与
 * 扫描级的函数外层，不在每帧或每个元素上调用。
 */

/**
 * 是否开启性能日志。
 * @returns 环境变量为 `1` 时返回 true
 */
export function perfEnabled(): boolean {
  return process.env.DSH_ALL_IN_ONE_PERF === '1'
}

/**
 * 记录一次耗时。
 * @param label 指标名
 * @param startedAt `performance.now()` 的起始值
 * @param detail 附带的规模信息（文件数、字节数、命中数等）
 */
export function logPerf(
  label: string,
  startedAt: number,
  detail?: Record<string, number | string>,
): void {
  if (!perfEnabled()) return

  const duration = Math.round((performance.now() - startedAt) * 100) / 100
  const suffix = detail === undefined ? '' : ` ${JSON.stringify(detail)}`
  console.info(`[all-in-one:perf] ${label} ${duration}ms${suffix}`)
}
