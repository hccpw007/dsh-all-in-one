/**
 * 「全自动执行」用到的数据类型。
 *
 * 开关按会话保存在宿主磁盘上：提示词注入与询问应答都发生在宿主侧，浏览器端
 * 只负责读写当前会话的开关，因此两端共用同一份字段名。
 */

/** 新会话默认状态的来源。 */
export type AutoRunDefaultMode = 'off' | 'on' | 'last' | 'workspace'

/**
 * 宿主侧持久化的全自动配置。
 *
 * 按会话记录最近一次显式写入的状态；没有记录的会话按 `defaultMode` 求值，
 * 因此「默认开」这类策略不必在设置页出现时就批量展开成真实会话。
 */
export interface AutoRunSettings {
  /** 每个会话最近一次显式开关；对象键顺序即写入顺序，用于裁剪最旧记录。 */
  sessions: Record<string, boolean>
  /** 每个工作空间最近一次的全自动状态，「工作空间」模式的取值来源。 */
  workspaces: Record<string, boolean>
  /** 新会话缺省状态来源。 */
  defaultMode: AutoRunDefaultMode
  /** 最近一次显式写入的状态，「上一次」模式的取值来源。 */
  lastEnabled: boolean
  /** 最近一次清理失效记录的时间（毫秒时间戳）；0 表示还没清理过。 */
  lastPrunedAt: number
}

/** 输入框开关的读取结果。 */
export interface AutoRunState {
  /** 当前会话处于全自动模式（显式记录或按默认值求值）。 */
  enabled: boolean
  /** 结果是否来自显式记录；false 表示由默认值策略求值得到。 */
  explicit: boolean
}

/** 设置页读取的配置摘要。 */
export interface AutoRunSettingsSummary {
  /** 新会话默认状态来源。 */
  defaultMode: AutoRunDefaultMode
  /** 显式开启的会话标识，供侧边栏标识批量读取。 */
  enabledSessions: string[]
}
