/**
 * 「对话加速」的设置路由。
 *
 * 页面上的勾选与阈值由宿主侧消费（注册批量工具、补并发声明、改裁剪预算），
 * 浏览器端只能通过这条本地路由读写；与其它配置写入一样只接受本机回环请求。
 *
 * 写入成功后立即重新应用一次工具与裁剪状态，不必重启宿主。
 */
import type { HostPluginContext, WebServerApi } from '../../../types/host'

import { isLocalRequest, readJsonBody, sendJson } from '../../../common/http-route'
import { readChatAccelSettings, updateChatAccelSettings } from './settings'
import { applyToolState } from './tools'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/chat-accel'

/** 请求体上限；本接口只收条目 id 列表与一个阈值。 */
const MAX_BODY_BYTES = 8 * 1024

/**
 * 注册「对话加速」的设置路由。
 * @param ctx 宿主上下文，用于写入设置后重新应用改造
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installChatAccelRoutes(
  ctx: HostPluginContext,
  webServer: WebServerApi,
): () => void {
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
          sendJson(response, 200, readChatAccelSettings())
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

        const settings = updateChatAccelSettings(body)

        // 设置已落盘，工具立即切到新配置；裁剪预算在下一次 agent/pre-step 时按新设置校正
        applyToolState(ctx)

        sendJson(response, 200, settings)
      } catch (error) {
        console.error('[chat-accel] 处理设置请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
