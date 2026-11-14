/**
 * 「内存守护」的客户端扩展。
 *
 * 定时器必须常驻：用户不会为了等一次回收而停在设置页，所以无论开关状态都要
 * 安装，开关只决定每次检查时是否真的执行动作。这样卡片上拨开开关立刻生效，
 * 不需要刷新页面。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { installMemoryGuard } from './guard'

/**
 * 安装定时检查与手动操作面。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  // 会话列表用来判断「是否有任务在跑」；服务缺失时 guard 会把状态按「忙」处理
  ctx.inject(['sessions'], (scoped) => {
    const sessions = scoped.sessions

    ctx.effect(() => {
      const handle = installMemoryGuard(t, sessions)

      return () => handle.dispose()
    }, 'memory-guard: timer')
  })
}
