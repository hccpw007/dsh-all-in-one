import type { FeatureLocales } from '../../shell/registry'

/** 「项目记忆」的中英文文案；key 由外壳统一加 `project-memory.` 前缀。 */
export const projectMemoryLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '项目记忆',
    // 开关用途说明：说明打开后记忆会写入文件，并在对话开始时进入上下文
    description: '让对话记住项目约定与偏好，记忆写入文件并在之后的对话里自动带上。',
    // 读取设置失败时的提示，卡片仍显示为关闭
    loadFailed: '读取设置失败，请检查宿主是否已加载本插件。',
    // 保存开关状态失败时的提示
    saveFailed: '保存失败',
    // 记忆路径页面标题
    pathTitle: '记忆路径',
    // 路径输入框标签
    pathLabel: '记忆根目录',
    // 路径输入框占位提示
    pathPlaceholder: '~/.claude/projects',
    // 说明根目录的用途与默认值
    pathHint:
      '每个项目在根目录下有一个独立子目录，记忆文件与 Claude Code 完全一致。填 ~/.claude/projects 即可与 Claude Code 共用同一套记忆；留空使用插件默认目录。',
    // 当前实际使用的目录
    effectivePath: '当前使用',
    // 默认目录标签
    defaultPath: '默认目录',
    // 设置文件的存放位置
    settingsFile: '设置文件',
    // 路径不合法时的提示
    pathInvalid: '路径需要是绝对路径，或以 ~/ 开头。',
    // 装饰性说明：记忆文件名规则
    namingHint: '记忆名只允许小写字母、数字与连字符，例如 dsh-plugin-project。',
    // 页面里的保存按钮
    save: '保存',
    // 保存进行中的按钮文字
    saving: '保存中',
    // 恢复默认目录的按钮
    reset: '恢复默认',
    // 保存成功后的提示
    saved: '已保存',
  },
  en: {
    // Switch title
    title: 'Project memory',
    // Switch description: memories are written to files and injected into later conversations
    description: 'Remembers project conventions and preferences in files that are loaded into later conversations.',
    // Shown when settings cannot be read
    loadFailed: 'Could not read settings. Check that the host loaded this plugin.',
    // Shown when the switch state cannot be saved
    saveFailed: 'Could not save',
    // Memory path page title
    pathTitle: 'Memory path',
    // Label of the root path input
    pathLabel: 'Memory root',
    // Placeholder of the root path input
    pathPlaceholder: '~/.claude/projects',
    // Explains the root directory and its default
    pathHint:
      'Each project gets its own subdirectory under the root, with the same files Claude Code uses. Point it at ~/.claude/projects to share one set of memories; leave empty to use the plugin default.',
    // Currently effective directory
    effectivePath: 'In use',
    // Label of the default directory
    defaultPath: 'Default',
    // Where the settings file lives
    settingsFile: 'Settings file',
    // Shown for an unusable path
    pathInvalid: 'The path must be absolute or start with ~/.',
    // Naming rule for memory files
    namingHint: 'Memory names allow lowercase letters, digits and hyphens, e.g. dsh-plugin-project.',
    // Save button on the page
    save: 'Save',
    // Button text while saving
    saving: 'Saving',
    // Button that restores the default directory
    reset: 'Use default',
    // Shown after the settings are saved
    saved: 'Saved',
  },
}
