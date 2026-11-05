/**
 * 用户级 JSON 设置的通用读写。
 *
 * 三个 feature（自动压缩、项目记忆、Cookie 清理）都需要同一套能力：按文件
 * mtime 缓存解析结果、原子写入、在最新设置上合并补丁。此前各写一份，容易在
 * 某一份里漏掉「写入后同步失效缓存」或「临时文件名冲突」这类细节；统一到这里后
 * 行为只有一套。
 *
 * 并发语义：读取与写入都是同步执行的，两者之间没有 await，Node 单线程下不会
 * 出现「A 读、B 读、A 写、B 写」的丢失更新。写入成功后内存态立即更新，后续读取
 * 直接用它，不必等下一次 stat。
 */
import { randomBytes } from 'node:crypto'
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * 外部改动的探测间隔。
 *
 * 本进程写入会立即更新缓存，因此这里只用于发现「别的进程改了同一份配置」。
 * 热路径（每步检查、每轮装配）因此最多每 30 秒 stat 一次。
 */
const EXTERNAL_RECHECK_MS = 30_000

/** 缓存的解析结果与文件状态。 */
interface SettingsCache<T> {
  mtimeMs: number
  size: number
  value: T
  /** 上次与磁盘核对的时间。 */
  checkedAt: number
}

/** 一个设置文件的读写接口。 */
export interface JsonSettingsStore<T> {
  /** 设置文件绝对路径。 */
  file(): string
  /** 读取当前设置；文件缺失或损坏时返回默认值。 */
  read(): T
  /** 原子写入整份设置，并立即更新内存态。 */
  write(next: T): void
  /** 在最新设置上合并补丁、落盘并返回结果。 */
  update(patch: unknown, applyPatch: (current: T, patch: unknown) => T): T
}

/** 建店参数。 */
export interface JsonSettingsOptions<T> {
  /** 设置文件绝对路径。 */
  file: () => string
  /** 校验并补全解析结果。 */
  normalize: (value: unknown) => T
  /** 默认设置；每次返回新对象，避免调用方改到共享引用。 */
  defaults: () => T
  /** 日志前缀，形如 `[auto-compact]`。 */
  label: string
}

/**
 * 判断错误是否为「文件不存在」。
 * @param error 捕获到的错误
 * @returns 只有 ENOENT 返回 true
 */
function isEnoent(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === 'ENOENT'
}

/**
 * 创建一个设置存储。
 * @param options 文件路径、规范化函数与日志前缀
 * @returns 读写接口
 */
export function createJsonSettingsStore<T>(options: JsonSettingsOptions<T>): JsonSettingsStore<T> {
  let cache: SettingsCache<T> | undefined

  /** 直接从磁盘读一次并规范化。 */
  const load = (): SettingsCache<T> => {
    const file = options.file()

    try {
      const info = statSync(file)
      const value = options.normalize(JSON.parse(readFileSync(file, 'utf8')) as unknown)

      return { mtimeMs: info.mtimeMs, size: info.size, value, checkedAt: Date.now() }
    } catch (error) {
      if (!isEnoent(error)) {
        console.error(`${options.label} 读取设置失败:`, file, error)
      }

      return { mtimeMs: 0, size: 0, value: options.defaults(), checkedAt: Date.now() }
    }
  }

  const read = (): T => {
    const now = Date.now()
    // 刚核对过磁盘：直接用内存态，热路径不再触碰文件系统
    if (cache !== undefined && now - cache.checkedAt < EXTERNAL_RECHECK_MS) return cache.value

    const file = options.file()

    try {
      const info = statSync(file)
      if (
        cache !== undefined &&
        cache.mtimeMs === info.mtimeMs &&
        cache.size === info.size
      ) {
        cache.checkedAt = now

        return cache.value
      }
    } catch (error) {
      if (isEnoent(error)) {
        // 文件不存在（首次运行或被外部删除）：缓存默认值，避免每次读取都 stat
        cache = { mtimeMs: 0, size: 0, value: options.defaults(), checkedAt: now }

        return cache.value
      }

      console.error(`${options.label} 检查设置文件失败:`, file, error)
      // 无法确认磁盘状态时沿用上次结果，没有则回退默认值
      return cache?.value ?? options.defaults()
    }

    cache = load()

    return cache.value
  }

  const write = (next: T): void => {
    const file = options.file()
    // 进程号 + 随机后缀：多个 profile 实例同时写同一份配置时不会互相覆盖临时文件
    const temp = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`

    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
      renameSync(temp, file)

      const info = statSync(file)
      cache = { mtimeMs: info.mtimeMs, size: info.size, value: next, checkedAt: Date.now() }
    } catch (error) {
      console.error(`${options.label} 写入设置失败:`, file, error)
      throw error
    }
  }

  const update = (patch: unknown, applyPatch: (current: T, patch: unknown) => T): T => {
    const next = applyPatch(read(), patch)
    write(next)

    return next
  }

  return { file: options.file, read, write, update }
}
