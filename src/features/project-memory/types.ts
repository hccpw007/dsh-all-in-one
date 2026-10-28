/**
 * 「项目记忆」的客户端与宿主共用模型。
 *
 * 记忆文件的位置与格式与 Claude Code 一致，因此把记忆根目录指向
 * `~/.claude/projects` 时，dsh 与 Claude Code 读写的是同一套文件。
 */

/** 记忆设置文档，持久化为 `$DSH_HOME/all-in-one/project-memory.json`。 */
export interface MemorySettings {
  /** 是否启用项目记忆。 */
  enabled: boolean
  /** 记忆根目录；空字符串表示使用插件默认目录。 */
  root: string
}

/** 设置页看到的完整状态：包含解析后的实际目录，便于用户确认记忆落在哪里。 */
export interface MemorySettingsPayload extends MemorySettings {
  /** 根目录解析后的绝对路径；根目录非法时回退为默认目录。 */
  effectiveRoot: string
  /** 默认根目录，供界面展示与「恢复默认」。 */
  defaultRoot: string
  /** 设置文件路径，便于用户定位与备份。 */
  settingsPath: string
}

/** 设置页的写入请求：只提交发生变化的字段。 */
export interface MemorySettingsRequest {
  enabled?: boolean
  root?: string
}
