/**
 * 功能页头部操作区的共享上下文。
 *
 * 功能页的操作按钮（如保存）需要与外壳的返回按钮排在同一行，页面自身无法渲染到
 * 那个位置，因此由外壳提供 setter，功能页把自己的按钮挂进去。
 */
import { createContext } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

/** 功能页向外壳头部右侧投放操作节点的 setter；不在外壳内时为 null。 */
export const PageActionsContext = createContext<Dispatch<SetStateAction<ReactNode>> | null>(null)
