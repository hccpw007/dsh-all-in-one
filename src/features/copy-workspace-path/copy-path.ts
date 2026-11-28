/**
 * 工作区菜单里的「复制路径」。
 *
 * 宿主把工作区行的右键与「更多」按钮统一到菜单服务（`contextMenus`）：
 * 打开菜单时按点击对象收集各插件注册的贡献项，点击对象自带该工作区的绝对
 * 路径，因此这里既不读侧边栏 DOM，也不受宿主菜单结构变化影响。
 */
import type { ContextMenusApi, Translate } from '../../types/plugin'

/** 贡献 id：宿主在同一 target 内按 id 去重，重复注册会被拒绝。 */
const CONTRIBUTION_ID = 'all-in-one.copy-workspace-path'

/** 图标 key：宿主按它在 `contextMenu.icon` 插槽里找渲染组件。 */
export const COPY_PATH_ICON_KEY = 'copy-workspace-path.copy'

/** 菜单项 id。 */
const ACTION_ID = 'copy-path'

/** 菜单位置：宿主「在文件夹中显示」之后、「删除工作区」（300，自带分隔线）之前。 */
const MENU_ORDER = 250

/**
 * 把文本写入系统剪贴板。
 * @param text 要复制的路径
 */
async function writeClipboard(text: string): Promise<void> {
  // 非安全上下文没有剪贴板 API：直接抛出，由宿主用 failureLabel 提示用户
  if (navigator.clipboard === undefined) {
    throw new Error('当前环境没有剪贴板 API')
  }

  await navigator.clipboard.writeText(text)
}

/**
 * 注册「复制路径」菜单项。
 * @param contextMenus 宿主菜单服务
 * @param t 已绑定本 feature key 前缀的翻译函数
 * @returns 清理函数：注销该贡献
 */
export function registerCopyPathMenu(contextMenus: ContextMenusApi, t: Translate): () => void {
  return contextMenus.register({
    id: CONTRIBUTION_ID,
    target: 'workspace',
    order: MENU_ORDER,
    resolve: (target) => [{
      id: ACTION_ID,
      label: t('copyPath'),
      icon: { key: COPY_PATH_ICON_KEY },
      failureLabel: t('copyFailed'),
      run: async () => {
        try {
          await writeClipboard(target.path)
        } catch (error) {
          // 剪贴板写入可能被系统权限拒绝：保留原始错误，再把失败交给宿主提示
          console.error('[copy-workspace-path] 复制工作区路径失败:', target.path, error)
          throw error
        }

        contextMenus.notify(t('copied'), true)
      },
    }],
  })
}
