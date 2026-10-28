/**
 * 「项目记忆」的目录解析。
 *
 * 记忆按项目隔离，目录结构与 Claude Code 完全相同：
 * `<根目录>/<项目路径 slug>/memory`，索引文件 `MEMORY.md` 就放在该目录内。
 * 因此把根目录指向 `~/.claude/projects`，两边的记忆即可互相看到。
 */
import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'

import { resolveDshHome } from '../../../common/dsh-home'

/** 记忆索引文件名，与 Claude Code 一致。 */
export const MEMORY_INDEX_FILE = 'MEMORY.md'

/**
 * 默认记忆根目录：放在插件自己的数据目录下，不与其它工具混用。
 * @returns `$DSH_HOME/all-in-one/projects`
 */
export function defaultMemoryRoot(): string {
  return join(resolveDshHome(), 'all-in-one', 'projects')
}

/**
 * 把用户填写的根目录展开成绝对路径。
 *
 * 允许 `~` 开头（用户常直接粘贴 `~/.claude/projects`）；留空回落到默认目录。
 * @param root 用户配置的根目录
 * @returns 绝对路径；既不是绝对路径也无法展开时返回 undefined
 */
export function resolveMemoryRoot(root: string): string | undefined {
  const trimmed = root.trim()
  if (trimmed === '') return defaultMemoryRoot()

  const expanded = trimmed === '~'
    ? homedir()
    : trimmed.startsWith('~/')
      ? join(homedir(), trimmed.slice(2))
      : trimmed

  return isAbsolute(expanded) ? resolve(expanded) : undefined
}

/**
 * 项目路径的目录名：非字母数字一律换成 `-`，与 Claude Code 的编码方式一致。
 * @param directory 项目工作目录的绝对路径
 * @returns 形如 `-Users-cpw-workspace-app` 的目录名
 */
export function projectSlug(directory: string): string {
  return resolve(directory).replace(/[^A-Za-z0-9]/g, '-')
}

/**
 * 某个项目对应的记忆目录。
 * @param root 已解析的记忆根目录
 * @param projectDirectory 项目工作目录
 * @returns `<root>/<slug>/memory`
 */
export function projectMemoryDir(root: string, projectDirectory: string): string {
  return join(root, projectSlug(projectDirectory), 'memory')
}
