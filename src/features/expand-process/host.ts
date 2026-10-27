/**
 * 「展开过程」的宿主侧扩展。
 *
 * 把引导脚本注入 index.html 的 <head> 最前面：脚本在客户端模块系统启动前
 * 接管 `window.__ModuleLoader__`，按开关状态决定「思考」与「运行命令」是否默认展开。
 */
import type { HostPluginContext, IndexInjectTable } from '../../types/host'
import { EXPAND_PROCESS_SCRIPT } from './expand-process'

/** 需要 Web 服务器的 index.html 注入通道；服务缺失时本扩展不生效。 */
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
