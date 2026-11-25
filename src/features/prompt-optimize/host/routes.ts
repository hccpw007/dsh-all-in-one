/**
 * 「提示词优化」的本地路由。
 *
 * 优化必须由宿主发起：浏览器没有模型凭据，也读不到会话的模型选择。这里只接受
 * 本机请求；远程访客可以用自己的模型消耗宿主的额度，必须挡在外面。
 *
 * 协议：
 *   POST { text, sessionId? } → { optimized } 或 { error }
 */
import type { HostPluginContext, WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson, sendJsonBodyError } from '../../../common/http-route'
import { MAX_INPUT_BYTES } from '../types'
import { optimizePrompt } from './optimize'

/** 路由路径；精确匹配，避免子路径被当成同一份入口。 */
const ROUTE_PATH = '/dsh-all-in-one/prompt-optimize'

/**
 * 请求体上限。
 *
 * 原文本身有 8KB 上限，加上 JSON 包装与转义（换行、引号都会膨胀）留一倍余量。
 */
const MAX_BODY_BYTES = MAX_INPUT_BYTES * 2 + 1024

/** 会话标识长度上限，与宿主对会话 id 的约束一致。 */
const MAX_SESSION_ID_LENGTH = 200

/**
 * 收窄请求体。
 * @param value 解析后的 JSON
 * @returns 合法请求；字段缺失或类型不对时返回 undefined
 */
function parseRequest(value: unknown): { text: string; sessionId?: string } | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const candidate = value as { text?: unknown; sessionId?: unknown }
  if (typeof candidate.text !== 'string') return undefined

  const text = candidate.text.trim()
  if (text === '') return undefined
  // 超长文本模型也读不完，直接拒绝比截断更诚实：用户能看出是输入太长而不是模型跑偏
  if (Buffer.byteLength(text, 'utf8') > MAX_INPUT_BYTES) return undefined

  // 会话标识只用于查找模型选择，不合法时按缺省处理，回退到默认模型
  const raw = candidate.sessionId
  const sessionId = typeof raw === 'string' && raw !== '' && raw.length <= MAX_SESSION_ID_LENGTH
    ? raw
    : undefined

  return { text, sessionId }
}

/**
 * 注册提示词优化路由。
 * @param ctx 宿主插件上下文，用于取得 LLM 与会话服务
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installPromptOptimizeRoutes(
  ctx: HostPluginContext,
  webServer: WebServerApi,
): () => void {
  return webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })

        return
      }

      if (request.method !== 'POST') {
        sendJson(response, 405, { error: '只接受 POST 请求' })

        return
      }

      const body = await readJsonBody(request, MAX_BODY_BYTES)
      if (!body.ok) {
        sendJsonBodyError(response, body, '请求内容不合法')

        return
      }

      const parsed = parseRequest(body.value)
      if (parsed === undefined) {
        sendJson(response, 400, { error: `待优化的内容为空或超过 ${MAX_INPUT_BYTES} 字节` })

        return
      }

      try {
        const outcome = await optimizePrompt(ctx, parsed)
        if (!outcome.ok) {
          sendJson(response, 502, { error: outcome.message })

          return
        }

        sendJson(response, 200, { optimized: outcome.text })
      } catch (error) {
        // optimizePrompt 已经处理了可预期失败，这里兜住意料外的抛出，避免连接悬空
        console.error('[prompt-optimize] 处理优化请求失败:', error)
        sendJson(response, 500, { error: '优化失败，请重试' })
      }
    },
  })
}
