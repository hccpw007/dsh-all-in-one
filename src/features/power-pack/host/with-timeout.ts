/**
 * 给宿主侧的异步操作加一个可诊断的超时。
 *
 * 宿主的注册、挂载与压缩都可能长时间不 settle；没有超时时，一个挂起的 Promise
 * 会让调用方（会话创建、恢复、HTTP 请求）永久等待且没有任何日志。
 */

/**
 * 在限定时间内等待一个 Promise。
 * @param task 被等待的任务
 * @param ms 超时毫秒数
 * @param label 超时错误里显示的说明
 * @returns 任务结果
 */
export function withTimeout<T>(task: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} 超时（${ms}ms）`))
    }, ms)

    // 长间隔定时器不阻止进程退出；超时后任务本身仍会继续，由调用方丢弃结果
    if (typeof timer.unref === 'function') timer.unref()

    task.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}
