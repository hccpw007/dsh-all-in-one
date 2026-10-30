/**
 * 「会话历史左侧」的轮次文本路由。
 *
 * 浏览器读不到会话记录文件，每轮用户输入必须由宿主侧读出：这里注册一条
 * 只读、只允许本机访问的 JSON 路由，按会话 id 返回单行化的用户输入列表。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, sendJson } from '../../../common/http-route'
import { readTurnInputs } from './turn-inputs'

/** 路由前缀，同时作为浏览器端的请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/turn-inputs'

/**
 * 注册轮次文本路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installSessionHistoryRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }

      const url = new URL(request.url ?? ROUTE_PATH, 'http://localhost')
      const sessionId = url.searchParams.get('sessionId')

      if (sessionId === null || sessionId === '') {
        sendJson(response, 400, { error: '缺少 sessionId 参数' })
        return
      }

      const inputs = await readTurnInputs(sessionId)
      sendJson(response, 200, { inputs })
    },
  })
}
