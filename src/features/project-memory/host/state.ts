/**
 * 「项目记忆」的运行期状态：开关与根目录、以及每个项目的记忆目录。
 *
 * 提示词装配、记忆工具与设置接口都从这里取「当前该用哪个目录」，
 * 避免三处各自解析根目录而出现不一致。
 */
import { readMemorySettings } from './settings'
import { projectMemoryDir, resolveMemoryRoot } from './paths'

/**
 * 解析当前生效的记忆根目录。
 *
 * 一次读取同时得到「是否启用」与「根目录」：此前分成两次读设置，每次装配提示词
 * 都要多走一遍缓存查找；功能关闭时也不该再为索引指纹 stat 文件。
 * @returns 记忆根目录；功能关闭或配置的根目录不可用时返回 undefined
 */
function activeMemoryRoot(): string | undefined {
  const settings = readMemorySettings()
  if (!settings.enabled) return undefined

  // 用户填了无法解析的路径时按「未启用」处理（与原有行为一致），不静默改用默认目录
  return resolveMemoryRoot(settings.root)
}

/**
 * 取某个项目的工作目录对应的记忆目录。
 * @param projectDirectory 会话所属项目的绝对路径
 * @returns 记忆目录；功能关闭时返回 undefined
 */
export function memoryDirForSession(projectDirectory: string): string | undefined {
  const root = activeMemoryRoot()
  if (root === undefined) return undefined

  return projectMemoryDir(root, projectDirectory)
}
