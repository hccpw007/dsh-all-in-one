/**
 * 从会话记录中提取每轮用户输入。
 *
 * 宿主的会话正文保存在 `<DSH_HOME>/sessions/<工作区>/<会话>/session.v4.jsonl.zstd`：
 * 每行一个事件，用户输入记录在 `agent/inbox/spliced` 的 `role: "user"` 项里。
 * 这里只读文件、只取纯文本，并把它压成单行，供导航条旁展示。
 *
 * 只在客户端请求时读取：会话记录随对话增长，不能在插件启动时扫描。
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { zstdDecompressSync } from 'node:zlib'

import { resolveDshHome } from '../../../common/dsh-home'
import type { TurnInput } from '../types'

/** 会话记录文件名，与宿主的持久化格式绑定。 */
const SESSION_FILE = 'session.v4.jsonl.zstd'

/** 单个会话记录的体积上限；超过说明不是普通会话，跳过读取。 */
const MAX_SESSION_FILE_BYTES = 16 * 1024 * 1024

/** 单轮文本的最大长度，导航条旁只放得下一行。 */
const MAX_TEXT_LENGTH = 120

/** 会话 id 形态：宿主用 `session-<uuid>`，限定字符集避免拼出目录穿越。 */
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]+$/

/** zstd 帧起始魔数；会话记录是追加写的，文件里由多个独立帧拼接而成。 */
const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd])

/**
 * 解压整份会话记录。
 *
 * 宿主持续追加写入，每个检查点都是一帧独立的 zstd 数据；Node 的解压 API
 * 只处理第一帧，直接调用只能读到最初几行事件。这里按魔数切帧逐帧解压再拼接。
 * @param buffer 压缩文件内容
 * @returns 解压后的文本字节；没有任何有效帧时为空 Buffer
 */
function decompressSession(buffer: Buffer): Buffer {
  const parts: Buffer[] = []
  let start = buffer.indexOf(ZSTD_MAGIC)

  while (start !== -1) {
    const next = buffer.indexOf(ZSTD_MAGIC, start + ZSTD_MAGIC.length)
    const end = next === -1 ? buffer.length : next

    try {
      parts.push(zstdDecompressSync(buffer.subarray(start, end)))
    } catch (error) {
      // 记录尾部可能正在写入，坏帧跳过即可，前面的轮次仍然可用
      console.warn('[session-history] 跳过无法解压的会话记录帧:', error)
    }

    start = next
  }

  return Buffer.concat(parts)
}

/**
 * 判断值是否为可索引的普通对象。
 * @param value 待判定值
 * @returns 是对象且非 null 时返回 true
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 把任意文本收敛成单行并限长。
 * @param text 原始文本
 * @returns 单行文本
 */
function toSingleLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT_LENGTH)
}

/**
 * 定位会话记录文件。
 *
 * 会话目录按工作区分组（`sessions/<工作区 slug>/<会话 id>/`），工作区 slug 由
 * 项目路径生成，插件无从推断，只能逐个工作区目录探测。
 * @param sessionId 会话标识
 * @returns 记录文件绝对路径；找不到时返回 undefined
 */
async function findSessionFile(sessionId: string): Promise<string | undefined> {
  if (!SESSION_ID_PATTERN.test(sessionId)) return undefined

  const root = join(resolveDshHome(), 'sessions')
  let entries

  try {
    entries = await readdir(root, { withFileTypes: true })
  } catch (error) {
    console.error('[session-history] 读取会话根目录失败:', root, error)
    return undefined
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const file = join(root, entry.name, sessionId, SESSION_FILE)
    try {
      const info = await stat(file)
      if (info.isFile()) return file
    } catch (error) {
      // 该工作区下没有这条会话属正常情况，继续探测下一个工作区目录
      continue
    }
  }

  return undefined
}

/**
 * 解析一行事件，取出其中的用户输入文本。
 * @param line 一行 JSONL
 * @returns 单行文本；不是用户输入时返回 undefined
 */
function parseUserText(line: string): string | undefined {
  let event: unknown

  try {
    event = JSON.parse(line)
  } catch (error) {
    // 记录尾部可能被截断，坏行直接跳过，不影响其它轮次
    console.warn('[session-history] 跳过不是合法 JSON 的会话记录行:', error)
    return undefined
  }

  if (!isRecord(event) || event.type !== 'agent/inbox/spliced') return undefined

  const data = isRecord(event.data) ? event.data : undefined
  if (data === undefined || !Array.isArray(data.inserted)) return undefined

  const parts: string[] = []
  for (const item of data.inserted) {
    if (!isRecord(item) || item.role !== 'user') continue
    if (!Array.isArray(item.content)) continue

    for (const block of item.content) {
      if (!isRecord(block) || block.type !== 'text' || typeof block.text !== 'string') continue
      parts.push(block.text)
    }
  }

  if (parts.length === 0) return undefined

  const text = toSingleLine(parts.join(' '))
  return text === '' ? undefined : text
}

/**
 * 读取一条会话的每轮用户输入。
 * @param sessionId 会话标识
 * @returns 按出现顺序排列的输入；会话不存在或读取失败时为空数组
 */
export async function readTurnInputs(sessionId: string): Promise<TurnInput[]> {
  const file = await findSessionFile(sessionId)
  if (file === undefined) return []

  let raw: Buffer

  try {
    const info = await stat(file)
    if (info.size > MAX_SESSION_FILE_BYTES) {
      console.warn('[session-history] 会话记录超出体积上限，跳过读取:', file, info.size)
      return []
    }

    raw = decompressSession(await readFile(file))
  } catch (error) {
    console.error('[session-history] 读取会话记录失败:', file, error)
    return []
  }

  const inputs: TurnInput[] = []
  for (const line of raw.toString('utf8').split('\n')) {
    if (line === '') continue

    const text = parseUserText(line)
    if (text === undefined) continue

    inputs.push({ turn: inputs.length + 1, text })
  }

  return inputs
}
