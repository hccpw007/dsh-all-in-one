import type { FeatureLocales } from '../../shell/registry'

/** 「内存守护」的中英文文案；key 由外壳统一加 `memory-guard.` 前缀。 */
export const memoryGuardLocales: FeatureLocales = {
  zh: {
    // 开关标题
    title: '内存守护',
    // 检查间隔输入框的标签
    intervalLabel: '间隔',
    // 检查间隔输入框的单位
    intervalUnit: '分钟',
    // 重建阈值输入框的标签
    thresholdLabel: '阈值',
    // 重建阈值输入框的单位
    thresholdUnit: 'MB',
    // 上次轻量回收的时间与释放量
    lastReclaim: '上次回收 {time}',
    // 上次重建的时间
    lastRebuild: '上次重建 {time}',
    // 从未执行过时的占位
    never: '从未',
    // 手动触发轻量回收的按钮
    reclaimNow: '立即回收',
    // 手动触发重建的按钮
    rebuildNow: '立即重建',
    // 轻量回收执行中的按钮文案
    reclaiming: '回收中…',
    // 自动重建前的倒计时提示，占位符是剩余秒数
    noticeCountdown: '内存守护正在回收，{seconds} 秒后重建页面',
    // 倒计时提示上的取消按钮
    noticeCancel: '取消',
    // 距上次重建太近，跳过本次
    skipCooldown: '距上次重建不足两个检查周期，跳过本次',
    // 占用未超过阈值
    skipBelowThreshold: '占用未超过阈值，本次只做轻量回收',
    // 一次检查正在进行，手动重建需要等它结束
    busyChecking: '正在执行检查，请稍后再试',
    // 用户仍在操作
    skipActive: '仍在操作中，本次不重建',
    // 用户取消了自动重建
    skipCancelled: '已取消本次重建',
    // 操作面尚未装配（插件刚加载或已卸载）
    guardMissing: '内存守护尚未就绪，请刷新页面后重试',
    // 读取内存失败
    measureFailed: '读取内存占用失败',
    // 检查间隔超出范围时的提示
    intervalInvalid: '检查间隔需要是 1 到 120 之间的整数',
    // 重建阈值超出范围时的提示
    thresholdInvalid: '重建阈值需要是 200 到 8192 之间的整数',
  },
  en: {
    // Switch title
    title: 'Memory guard',
    // Label of the interval input
    intervalLabel: 'Interval',
    // Unit shown after the interval input
    intervalUnit: 'min',
    // Label of the rebuild threshold input
    thresholdLabel: 'Threshold',
    // Unit shown after the threshold input
    thresholdUnit: 'MB',
    // Time and freed amount of the last light reclaim
    lastReclaim: 'Reclaimed {time}',
    // Time of the last rebuild
    lastRebuild: 'Rebuilt {time}',
    // Placeholder for an action that never ran
    never: 'never',
    // Button that triggers a light reclaim
    reclaimNow: 'Reclaim now',
    // Button that triggers a rebuild
    rebuildNow: 'Rebuild now',
    // Button label while a light reclaim runs
    reclaiming: 'Reclaiming…',
    // Countdown notice before an automatic rebuild; the placeholder is seconds left
    noticeCountdown: 'Memory guard is reclaiming, rebuilding in {seconds}s',
    // Cancel button on the countdown notice
    noticeCancel: 'Cancel',
    // Skipped because the last rebuild is too recent
    skipCooldown: 'Last rebuild is too recent; skipped this round',
    // Usage stayed below the threshold
    skipBelowThreshold: 'Usage is below the threshold; only light reclaim ran',
    // A check is already running; a manual rebuild must wait for it
    busyChecking: 'A check is running; try again in a moment',
    // The user is still interacting
    skipActive: 'You are still interacting; no rebuild this round',
    // The user cancelled the automatic rebuild
    skipCancelled: 'Automatic rebuild cancelled',
    // The handle is not installed yet
    guardMissing: 'Memory guard is not ready; refresh the page and retry',
    // Reading memory failed
    measureFailed: 'Could not read memory usage',
    // Interval outside the allowed range
    intervalInvalid: 'The interval must be an integer between 1 and 120',
    // Threshold outside the allowed range
    thresholdInvalid: 'The threshold must be an integer between 200 and 8192',
  },
}
