/**
 * 项目记忆的读写。
 *
 * 目录结构与文件格式与 Claude Code 保持一致，两边可以共用同一套记忆：
 *
 * ```
 * <根目录>/<项目 slug>/memory/
 *   MEMORY.md              # 索引：一行一条 `- [标题](文件.md) — 摘要`
 *   <name>.md              # 单条记忆：frontmatter + 正文
 * ```
 *
 * 单条记忆的 frontmatter 沿用 Claude Code 的字段：
 * `name` / `description` / `metadata.type`，类型取 user / feedback / project / reference。
 * 正文里用 `[[其它记忆名]]` 互相引用。
 */
import { mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { MEMORY_INDEX_FILE } from './paths'

/** 记忆类型白名单，与 Claude Code 一致。 */
export const MEMORY_TYPES = ['user', 'feedback', 'project', 'reference'] as const

/** 单条记忆的类型。 */
export type MemoryType = (typeof MEMORY_TYPES)[number]

/** 写入一条记忆所需的内容。 */
export interface MemoryInput {
  /** 记忆名，kebab-case，同时决定文件名。 */
  name: string
  /** 一句话摘要，用于索引与召回判断。 */
  description: string
  /** 记忆类型；省略时按 project 处理。 */
  type?: MemoryType
  /** 记忆正文（不含 frontmatter）。 */
  content: string
}

/** 一条已读入的记忆。 */
export interface MemoryEntry {
  name: string
  description: string
  type: MemoryType
  content: string
}

/** 记忆名的合法字符集：会拼进文件名与 `[[链接]]`，只允许小写字母、数字与连字符。 */
const MEMORY_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * 判断记忆名是否合法。
 * @param name 记忆名
 * @returns 合法时返回 true
 */
export function isValidMemoryName(name: string): boolean {
  return MEMORY_NAME_PATTERN.test(name) && name.length <= 64
}

/**
 * 确保记忆目录存在。
 * @param dir 记忆目录
 */
function ensureMemoryDir(dir: string): void {
  mkdirSync(dir, { recursive: true })
}

/**
 * 读取索引文件内容；不存在时返回空串。
 * @param dir 记忆目录
 * @returns MEMORY.md 的内容
 */
export function readMemoryIndex(dir: string): string {
  try {
    return readFileSync(join(dir, MEMORY_INDEX_FILE), 'utf8')
  } catch (error) {
    // 首次使用或全新项目时索引不存在，属正常情况
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 读取记忆索引失败:', dir, error)
    }

    return ''
  }
}

/**
 * 原子写入索引文件，避免写入中断留下半份索引。
 * @param dir 记忆目录
 * @param text 新索引内容
 */
function writeMemoryIndex(dir: string, text: string): void {
  const file = join(dir, MEMORY_INDEX_FILE)
  const temp = `${file}.tmp`

  try {
    writeFileSync(temp, text, 'utf8')
    renameSync(temp, file)
  } catch (error) {
    console.error('[project-memory] 写入记忆索引失败:', file, error)
    throw error
  }
}

/**
 * 列出目录里的记忆文件；只认 `.md`，且排除索引文件。
 * @param dir 记忆目录
 * @returns 记忆文件名，按字典序
 */
function listMemoryFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((file) => file.endsWith('.md') && file !== MEMORY_INDEX_FILE)
      .sort()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 列出记忆文件失败:', dir, error)
    }

    return []
  }
}

/**
 * 解析一条记忆文件的 frontmatter。
 *
 * 只认 Claude Code 使用的三个字段，其余内容原样留在正文里，不因为本插件而丢失。
 * @param file 记忆文件名，作为缺省 name
 * @param text 文件全文
 * @returns 解析结果
 */
function parseMemoryFile(file: string, text: string): MemoryEntry {
  const fallback: MemoryEntry = {
    name: file.replace(/\.md$/, ''),
    description: '',
    type: 'project',
    content: text,
  }

  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (match === null) return fallback

  const body = text.slice(match[0].length).replace(/^\r?\n/, '')
  const fields: Record<string, string> = {}

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator <= 0) continue

    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }

  const type = MEMORY_TYPES.find((item) => item === fields['type']) ?? 'project'

  return {
    name: fields['name'] || fallback.name,
    description: fields['description'] ?? '',
    type,
    content: body,
  }
}

/**
 * 读入全部记忆；文件损坏时跳过该条并保留日志，不影响其它记忆。
 * @param dir 记忆目录
 * @returns 记忆列表
 */
