/**
 * 「项目记忆」的 HTTP 路由。
 *
 * 设置页通过同源 fetch 读写开关与记忆根目录。根目录决定记忆落在哪里，写入后
 * 会改变后续会话读到的记忆，属于敏感配置：与技能包一致，只接受本机回环请求。
 */
import type { WebServerApi } from '../../../types/host'
import type { MemorySettingsPayload, MemorySettingsRequest } from '../types'

import { isLocalRequest, readJsonBody, sendJson } from '../../../common/http-route'
import { defaultMemoryRoot, resolveMemoryRoot } from './paths'
import { memorySettingsFile, readMemorySettings, writeMemorySettings } from './settings'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/memory'

/** 请求体上限；本接口只收一个开关与一段路径，超出说明请求异常。 */
const MAX_BODY_BYTES = 8 * 1024

/**
 * 组装设置页需要的负载。
 * @returns 当前设置与解析后的目录
 */
function buildPayload(): MemorySettingsPayload {
  const settings = readMemorySettings()
  const resolved = resolveMemoryRoot(settings.root)
  const fallback = defaultMemoryRoot()

  return {
    ...settings,
    // 根目录填错时界面要能看出来，因此同时给出回退后的实际目录
    effectiveRoot: resolved ?? fallback,
    defaultRoot: fallback,
    settingsPath: memorySettingsFile(),
  }
}

/**
 * 从请求体里取出要更新的字段；字段缺失表示不修改。
 * @param body 已解析的 JSON
 * @returns 收窄后的请求；形状不对时返回 undefined
 */
function readRequest(body: unknown): MemorySettingsRequest | undefined {
  if (typeof body !== 'object' || body === null) return undefined

  const candidate = body as { enabled?: unknown; root?: unknown }
  const request: MemorySettingsRequest = {}

  if (candidate.enabled !== undefined) {
    if (typeof candidate.enabled !== 'boolean') return undefined
    request.enabled = candidate.enabled
  }

  if (candidate.root !== undefined) {
    if (typeof candidate.root !== 'string') return undefined
    // 填了值却解析不出绝对路径时直接拒绝，避免把无效路径静默存下来
    if (candidate.root.trim() !== '' && resolveMemoryRoot(candidate.root) === undefined) {
      return undefined
    }
    request.root = candidate.root.trim()
  }

  return request
}

/**
 * 注册项目记忆的设置路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installMemoryRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      try {
        if (request.method === 'GET') {
          sendJson(response, 200, buildPayload())
          return
        }

        if (request.method === 'POST') {
          const body = await readJsonBody(request, MAX_BODY_BYTES)
          const update = readRequest(body)
          if (update === undefined) {
            sendJson(response, 400, { error: '设置内容不合法' })
            return
          }

          const current = readMemorySettings()
          writeMemorySettings({
            enabled: update.enabled ?? current.enabled,
            root: update.root ?? current.root,
          })
          sendJson(response, 200, buildPayload())
          return
        }

        response.writeHead(405, { allow: 'GET, POST' })
        response.end()
      } catch (error) {
        console.error('[project-memory] 处理设置请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
