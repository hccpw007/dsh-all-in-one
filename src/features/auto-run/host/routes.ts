/**
 * 「全自动执行」的开关路由。
 *
 * 开关由宿主侧在装配提示词与应答询问时读取，浏览器端只能通过这条本地路由修改；
 * 与其它配置写入一样只接受本机回环请求。
 *
 * 协议：
 *   GET  不带 sessionId  → 设置摘要（默认值来源 + 显式开启的会话）
 *   GET  带 sessionId    → 该会话的开关状态；可带 workspaceId 用于「工作空间」默认值
 *   POST { defaultMode } → 写入新会话默认状态的来源
 *   POST { sessionId, enabled, workspaceId? } → 写入会话级开关
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson, sendJsonBodyError } from '../../../common/http-route'
import type { AutoRunDefaultMode } from '../types'
import {
  readAutoRunSettings,
  resolveAutoRunState,
  setAutoRunDefaultMode,
  setAutoRunEnabled,
  summarizeAutoRunSettings,
} from './settings'

/** 开关接口路径；注册为精确匹配，避免子路径被当成同一份设置写入。 */
const ROUTE_PATH = '/dsh-all-in-one/auto-run'

/** 请求体上限；本接口只收几个短字段，超出说明请求异常。 */
const MAX_BODY_BYTES = 4 * 1024

/**
 * 标识长度上限。
 *
 * 会话与工作空间标识会成为配置文件里的键：只做防御性校验，超长值没有意义却会撑大文件。
 */
const MAX_ID_LENGTH = 200

/** 一次会话级开关写入请求的解析结果。 */
interface AutoRunSessionPatch {
  /** 要切换的会话标识。 */
  sessionId: string
  /** 目标状态。 */
  enabled: boolean
  /** 会话所属工作空间；客户端查不到归属时省略。 */
  workspaceId?: string
}

/**
 * 收窄一个标识字段。
 * @param value 解析后的 JSON 字段
 * @returns 非空且不超长的标识；不合法时返回 undefined
 */
function readId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const id = value.trim()

  return id === '' || id.length > MAX_ID_LENGTH ? undefined : id
}

/**
 * 把请求体收窄成会话级开关写入请求。
 * @param value 解析后的 JSON
 * @returns 合法请求；字段缺失或类型不对时返回 undefined
 */
function parseSessionPatch(value: unknown): AutoRunSessionPatch | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { sessionId?: unknown; enabled?: unknown; workspaceId?: unknown }
  if (typeof candidate.enabled !== 'boolean') return undefined

  const sessionId = readId(candidate.sessionId)
  if (sessionId === undefined) return undefined

  // 工作空间标识非法时按「未知归属」处理：会话级开关仍然可以写入
  const workspaceId = candidate.workspaceId === undefined
    ? undefined
    : readId(candidate.workspaceId)

  return { sessionId, enabled: candidate.enabled, workspaceId }
}

/**
 * 把请求体收窄成默认值来源写入请求。
 * @param value 解析后的 JSON
 * @returns 可识别的来源；不是该动作时返回 undefined
 */
function parseDefaultModePatch(value: unknown): AutoRunDefaultMode | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const mode = (value as { defaultMode?: unknown }).defaultMode
  if (mode === 'on' || mode === 'last' || mode === 'workspace') return mode
  if (mode === 'off') return 'off'

  return undefined
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
          const sessionId = readId(url.searchParams.get('sessionId'))

          // 不带会话标识时返回设置摘要，供设置页读取默认值、侧边栏读取标识列表
          if (sessionId === undefined) {
            sendJson(response, 200, summarizeAutoRunSettings(readAutoRunSettings()))

            return
          }

          const workspaceId = readId(url.searchParams.get('workspaceId'))

          sendJson(response, 200, resolveAutoRunState(sessionId, workspaceId))

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

        const defaultMode = parseDefaultModePatch(body.value)
        // 设置页写默认值：与会话级开关共用一条路由，按字段区分两种动作
        if (defaultMode !== undefined) {
          setAutoRunDefaultMode(defaultMode)
          sendJson(response, 200, summarizeAutoRunSettings(readAutoRunSettings()))

          return
        }

        const patch = parseSessionPatch(body.value)
        if (patch === undefined) {
          sendJson(response, 400, { error: '需要 { sessionId, enabled } 或 { defaultMode }' })

          return
        }

        sendJson(response, 200, {
          sessionId: patch.sessionId,
          enabled: setAutoRunEnabled(patch.sessionId, patch.enabled, patch.workspaceId),
          explicit: true,
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
