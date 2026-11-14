/**
 * 宿主 UI primitives 的最小类型声明。
 *
 * 宿主只发布运行时代码，这里按本插件实际用到的组件声明形状，
 * 避免在业务代码里散落 `any`。
 */
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type { ComponentType, ReactNode } from 'react'

  /** 菜单项：id 用于选中与回调，label 决定渲染内容。 */
  export interface MenuItem {
    id: string
    label: ReactNode
  }

  /** 宿主菜单组件的属性，与 ui-agent-preset 的用法一致。 */
  export interface MenuProps {
    open: boolean
    onClose(): void
    items: MenuItem[]
    /** 当前选中项，菜单会在该项右侧显示勾选。 */
    selectedId?: string
    onSelect(id: string): void
    align?: 'start' | 'end'
    /** 渲染到 body 的 portal，避免被 hero 行裁剪。 */
    portal?: boolean
    className?: string
    /** 触发菜单的按钮或元素。 */
    anchor: ReactNode
  }

  export const Menu: ComponentType<MenuProps>

  /** 宿主模态弹窗的属性，与 ui-workspace 的归档确认弹窗用法一致。 */
  export interface ModalProps {
    open: boolean
    onClose(): void
    /** 关闭按钮的可访问名称。 */
    closeLabel?: string
    title?: ReactNode
    description?: ReactNode
    /** 底部操作区，通常是取消与确认按钮。 */
    footer?: ReactNode
    children?: ReactNode
    /**
     * 只在卡片里渲染 children，不画宿主默认的标题、关闭按钮与内边距；
     * 遮罩、Esc、焦点陷阱与 aria-label 仍然由弹窗负责。
     */
    headless?: boolean
    /** 追加到卡片上的类名，用来覆盖默认的确认框宽度。 */
    className?: string
  }

  export const Modal: ComponentType<ModalProps>

  /** 宿主 Agent 预设图标。 */
  export const IconAgentPresetOutlineRegular: ComponentType<{
    className?: string
    size?: number
  }>

  /** 宿主下拉箭头图标。 */
  export const IconChevronDownOutlineRegular: ComponentType<{
    className?: string
    size?: number
  }>

  /** 宿主新会话图标：气泡中一个加号（medium 1.3px 描边，与输入框工具按钮同档）。 */
  export const IconNewChatOutlineMedium: ComponentType<{
    className?: string
    size?: number
  }>
}
