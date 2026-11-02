/**
 * 「桌面版 Cookie 清理」的设置路由。
 *
 * 清理由宿主在启动阶段执行，浏览器端只能通过这条本地路由读写阈值与开关；
 * 与其它配置写入一样只接受本机回环请求。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson } from '../../../common/http-route'
import { readDesktopCookieSettings, updateDesktopCookieSettings } from './settings'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/desktop-cookie'

/** 请求体上限；本接口只收三个字段，超出说明请求异常。 */
const MAX_BODY_BYTES = 4 * 1024

/**
 * 注册 Cookie 清理的设置路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installDesktopCookieRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      try {
        if (request.method === 'GET') {
          sendJson(response, 200, readDesktopCookieSettings())
          return
        }

        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'GET, POST' })
          response.end()
          return
        }

        const body = await readJsonBody(request, MAX_BODY_BYTES)
        if (body === undefined) {
          sendJson(response, 400, { error: '请求体不是合法 JSON' })
          return
        }

        sendJson(response, 200, updateDesktopCookieSettings(body))
      } catch (error) {
        console.error('[desktop-cookie] 处理设置请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
