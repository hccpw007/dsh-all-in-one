import type { FeatureDefinition } from '../../shell/registry'
import { desktopCookieLocales } from './locales'
import { DesktopCookieToggle } from './toggle'

/**
 * 「桌面版 Cookie 清理」的注册定义。
 *
 * 开关型 feature 没有独立页面：卡片上的开关、阈值与保留条数就是全部配置，
 * 清理动作由宿主侧扩展在启动阶段执行。
 */
const desktopCookieFeature: FeatureDefinition = {
  id: 'desktop-cookie',
  group: 'config',
  order: 40,
  switch: DesktopCookieToggle,
  locales: desktopCookieLocales,
}

export default desktopCookieFeature
