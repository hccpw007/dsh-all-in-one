import type { FeatureLocales } from '../../shell/registry'

/** 「内存守护」的中英文文案；key 由外壳统一加 `memory-guard.` 前缀。 */
export const memoryGuardLocales: FeatureLocales = {
  zh: {
    // 入口与设置页标题
    title: '内存守护',
    // 入口描述：说明定时回收与自动重建的作用
    description: '定时回收界面内存，占用超过阈值且无人操作时自动重建页面。',
    // 卡片右下角的设置入口
    settingsAction: '设置',
    // 设置页标题
    pageTitle: '内存守护设置',
    // 设置页说明：检查节奏与自动重建的触发条件
    pageHint: '定时检查界面内存：先做轻量回收，占用仍超过阈值且无人操作时重建页面。',
    // 检查间隔输入框的标签
    intervalLabel: '检查间隔',
    // 检查间隔输入框的单位
    intervalUnit: '分钟',
    // 检查间隔的作用：同时决定检查周期与空闲判定时长
    intervalHint: '既是检查周期，也是「无人操作」的判定时长：窗口失焦或空闲满该时长才会重建。',
    // 重建阈值输入框的标签
    thresholdLabel: '重建阈值',
    // 重建阈值输入框的单位
    thresholdUnit: 'MB',
    // 重建阈值的作用：按渲染进程判定，超过它才真正重建页面
    thresholdHint: '轻量回收后渲染进程占用仍超过该值才重建页面；低于它每次只做轻量回收。',
    // 输入框即时保存的说明
    autoSaveHint: '输入框失焦或回车即保存，改动立即生效。',
    // 输入框下方读数按钮的无障碍名称前缀，界面上只显示图标
    dockLabel: '内存',
    // 状态栏读数的悬停说明：覆盖范围与点击后的去处
    dockTitle: '全部 DSH 进程的物理内存（主进程、GPU、渲染进程等），与活动监视器各行之和同口径；点击打开内存守护设置',
    // 设置浮层的关闭按钮
    dialogClose: '关闭',
    // 会话头部「回收并重建」按钮的无障碍标签与悬停说明
    rebuildAction: '先回收再重建页面',
    // 当前内存占用（全部 DSH 进程合计）
    memoryUsage: '当前占用',
    // 渲染进程单独一行展示时的标签
    rendererUsage: '渲染进程',
    // 合计读数的来源标签
    sourceAll: '全部进程',
    // 页面 DOM 节点数量
    domNodeCount: 'DOM 节点',
    // 读数来自渲染进程物理内存
    sourceProcess: '渲染进程',
    // 读数来自页面 JS 堆
    sourceHeap: '页面堆',
    // 拿不到任何读数
    sourceNone: '不可用',
    // 读数尚未返回时的占位
    readingPending: '读取中…',
    // 读数的口径说明：合计覆盖哪些进程、重建能回收哪部分
    readingHint: '合计为全部 DSH 进程的物理内存，与活动监视器各行之和同口径；重建只回收渲染进程那部分。',
    // 上次轻量回收的时间
    lastReclaim: '上次回收',
    // 上次重建的时间
    lastRebuild: '上次重建',
    // 回收释放量，占位符是兆字节数
    freedAmount: '释放 {amount} MB',
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
    // Entry and page title
    title: 'Memory guard',
    // Entry description: scheduled reclaim plus idle rebuild
    description: 'Reclaims renderer memory on a schedule and rebuilds the page when idle and over the limit.',
    // Settings entry at the card's bottom right
    settingsAction: 'Settings',
    // Settings page title
    pageTitle: 'Memory guard settings',
    // Settings page intro: cadence and rebuild conditions
    pageHint: 'Checks renderer memory on a schedule: a light reclaim first, then a page rebuild when usage stays above the limit and nobody is interacting.',
    // Label of the interval input
    intervalLabel: 'Interval',
    // Unit shown after the interval input
    intervalUnit: 'min',
    // What the interval controls: cadence and the idle window
    intervalHint: 'Both the check cadence and the idle window: a rebuild only happens when the window is unfocused or idle for this long.',
    // Label of the rebuild threshold input
    thresholdLabel: 'Rebuild above',
    // Unit shown after the threshold input
    thresholdUnit: 'MB',
    // What the threshold controls: the renderer, not the whole tree
    thresholdHint: 'The page is rebuilt only if the renderer stays above this after the light reclaim; below it every check is light only.',
    // Inputs save on blur or Enter
    autoSaveHint: 'Inputs save on blur or Enter and take effect immediately.',
    // Accessible name prefix of the dock reading button; only the icon is painted
    dockLabel: 'Memory',
    // Tooltip of the dock reading: what it covers and where a click leads
    dockTitle: 'Physical memory of all DSH processes (main, GPU, renderer), matching the sum of Activity Monitor rows; click to open the memory guard settings',
    // Close button of the settings dialog
    dialogClose: 'Close',
    // Accessible label and tooltip of the header rebuild button
    rebuildAction: 'Reclaim, then rebuild the page',
    // Current memory usage (all DSH processes combined)
    memoryUsage: 'In use',
    // Label when the renderer is listed on its own row
    rendererUsage: 'Renderer',
    // Source label for the combined reading
    sourceAll: 'all processes',
    // Number of DOM nodes on the page
    domNodeCount: 'DOM nodes',
    // Reading comes from the renderer phys footprint
    sourceProcess: 'renderer',
    // Reading comes from the page JS heap
    sourceHeap: 'JS heap',
    // No reading available
    sourceNone: 'unavailable',
    // Placeholder before the first reading arrives
    readingPending: 'Reading…',
    // Explains what the total covers and what a rebuild reclaims
    readingHint: "The total covers every DSH process, matching the sum of Activity Monitor rows; a rebuild only reclaims the renderer part.",
    // Time of the last light reclaim
    lastReclaim: 'Reclaimed',
    // Time of the last rebuild
    lastRebuild: 'Rebuilt',
    // Freed amount; the placeholder is megabytes
    freedAmount: '{amount} MB freed',
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
