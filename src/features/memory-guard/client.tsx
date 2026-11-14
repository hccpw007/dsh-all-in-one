/**
 * 「内存守护」的客户端扩展。
 *
 * 定时器必须常驻：用户不会为了等一次回收而停在设置页，所以无论开关状态都要
 * 安装，开关只决定每次检查时是否真的执行动作。这样卡片上拨开开关立刻生效，
 * 不需要刷新页面。
 *
 * 判定材料全部来自页面自身（交互时间、焦点、输入框），不依赖宿主服务；因此这里
 * 直接安装，不需要 `ctx.inject`，也少了一个「服务缺失就不工作」的失败点。
 */
import type { PluginContext, Translate } from '../../types/plugin'
import { installMemoryGuard } from './guard'

/**
 * 安装定时检查与手动操作面。
 * @param ctx 客户端插件上下文
 * @param t 已绑定本 feature 前缀的翻译函数
 */
export function apply(ctx: PluginContext, t: Translate): void {
  ctx.effect(() => {
    const handle = installMemoryGuard(t)

    return () => handle.dispose()
  }, 'memory-guard: timer')
}
