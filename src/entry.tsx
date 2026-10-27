/**
 * 浏览器端入口：把「定制功能」页面注册进设置的 section 插槽。
 *
 * 由 build.ts 打包并包裹成 ModuleLoader 的工厂函数，React 来自宿主模块表。
 */
import React from 'react'

import cssText from '../.build/styles.css'
import iconSvg from '../icon.svg'
import { collectFeatureLocales, mergeDictionaries } from './common/locale'
import { registry } from './features/registry'
import { CustomFeaturesPage } from './shell/CustomFeaturesPage'
import { installSettingsNavIcon } from './shell/settings-nav-icon'
import type { ClientPlugin, PluginContext } from './types/plugin'

/** 语言命名空间，与插件的其它字典互不干扰。 */
const LOCALE_NAMESPACE = 'custom-features'

/** 外壳自身的界面文案；feature 文案由各功能自带的 locales 提供。 */
const SHELL_DICTIONARIES: Record<string, Record<string, string>> = {
  zh: {
    // 设置左侧导航项名称
    'shell.navTitle': '定制功能',
    // 页面主标题
    'shell.pageTitle': '定制功能',
    // 页面说明，解释这一页的用途
    'shell.pageDescription': '所有独立的小工具都收拢在这里，点击卡片进入对应的功能。',
    // 尚未注册任何功能时的空态提示
    'shell.empty': '还没有注册任何功能，在 src/features 下新建文件夹即可添加。',
    // 从功能页面返回功能网格的按钮文案
    'shell.back': '返回',
  },
  en: {
    // Settings navigation entry label
    'shell.navTitle': 'Custom Features',
    // Page heading
    'shell.pageTitle': 'Custom Features',
    // Page description explaining the purpose of this section
    'shell.pageDescription': 'Every standalone tool lives here. Pick a card to open it.',
    // Empty state shown when no feature is registered
    'shell.empty': 'No features registered yet. Add a folder under src/features.',
    // Button that leaves a feature page and returns to the grid
    'shell.back': 'Back',
  },
}

/** 外壳字典与全部 feature 字典的合并结果；feature key 已带 id 前缀，不会互相覆盖。 */
const LOCALE_DICTIONARIES = mergeDictionaries(
  SHELL_DICTIONARIES,
  collectFeatureLocales(registry.list),
)

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

    // 宿主插槽不提供导航图标，按导航标签认领本插件那一行后替换成插件图标
    installSettingsNavIcon(ctx, t, iconSvg)

    // 页面组件持有翻译函数，语言切换后重新渲染即读取新文案
    const SettingsSection = () => <CustomFeaturesPage t={t} />

    // 注册设置页：id 独立于宿主既有页面，order 让它在 Agent 预设之后
    ctx.slots.inject('settings.section', () =>
      ctx.slots.register(
        {
          name: 'settings.section',
          id: 'custom-features',
          order: 30,
          label: () => t('shell.navTitle'),
        },
        SettingsSection,
      ),
    )
  },
}

export default plugin
