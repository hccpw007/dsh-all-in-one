/**
 * 定制功能的宿主侧实现。
 *
 * 插件能力全部在浏览器端：`./client.js` 向设置的 `settings.section` 插槽
 * 注册「定制功能」页面。宿主侧无需任何服务，因此这里保持空实现。
 *
 * 宿主按 package.json 的 exports 直接加载根目录 index.js（JS），
 * 源码放在这里，由 build.ts 产出同名产物。
 */

/** 宿主加载插件时调用；本插件无宿主能力，无需初始化任何服务。 */
export function apply(): void {}
