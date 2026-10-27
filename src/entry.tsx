/**
 * 浏览器端入口：把「定制功能」页面注册进设置的 section 插槽。
 *
 * 由 build.ts 打包并包裹成 ModuleLoader 的工厂函数，React 来自宿主模块表。
 */
import React from 'react'

import cssText from '../.build/styles.css'
import { CustomFeaturesPage } from './shell/CustomFeaturesPage'
import type { ClientPlugin, PluginContext } from './types/plugin'

/** 语言命名空间，与插件的其它字典互不干扰。 */
const LOCALE_NAMESPACE = 'custom-features'

/** 外壳用到的全部界面文案。 */
const LOCALE_DICTIONARIES: Record<string, Record<string, string>> = {
  zh: {
    // 设置左侧导航项名称
    'nav.title': '定制功能',
    // 页面主标题
    'page.title': '定制功能',
    // 页面说明，解释这一页的用途
    'page.description': '所有独立的小工具都收拢在这里，点击卡片进入对应的功能。',
    // 尚未注册任何功能时的空态提示
    'page.empty': '还没有注册任何功能，在 src/features 下新建文件夹即可添加。',
    // 从功能页面返回功能网格的按钮文案
    'action.back': '返回',
  },
  en: {
    // Settings navigation entry label
    'nav.title': 'Custom Features',
    // Page heading
    'page.title': 'Custom Features',
    // Page description explaining the purpose of this section
    'page.description': 'Every standalone tool lives here. Pick a card to open it.',
    // Empty state shown when no feature is registered
    'page.empty': 'No features registered yet. Add a folder under src/features.',
    // Button that leaves a feature page and returns to the grid
    'action.back': 'Back',
  },
}

/** 客户端插件定义：依赖 slots 与 locale 两个宿主服务。 */
const plugin: ClientPlugin = {
  inject: ['slots', 'locale'],

  apply(ctx: PluginContext) {
    // 样式随插件生命周期注入和移除，不向宿主留下全局副作用
    ctx.effect(() => {
      const style = document.createElement('style')
      style.setAttribute('data-dsh-plugin', 'custom-features')
      style.textContent = cssText
      document.head.appendChild(style)
      return () => style.remove()
    })

    // 字典随插件卸载一并注销，避免残留同名命名空间
    ctx.effect(() => {
      const disposers = Object.entries(LOCALE_DICTIONARIES).map(([locale, dictionary]) =>
        ctx.locale.register(LOCALE_NAMESPACE, locale, dictionary),
      )
      return () => disposers.forEach((dispose) => dispose())
    })

    const t = ctx.locale.bind(LOCALE_NAMESPACE)

    // 页面组件持有翻译函数，语言切换后重新渲染即读取新文案
    const SettingsSection = () => <CustomFeaturesPage t={t} />

    // 注册设置页：id 独立于宿主既有页面，order 让它在 Agent 预设之后
    ctx.slots.inject('settings.section', () =>
      ctx.slots.register(
        {
          name: 'settings.section',
          id: 'custom-features',
          order: 30,
          label: () => t('nav.title'),
        },
        SettingsSection,
      ),
    )
  },
}

export default plugin
