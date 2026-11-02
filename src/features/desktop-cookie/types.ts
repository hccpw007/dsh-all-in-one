/**
 * 「桌面版 Cookie 清理」用到的数据类型。
 *
 * 桌面版每次启动都用随机端口派生一个新的认证 cookie 名，旧记录不会被覆盖；
 * 累积到几十条后欢迎页认证失败。清理在宿主进程启动时执行，阈值与保留条数
 * 必须落在宿主读得到的位置，因此客户端与宿主共用同一份字段名。
 */

/** Cookie 清理配置。 */
export interface DesktopCookieSettings {
  /** 是否在宿主启动时清理桌面版的认证 cookie。 */
  enabled: boolean
  /** 触发阈值：`dsh-auth-*` 记录达到该条数才执行清理。 */
  threshold: number
  /** 清理后保留的最近条数，必须小于阈值。 */
  retain: number
}
