/**
 * 「删除会话」的宿主路由。
 *
 * 会话文件在宿主进程的磁盘上，浏览器删不掉，只能由插件注册本地路由代删。
 * 删除不可撤销，因此与技能包写入一样只接受本机回环请求。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson } from '../../../common/http-route'
import { deleteStoredSession, isValidSessionId } from './delete-session'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/sessions'

/** 请求体上限；本接口只收一个会话 id，超出说明请求异常。 */
const MAX_BODY_BYTES = 8 * 1024

/**
 * 从请求体里取出会话标识。
 * @param body 已解析的 JSON
 * @returns 合法的会话标识；形状不对时返回 undefined
 */
function readSessionId(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined

  const candidate = (body as { sessionId?: unknown }).sessionId
  return isValidSessionId(candidate) ? candidate : undefined
}

/**
 * 注册删除会话的路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installDeleteSessionRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      try {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }

        const body = await readJsonBody(request, MAX_BODY_BYTES)
        const sessionId = readSessionId(body)
        if (sessionId === undefined) {
          sendJson(response, 400, { error: '会话标识不合法' })
          return
        }

        const report = await deleteStoredSession(sessionId)
        // 正文目录与派生记录都不存在时，说明这条会话早已被删掉
        if (report.directories === 0 && report.records === 0) {
          sendJson(response, 404, { error: '会话不存在或已被删除' })
          return
        }

        sendJson(response, 200, { deleted: true })
      } catch (error) {
        console.error('[delete-session] 处理删除请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
