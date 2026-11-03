/**
 * 「删除会话」的宿主路由。
 *
 * 会话文件在宿主进程的磁盘上，浏览器删不掉，只能由插件注册本地路由代删。
 * 删除不可撤销，因此与技能包写入一样只接受本机回环请求。
 *
 * 两条接口共用同一前缀：
 *   - `POST /dsh-all-in-one/sessions`：删除单条会话；
 *   - `POST /dsh-all-in-one/sessions/batch`：删除一个工作区里的多条会话。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson } from '../../../common/http-route'
import { deleteStoredSession, deleteStoredSessions, isValidSessionId } from './delete-session'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/sessions'

/** 批量删除路由：由前缀路由统一接收后按路径分发。 */
const BATCH_PATH = '/dsh-all-in-one/sessions/batch'

/** 单条请求体上限；本接口只收一个会话 id，超出说明请求异常。 */
const MAX_BODY_BYTES = 8 * 1024

/** 批量请求体上限：一条会话 id 约 45 字节，留足工作区全部会话的余量。 */
const MAX_BATCH_BODY_BYTES = 256 * 1024

/** 单次批量删除的会话数上限，避免异常请求一次清空过多数据。 */
const MAX_BATCH_SIZE = 1000

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
 * 从请求体里取出批量删除的会话标识列表。
 * @param body 已解析的 JSON
 * @returns 全部合法的会话标识；形状不对、为空或含非法 id 时返回 undefined
 */
function readSessionIds(body: unknown): string[] | undefined {
  if (typeof body !== 'object' || body === null) return undefined

  const candidate = (body as { sessionIds?: unknown }).sessionIds
  if (!Array.isArray(candidate) || candidate.length === 0) return undefined
  if (candidate.length > MAX_BATCH_SIZE) return undefined

  // 非法 id 直接拒绝整次请求：客户端只会提交列表里的真实会话
  return candidate.every(isValidSessionId) ? candidate : undefined
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

        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname

        // 批量删除：一次请求处理一个工作区里的多条会话
        if (pathname === BATCH_PATH) {
          const body = await readJsonBody(request, MAX_BATCH_BODY_BYTES)
          const sessionIds = readSessionIds(body)
          if (sessionIds === undefined) {
            sendJson(response, 400, { error: '会话标识列表不合法' })
            return
          }

          sendJson(response, 200, await deleteStoredSessions(sessionIds))
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
