/**
 * 定制功能的宿主侧实现。
 *
 * 设置页与各功能都在浏览器端，宿主侧只做一件事：向 index.html 的 <head>
 * 最前面注入「展开过程」的引导脚本。脚本在客户端模块系统启动前接管
 * `window.__ModuleLoader__`，按开关状态决定「思考」与「运行命令」是否默认展开。
 *
 * 宿主按 package.json 的 exports 直接加载根目录 index.js（JS），
 * 源码放在这里，由 build.ts 产出同名产物。
 */
import { EXPAND_PROCESS_SCRIPT } from './common/expand-process'
import type { HostPluginContext, IndexInjectTable } from './types/host'

/** 需要 Web 服务器的 index.html 注入通道；服务缺失时插件不加载。 */
export const inject = ['webServer']

/**
 * 注册 index.html 注入行。
 *
 * 订阅者按激活顺序追加行；这里用 unshift 顶到最前，保证脚本先于客户端
 * 模块系统的队列脚本执行。
 * @param ctx 宿主插件上下文
 */
export function apply(ctx: HostPluginContext): void {
  ctx.effect(() =>
    ctx.on('webserver/index-inject', (table: IndexInjectTable) => {
      table.unshift({ kind: 'script', placement: 'head', text: EXPAND_PROCESS_SCRIPT })
    }),
  )
}
