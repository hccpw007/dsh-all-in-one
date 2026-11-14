/**
 * 「全自动执行」的开关路由。
 *
 * 开关由宿主侧在装配提示词与应答询问时读取，浏览器端只能通过这条本地路由修改；
 * 与其它配置写入一样只接受本机回环请求。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson, sendJsonBodyError } from '../../../common/http-route'
import { isAutoRunEnabled, readAutoRunSettings, setAutoRunEnabled } from './settings'

/** 开关接口路径；注册为精确匹配，避免子路径被当成同一份设置写入。 */
const ROUTE_PATH = '/dsh-all-in-one/auto-run'

/** 请求体上限；本接口只收两个字段，超出说明请求异常。 */
const MAX_BODY_BYTES = 4 * 1024

/**
 * 会话标识长度上限。
 *
 * 只做防御性校验：它会成为配置文件里的键，超长值没有意义却会撑大文件。
 */
const MAX_SESSION_ID_LENGTH = 200

/** 一次开关写入请求的解析结果。 */
interface AutoRunPatch {
  /** 要切换的会话标识。 */
  sessionId: string
  /** 目标状态。 */
  enabled: boolean
}

/**
 * 把请求体收窄成开关写入请求。
 * @param value 解析后的 JSON
 * @returns 合法请求；字段缺失或类型不对时返回 undefined
 */
function parsePatch(value: unknown): AutoRunPatch | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { sessionId?: unknown; enabled?: unknown }
  if (typeof candidate.sessionId !== 'string') return undefined
  if (typeof candidate.enabled !== 'boolean') return undefined

  const sessionId = candidate.sessionId.trim()
  if (sessionId === '' || sessionId.length > MAX_SESSION_ID_LENGTH) return undefined

  return { sessionId, enabled: candidate.enabled }
}

/**
 * 注册全自动开关路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installAutoRunRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })

        return
      }

      try {
        const url = new URL(request.url ?? ROUTE_PATH, 'http://127.0.0.1')

        if (request.method === 'GET') {
          const sessionId = url.searchParams.get('sessionId')

          // 不带会话标识时返回全量配置，便于排查「为什么这个对话还在问我」
          if (sessionId === null || sessionId.trim() === '') {
            sendJson(response, 200, readAutoRunSettings())

            return
          }

          sendJson(response, 200, { enabled: isAutoRunEnabled(sessionId.trim()) })

          return
        }

        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'GET, POST' })
          response.end()

          return
        }

        const body = await readJsonBody(request, MAX_BODY_BYTES)
        if (!body.ok) {
          sendJsonBodyError(response, body, '请求体不是合法 JSON')

          return
        }

        const patch = parsePatch(body.value)
        if (patch === undefined) {
          sendJson(response, 400, { error: '需要 { sessionId, enabled }' })

          return
        }

        sendJson(response, 200, {
          sessionId: patch.sessionId,
          enabled: setAutoRunEnabled(patch.sessionId, patch.enabled),
        })
      } catch (error) {
        console.error('[auto-run] 处理开关请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
