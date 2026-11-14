/**
 * 「上下文详情」的只读路由。
 *
 * 浏览器拿不到会话日志，详情必须由宿主侧读出：`GET /dsh-all-in-one/context-inspect?session=<id>`
 * 返回该会话当前的系统提示词与工具定义。与其它本地路由一样只接受回环请求；
 * 会话 id 先按宿主 id 的字符集校验，避免把请求参数带成别的路径。
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

import type { SessionPersistenceApi, WebServerApi } from '../../../types/host'
import { isLocalRequest, sendJson } from '../../../common/http-route'
import { readContextInspect } from './inspect'

/** 详情接口路径；注册为精确匹配。 */
const ROUTE_PATH = '/dsh-all-in-one/context-inspect'

/**
 * 会话标识的允许形状。
 *
 * 宿主用会话 id 作为目录名（`session-<uuid>` 或裸 uuid），只含字母、数字、
 * 点、下划线与连字符；这里收紧到同一字符集，避免请求参数被当作路径片段。
 */
const SESSION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/

/**
 * 从请求里取会话标识。
 * @param request 入站请求
 * @returns 合法时返回会话 id，否则返回 undefined
 */
function sessionIdOf(request: IncomingMessage): string | undefined {
  const url = new URL(request.url ?? '', 'http://localhost')
  const session = url.searchParams.get('session')

  return session !== null && SESSION_ID_PATTERN.test(session) ? session : undefined
}

/**
 * 注册详情读取路由。
 * @param webServer 宿主 Web 服务器服务
 * @param persistence 会话持久化服务
 * @returns 注销函数
 */
export function installContextInspectRoutes(
  webServer: WebServerApi,
  persistence: SessionPersistenceApi,
): () => void {
  return webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (request: IncomingMessage, response: ServerResponse) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }

      const sessionId = sessionIdOf(request)
      if (sessionId === undefined) {
        sendJson(response, 400, { error: '缺少合法的会话标识' })
        return
      }

      try {
        const payload = await readContextInspect(persistence, sessionId)
        if (payload === null) {
          sendJson(response, 404, { error: '会话不存在' })
          return
        }

        sendJson(response, 200, payload)
      } catch (error) {
        console.error('[context-inspect] 读取上下文详情失败:', sessionId, error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