export function readMemories(dir: string): MemoryEntry[] {
  const entries: MemoryEntry[] = []

  for (const file of listMemoryFiles(dir)) {
    try {
      entries.push(parseMemoryFile(file, readFileSync(join(dir, file), 'utf8')))
    } catch (error) {
      console.error('[project-memory] 读取记忆文件失败:', file, error)
    }
  }

  return entries
}

/**
 * 读取单条记忆。
 * @param dir 记忆目录
 * @param name 记忆名
 * @returns 记忆；不存在时返回 undefined
 */
export function readMemory(dir: string, name: string): MemoryEntry | undefined {
  if (!isValidMemoryName(name)) return undefined

  const file = `${name}.md`

  try {
    return parseMemoryFile(file, readFileSync(join(dir, file), 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 读取记忆失败:', file, error)
    }

    return undefined
  }
}

/**
 * 索引里指向某个记忆文件的那一行：`- [标题](名字.md) — 摘要`，与 Claude Code 一致。
 * @param title 索引行标题，通常与记忆名相同
 * @param name 记忆名，决定链接目标
 * @param description 摘要
 * @returns 单行文本
 */
function indexLine(title: string, name: string, description: string): string {
  return `- [${title}](${name}.md) — ${description}`
}

/**
 * 把一条记忆写进索引：已有同名行则更新摘要，否则追加。
 *
 * 已有行保留原标题：标题是自由文本（可能与 Claude Code 写入的中文标题一致），
 * 而本工具只提供 name 与 description，用 slug 覆盖会丢掉更有意义的标题。
 * @param index 现有索引内容
 * @param name 记忆名
 * @param description 摘要
 * @returns 新索引内容
 */
function upsertIndexLine(index: string, name: string, description: string): string {
  const pattern = new RegExp(`^- \\[([^\\]]*)\\]\\(${name}\\.md\\).*$`, 'm')
  const existing = pattern.exec(index)

  if (existing !== null) {
    const title = existing[1] === '' ? name : existing[1]
    return index.replace(pattern, indexLine(title, name, description))
  }

  const trimmed = index.replace(/\s+$/, '')
  return `${trimmed === '' ? '' : `${trimmed}\n`}${indexLine(name, name, description)}\n`
}

/**
 * 从索引里移除某个记忆对应的行。
 * @param index 现有索引内容
 * @param name 记忆名
 * @returns 新索引内容
 */
function removeIndexLine(index: string, name: string): string {
  const pattern = new RegExp(`^- \\[[^\\]]*\\]\\(${name}\\.md\\).*\\r?\\n?`, 'gm')
  return index.replace(pattern, '')
}

/**
 * 读取已有记忆的 frontmatter，保留本次写入不重建的字段。
 *
 * Claude Code 还会在 `metadata` 下写入 `originSessionId` 等溯源字段；覆盖同一条记忆时
 * 直接重写整个 frontmatter 会把这些字段抹掉。这里只替换 `name` / `description` 与
 * `metadata.type` / `metadata.modified`，其余行原样保留：metadata 之外的顶层字段置于
 * 新 metadata 之前，metadata 内的其它子项跟随在新 metadata 之后（YAML 顶层顺序无语义）。
 * @param dir 记忆目录
 * @param name 记忆名
 * @returns `before` 为新 metadata 之前的字段行，`after` 为其后保留的子项行
 */
function preservedFrontmatter(dir: string, name: string): {
  before: string[]
  after: string[]
} {
  const result = { before: [] as string[], after: [] as string[] }
  let text: string

  try {
    text = readFileSync(join(dir, `${name}.md`), 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 读取待更新记忆失败:', name, error)
    }

    return result
  }

  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
  if (match === null) return result

  // 遇到 metadata 之前的顶层字段放在前面，metadata 里保留下来的子项跟随新 metadata 之后
  let insideMetadata = false

  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === '') continue

    // 缩进行是上一个键的子项
    if (/^\s/.test(line)) {
      if (insideMetadata) {
        // type 与 modified 由本次写入重新生成，其余 metadata 子项保留
        if (!/^\s+(type|modified):/.test(line)) result.after.push(line)
      } else {
        result.before.push(line)
      }
      continue
    }

    const separator = line.indexOf(':')
    if (separator <= 0) continue

    const key = line.slice(0, separator).trim()
    insideMetadata = key === 'metadata'
    if (!insideMetadata && key !== 'name' && key !== 'description') result.before.push(line)
  }

  return result
}

