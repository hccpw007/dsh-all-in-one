/**
 * 「项目记忆」的运行期状态：开关与根目录、以及每个项目的记忆目录。
 *
 * 提示词装配、记忆工具与设置接口都从这里取「当前该用哪个目录」，
 * 避免三处各自解析根目录而出现不一致。
 */
import { readMemorySettings } from './settings'
import { defaultMemoryRoot, projectMemoryDir, resolveMemoryRoot } from './paths'

/**
 * 是否启用项目记忆。
 * @returns 开关打开且根目录可用时返回 true
 */
function memoryEnabled(): boolean {
  const settings = readMemorySettings()
  if (!settings.enabled) return false

  return resolveMemoryRoot(settings.root) !== undefined
}

/**
 * 解析当前生效的记忆根目录：用户配置可用时用它，否则回退默认目录。
 * @returns 绝对路径
 */
function effectiveMemoryRoot(): string {
  const settings = readMemorySettings()

  return resolveMemoryRoot(settings.root) ?? defaultMemoryRoot()
}

/**
 * 取某个项目的工作目录对应的记忆目录。
 * @param projectDirectory 会话所属项目的绝对路径
 * @returns 记忆目录；功能关闭时返回 undefined
 */
export function memoryDirForSession(projectDirectory: string): string | undefined {
  if (!memoryEnabled()) return undefined

  return projectMemoryDir(effectiveMemoryRoot(), projectDirectory)
}
