/**
 * 从侧边栏「更多」菜单直达 All In One 设置页。
 *
 * 宿主只提供「设置」这一个菜单入口，设置内的分区由弹窗左侧导航切换，没有对外导航 API。
 * 这里沿宿主自己的路径走：先选中菜单里的「设置」打开弹窗，再按分区名认领导航行点进去。
 * 宿主改动菜单或弹窗结构时，最坏情况是停在设置首页，不影响插件其它功能。
 */

/** 宿主菜单里「设置」项的文案：设置项末尾带快捷键提示，匹配时只看开头。 */
const SETTINGS_LABELS = ['设置', 'Settings']

/** 本插件在设置导航里的分区名，中英文一致（由 entry.tsx 的 `shell.navTitle` 提供）。 */
const SECTION_LABEL = 'All In One'

/** 设置弹窗与导航行的重试次数：宿主在点击后的下一帧挂载弹窗，导航随后渲染。 */
const MAX_ATTEMPTS = 10

/**
 * 在已打开的宿主菜单里找「设置」项。
 * @returns 设置入口按钮；菜单未展开时返回 null
 */
function findSettingsItem(): HTMLElement | null {
  const items = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"]')).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  )

  const matched = items.find((item) => {
    const text = (item.textContent ?? '').trim()
    return SETTINGS_LABELS.some((label) => text.startsWith(label))
  })

  // 界面语言不在上面的列表里时退回宿主菜单首项：账户菜单固定以「设置」开头
  return matched ?? items[0] ?? null
}

/**
 * 在设置弹窗的左侧导航里点开本插件分区。
 * @param attempt 当前尝试次数，弹窗晚一帧挂载时重试
 */
function clickSection(attempt: number): void {
  const row = Array.from(document.querySelectorAll('[role="dialog"] nav button')).find(
    (node) => (node.textContent ?? '').trim() === SECTION_LABEL,
  )

  if (row instanceof HTMLElement) {
    row.click()
    return
  }

  if (attempt < MAX_ATTEMPTS) {
    window.requestAnimationFrame(() => clickSection(attempt + 1))
    return
  }

  console.error('[sidebar-more] 设置导航缺少 All In One 分区，无法直达对应页面')
}

/**
 * 打开设置弹窗并切到 All In One 分区。
 *
 * 必须由菜单项的点击回调直接调用：宿主选中「设置」项时会自行关闭账户菜单，
 * 因此不能在调用前收起菜单，否则设置项已随菜单卸载、点击不再生效。
 */
export function openAllInOneSection(): void {
  const settingsItem = findSettingsItem()
  if (settingsItem === null) {
    console.error('[sidebar-more] 找不到宿主「设置」菜单项，无法打开 All In One')
    return
  }

  settingsItem.click()
  window.requestAnimationFrame(() => clickSection(1))
}
