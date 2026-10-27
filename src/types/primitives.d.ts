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
}
