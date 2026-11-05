/**
 * 技能包读取链路的只读缓存。
 *
 * 打开设置页、切一次会话、保存一次配置都会重新组装整份负载；其中技能目录扫描与
 * 已装插件产物扫描是「准启动级」的重活（实测单次 50–200ms，随插件数与工具名数
 * 增长）。数据本身变化很慢，用短 TTL 缓存吸收重复请求，并对同一 key 的并发读取
 * 做 in-flight 合并，避免同时打开多个入口时重复扫同一份目录。
 */

/** 缓存条目的有效期上限：键空间是 profile × 包名，正常规模远小于该值。 */
const MAX_ENTRIES = 64

/** 一个缓存值。 */
interface CacheEntry<T> {
  value: T
  /** 失效时间戳（毫秒）。 */
  expiresAt: number
}

/** 按 key 读取的缓存接口。 */
export interface ReadCache<T> {
  /**
   * 读取一个 key。
   * @param key 缓存键
   * @param load 未命中时的加载函数
   * @param force 跳过缓存直接重新加载
   */
  read(key: string, load: () => Promise<T>, force?: boolean): Promise<T>
  /** 让全部条目失效。 */
  clear(): void
}

/**
 * 创建一个读取缓存。
 * @param ttlMs 值的有效期
 * @returns 缓存接口
 */
export function createReadCache<T>(ttlMs: number): ReadCache<T> {
  const entries = new Map<string, CacheEntry<T>>()
  const inflight = new Map<string, Promise<T>>()

  /** 淘汰最早插入的条目，避免键空间异常增长。 */
  const evict = (): void => {
    while (entries.size > MAX_ENTRIES) {
      const oldest = entries.keys().next()
      if (oldest.done) return
      entries.delete(oldest.value)
    }
  }

  const read = (key: string, load: () => Promise<T>, force = false): Promise<T> => {
    const now = Date.now()
    if (!force) {
      const cached = entries.get(key)
      if (cached !== undefined && cached.expiresAt > now) return Promise.resolve(cached.value)

      // 同一 key 正在加载：复用同一次扫描，避免并发请求各扫一遍
      const running = inflight.get(key)
      if (running !== undefined) return running
    }

    const task = load()
      .then((value) => {
        entries.set(key, { value, expiresAt: Date.now() + ttlMs })
        evict()

        return value
      })
      .finally(() => {
        if (inflight.get(key) === task) inflight.delete(key)
      })

    inflight.set(key, task)

    return task
  }

  return {
    read,
    clear: () => {
      entries.clear()
    },
  }
}