/**
 * 写入一条记忆（新增或覆盖）并同步索引。
 *
 * 文件名与索引行都由记忆名与摘要生成，因此重名写入等价于更新该条记忆，
 * 索引不会出现重复行或指向不存在文件的行。已有记忆的其它 frontmatter 字段
 * 原样保留，保证与 Claude Code 写出的文件互不破坏。
 * @param dir 记忆目录
 * @param input 记忆内容
 * @returns 写入后的记忆文件路径
 */
export function writeMemory(dir: string, input: MemoryInput): string {
  if (!isValidMemoryName(input.name)) {
    throw new Error(`记忆名不合法：${input.name}（只允许小写字母、数字与连字符）`)
  }

  const description = input.description.trim()
  if (description === '') throw new Error('记忆摘要不能为空')

  const type = input.type ?? 'project'
  if (!MEMORY_TYPES.includes(type)) throw new Error(`记忆类型不合法：${type}`)

  ensureMemoryDir(dir)

  const file = join(dir, `${input.name}.md`)
  const preserved = preservedFrontmatter(dir, input.name)
  const text = [
    '---',
    `name: ${input.name}`,
    `description: ${description}`,
    ...preserved.before,
    'metadata:',
    `  type: ${type}`,
    `  modified: ${new Date().toISOString()}`,
    ...preserved.after,
    '---',
    '',
    input.content.trim(),
    '',
  ].join('\n')

  try {
    writeFileSync(`${file}.tmp`, text, 'utf8')
    renameSync(`${file}.tmp`, file)
  } catch (error) {
    console.error('[project-memory] 写入记忆失败:', file, error)
    throw error
  }

  writeMemoryIndex(dir, upsertIndexLine(readMemoryIndex(dir), input.name, description))

  return file
}

/**
 * 删除一条记忆及其索引行。
 * @param dir 记忆目录
 * @param name 记忆名
 * @returns 是否确实删除了文件
 */
export function deleteMemory(dir: string, name: string): boolean {
  if (!isValidMemoryName(name)) return false

  const file = join(dir, `${name}.md`)

  try {
    unlinkSync(file)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // 文件已不存在：仍清掉索引行，避免索引指向空文件
      writeMemoryIndex(dir, removeIndexLine(readMemoryIndex(dir), name))

      return false
    }

    console.error('[project-memory] 删除记忆失败:', file, error)
    throw error
  }

  writeMemoryIndex(dir, removeIndexLine(readMemoryIndex(dir), name))

  return true
}

/**
 * 把记忆索引渲染成注入提示词的文本。
 *
 * 只注入 `MEMORY.md`：索引里每条记忆一行，足以判断「哪条可能相关」，正文由模型在
 * 需要时用 memory 工具按名读取。这与 Claude Code 一致——记忆可以持续增长，而每轮请求
 * 的上下文不能被全部正文占满。
 * @param dir 记忆目录
 * @param index 索引内容
 * @returns 注入文本；没有索引时也给出目录与用法，让模型知道可以新增记忆
 */
export function renderMemoryIndex(dir: string, index: string): string {
  const parts: string[] = [
    '# 项目记忆',
    '',
    `记忆目录：${dir}`,
    '本项目的记忆按「一条一个文件」放在该目录，下面是 MEMORY.md 索引；每一行对应一条记忆。',
    '索引只给概要，需要某条记忆的全文时用 memory 工具 action=read 读取（action=list 可列出全部）。',
    '记忆是本项目多个会话共享的背景事实，与当前用户指令冲突时以用户指令为准；发现有误时更新或删除对应条目，不要照搬。',
    '',
  ]

  parts.push(index.trim() === '' ? '（当前还没有记忆。）' : index.trim())

  return parts.join('\n')
}

/**
 * 记忆索引的变更指纹：`MEMORY.md` 的 mtime 与大小。
 *
 * 提示词每次装配都要注入索引，靠指纹跳过没变化时的重复文件读取。
 * 只看索引：记忆正文不在上下文里，它单独变化不影响注入内容。
 * @param dir 记忆目录
 * @returns 指纹字符串；索引不存在时返回空串
 */
export function memoryIndexFingerprint(dir: string): string {
  try {
    const index = statSync(join(dir, MEMORY_INDEX_FILE))

    return `${dir}|${index.mtimeMs}|${index.size}`
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[project-memory] 读取记忆索引状态失败:', dir, error)
    }

    return ''
  }
}
