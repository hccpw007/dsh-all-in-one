/**
 * 「清空会话」的宿主路由：停止正在执行的轮次。
 *
 * 会话由宿主进程持有，浏览器无法直接中断一轮执行；清空或切换对话前若任务仍在跑，
 * 只能由宿主侧调用会话控制器的 cancel。路由与「删除会话」同级，只接受本机回环请求。
 */
import type { ServerResponse } from 'node:http'

import type { SessionControllerApi, WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson, sendJsonBodyError } from '../../../common/http-route'

/** 停止路由路径，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/session/cancel'

/** 请求体上限；本接口只收一个会话 id，超出说明请求异常。 */
const MAX_BODY_BYTES = 8 * 1024

/** 会话 id 的允许字符：宿主用 `session-<uuid>`，这里放宽到常见标识符字符集。 */
const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,200}$/

/**
 * 从请求体里取出会话标识。
 * @param body 已解析的 JSON
 * @returns 合法的会话标识；形状不对时返回 undefined
 */
function readSessionId(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined

  const candidate = (body as { sessionId?: unknown }).sessionId

  return typeof candidate === 'string' && SESSION_ID_PATTERN.test(candidate) ? candidate : undefined
}

/**
 * 写出停止结果。
 * @param response 响应对象
 * @param sessionId 请求停止的会话
 * @param controller 会话控制器
 */
function writeCancelResult(
  response: ServerResponse,
  sessionId: string,
  controller: SessionControllerApi,
): void {
  // 宿主用 RemoteError 表达可预期失败：会话未挂载说明它已不在运行，无需再停
  try {
    controller.cancel({ sessionId })
    sendJson(response, 200, { accepted: true })
  } catch (error) {
    const code = (error as { code?: unknown }).code
    // 未挂载 = 这条会话此刻没有 Agent 在跑，对「停止」而言等同于已完成
    if (code === 'session/not-found') {
      sendJson(response, 404, { error: '会话未在运行' })

      return
    }

    console.error('[clear-session] 停止会话失败:', sessionId, error)
    sendJson(response, 500, { error: error instanceof Error ? error.message : '停止会话失败' })
  }
}

/**
 * 注册停止路由。
 * @param webServer Web 服务器服务
 * @param controller 会话控制器
 * @returns 注销函数
 */
export function installClearSessionRoutes(
  webServer: WebServerApi,
  controller: SessionControllerApi,
): () => void {
  return webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      // 停止只影响本机会话，非回环请求一律拒绝
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只接受本机请求' })

        return
      }

      if (request.method !== 'POST') {
        sendJson(response, 405, { error: '只支持 POST' })

        return
      }

      const body = await readJsonBody(request, MAX_BODY_BYTES)
      // 请求体不合法时无法确定要停哪条会话
      if (!body.ok) {
        sendJsonBodyError(response, body, '请求体不是合法 JSON')

        return
      }

      const sessionId = readSessionId(body.value)
      // 缺少会话 id 时无事可做，直接按参数错误返回
      if (sessionId === undefined) {
        sendJson(response, 400, { error: '缺少合法的 sessionId' })

        return
      }

      writeCancelResult(response, sessionId, controller)
    },
  })
}
