/**
 * 「复制工作区路径」的客户端扩展。
 *
 * 开关打开时向宿主菜单服务注册一个工作区菜单项（行上的右键与「更多」按钮
 * 打开的是同一个菜单），点击把该工作区在宿主机上的绝对路径写入剪贴板并给出
 * 成功提示；开关关闭时不注册任何东西，菜单保持宿主原样。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { CopyPathIcon } from './copy-icon'
import { COPY_PATH_ICON_KEY, registerCopyPathMenu } from './copy-path'
import { readCopyWorkspacePathEnabled } from './storage'

/** 菜单图标插槽：宿主按贡献项的 `icon.key` 在这里取渲染组件。 */
const ICON_SLOT = 'contextMenu.icon'

/**
 * 注册菜单项与它的图标。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature key 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  if (!readCopyWorkspacePathEnabled()) return

  // 图标单独注册：图标插槽不可用时菜单项仍会出现，只是没有图标，不影响复制
  ctx.slots.inject(ICON_SLOT, () =>
    ctx.slots.register({ name: ICON_SLOT, key: COPY_PATH_ICON_KEY }, CopyPathIcon),
  )

  // 菜单服务缺失时只跳过菜单入口，设置页的开关仍可正常使用
  ctx.inject(['contextMenus'], (scoped) => {
    const contextMenus = scoped.contextMenus
    if (contextMenus === undefined) return

    ctx.effect(
      () => registerCopyPathMenu(contextMenus, t),
      'copy-workspace-path: workspace menu',
    )
  })
}
