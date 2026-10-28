/**
 * DSH 主目录解析。
 *
 * 多个 feature 都要在 `$DSH_HOME` 下读写自己的数据（技能包配置、会话目录等），
 * 解析规则必须与宿主一致：显式配置的 `DSH_HOME` 优先，否则回落到 `~/.dsh`。
 */
import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * 解析 DSH 主目录，与宿主一致：显式配置 → `$DSH_HOME` → `~/.dsh`。
 * @returns 主目录绝对路径
 */
export function resolveDshHome(): string {
  const configured = process.env.DSH_HOME?.trim()
  if (configured) return configured

  return join(homedir(), '.dsh')
}
