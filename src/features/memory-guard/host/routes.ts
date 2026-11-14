/**
 * 「内存守护」的读数路由。
 *
 * 只读、只允许本机访问：接口返回的是本机进程的占用，属于诊断信息，不写成配置。
 * 读取失败也返回 200 + null，让页面安静降级到 JS 堆读数，而不是每次轮询都报错。
 */
import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, sendJson } from '../../../common/http-route'
import type { RendererMemoryPayload } from '../types'
import { readRendererMemoryMB } from './process-memory'

/** 读数接口路径；注册为精确匹配，避免子路径被当成同一接口。 */
const ROUTE_PATH = '/dsh-all-in-one/memory-guard'

/**
 * 注册内存读数路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installMemoryGuardRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'exact',
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

      try {
        const rendererMB = await readRendererMemoryMB()
        const payload: RendererMemoryPayload = {
          rendererMB,
          hostRssMB: Math.round(process.memoryUsage().rss / 1048576),
          sampledAt: Date.now(),
        }

        sendJson(response, 200, payload)
      } catch (error) {
        console.error('[memory-guard] 读取进程内存失败:', error)
        sendJson(response, 200, { rendererMB: null, hostRssMB: null, sampledAt: Date.now() })
      }
    },
  })
}
