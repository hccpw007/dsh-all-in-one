import type { FeatureLocales } from '../../shell/registry'

/** 「上下文详情」的中英文文案；key 由外壳统一加 `context-inspect.` 前缀。 */
export const contextInspectLocales: FeatureLocales = {
  zh: {
    // 开关标题：点击上下文气泡里的系统提示词与工具定义可查看详情
    title: '上下文详情',
    // 开关用途说明：点明入口位置、展示内容与只读，控制在两行以内
    description: '点上下文气泡里的提示词与工具定义可查看实际内容，只读。',
    // 开关状态写入失败时的提示
    saveFailed: '保存开关状态失败，请检查浏览器存储权限。',
    // 系统提示词行的悬停提示
    systemHint: '查看当前系统提示词',
    // 工具定义行的悬停提示
    toolsHint: '查看当前工具定义',
    // 对话消息行的悬停提示
    messagesHint: '查看当前对话消息',
    // 详情窗口标题
    dialogTitle: '上下文详情',
    // 详情窗口的数据来源说明
    dialogHint: '内容取自本会话最近一次请求，只读',
    // 「系统提示词」页签
    tabSystem: '系统提示词',
    // 「工具定义」页签
    tabTools: '工具定义',
    // 「对话消息」页签
    tabMessages: '对话消息',
    // 读取中的占位提示
    loading: '正在读取…',
    // 读取失败的提示前缀，后面接宿主返回的原因
    loadFailed: '读取失败：',
    // 失败后的重试按钮
    retry: '重试',
    // 手动刷新按钮
    refresh: '刷新',
    // 复制按钮
    copy: '复制',
    // 复制成功后的按钮反馈
    copied: '已复制',
    // 关闭窗口按钮
    close: '关闭',
    // 会话还没有系统提示词时的说明
    emptySystem: '本会话还没有发起过请求，暂时没有系统提示词。',
    // 会话还没有工具定义时的说明
    emptyTools: '本会话还没有发起过请求，暂时没有工具定义。',
    // 会话还没有对话消息时的说明
    emptyMessages: '本会话还没有发起过请求，暂时没有对话消息。',
    // 定位不到当前会话时的说明
    noSession: '没有找到当前打开的会话，请先进入一条对话再试。',
    // 更新时间前缀
    updatedAt: '更新于',
    // 工具数量模板
    toolCount: '共 {count} 个工具',
    // 字符数模板
    charCount: '{count} 个字符',
    // 单个工具的参数数量模板
    paramCount: '{count} 个参数',
    // 对话消息数量模板
    messageCount: '共 {count} 条消息',
    // 消息被截断时的说明模板
    messagesTruncated: '仅显示最近 {count} 条',
    // 「用户」角色标签
    roleUser: '用户',
    // 「助手」角色标签
    roleAssistant: '助手',
    // 「工具」角色标签
    roleTool: '工具',
    // 「开发」角色标签：模型看到的工具声明等内部消息
    roleDeveloper: '声明',
    // 工具没有说明文字时的占位
    noDescription: '（无说明）',
  },
  en: {
    // Switch title: clicking the system prompt and tool definition rows opens details
    title: 'Context details',
    // Switch description naming the entry point, the shown content and the read-only promise, kept within two lines
    description: 'Click the prompt or tool rows in the context bubble; read-only.',
    // Shown when the switch state cannot be persisted
    saveFailed: 'Could not save the switch state. Check browser storage permissions.',
    // Hover hint of the system prompt row
    systemHint: 'Show the current system prompt',
    // Hover hint of the tool definition row
    toolsHint: 'Show the current tool definitions',
    // Hover hint of the conversation messages row
    messagesHint: 'Show the current conversation messages',
    // Title of the details dialog
    dialogTitle: 'Context details',
    // Subtitle naming where the content comes from
    dialogHint: 'Taken from this session’s latest request. Read-only.',
    // Tab showing the system prompt
    tabSystem: 'System prompt',
    // Tab showing the tool definitions
    tabTools: 'Tool definitions',
    // Tab showing the conversation messages
    tabMessages: 'Messages',
    // Placeholder while reading
    loading: 'Loading…',
    // Failure prefix followed by the host-provided reason
    loadFailed: 'Could not load: ',
    // Retry button after a failure
    retry: 'Retry',
    // Manual refresh button
    refresh: 'Refresh',
    // Copy button
    copy: 'Copy',
    // Feedback after copying
    copied: 'Copied',
    // Close button
    close: 'Close',
    // Shown when the session has no system prompt yet
    emptySystem: 'This session has not sent a request yet, so there is no system prompt.',
    // Shown when the session has no tool definitions yet
    emptyTools: 'This session has not sent a request yet, so there are no tool definitions.',
    // Shown when the session has no conversation messages yet
    emptyMessages: 'This session has not sent a request yet, so there are no messages.',
    // Shown when no open session can be located
    noSession: 'No open session found. Open a conversation first.',
    // Update-time prefix
    updatedAt: 'Updated',
    // Tool count template
    toolCount: '{count} tools',
    // Character count template
    charCount: '{count} characters',
    // Parameter count template for one tool
    paramCount: '{count} params',
    // Message count template
    messageCount: '{count} messages',
    // Shown when older messages are omitted
    messagesTruncated: 'showing the latest {count}',
    // Role label for user messages
    roleUser: 'User',
    // Role label for assistant messages
    roleAssistant: 'Assistant',
    // Role label for tool results
    roleTool: 'Tool',
    // Role label for developer messages (tool declarations)
    roleDeveloper: 'Decl',
    // Placeholder for a tool without a description
    noDescription: '(no description)',
  },
}
