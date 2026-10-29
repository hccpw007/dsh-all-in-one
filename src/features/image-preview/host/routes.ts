/**
 * 「会话图片预览」的图片读取路由。
 *
 * 只读、只允许本机访问：路径必须由页面给出绝对路径，扩展名必须在图片白名单内，
 * 且响应带 nosniff，避免把任意文件读成可执行资源。
 */
import { readFile, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, isAbsolute } from 'node:path'

import type { WebServerApi } from '../../../types/host'

import { isLocalRequest, sendJson } from '../../../common/http-route'

/** 路由前缀，同时作为浏览器端的请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/image'

/** 单个图片的体积上限；超过说明不是该功能要预览的普通截图。 */
const MAX_FILE_BYTES = 32 * 1024 * 1024

/** 允许读取的扩展名与对应 Content-Type，与浏览器端的识别清单保持一致。 */
const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

/**
 * 读取并返回一张本地图片。
 * @param request 入站请求
 * @param response 响应对象
 * @param filePath 图片绝对路径
 */
async function sendImage(
  request: IncomingMessage,
  response: ServerResponse,
  filePath: string,
): Promise<void> {
  const contentType = CONTENT_TYPES[extname(filePath).toLowerCase()]
  if (contentType === undefined) {
    sendJson(response, 415, { error: '只允许读取图片文件' })
    return
  }

  try {
    const info = await stat(filePath)
    if (!info.isFile()) {
      sendJson(response, 404, { error: '不是文件' })
      return
    }

    if (info.size > MAX_FILE_BYTES) {
      sendJson(response, 413, { error: '图片体积超过上限' })
      return
    }

    const data = await readFile(filePath)
    response.writeHead(200, {
      'content-type': contentType,
      'content-length': data.length,
      // 文件可能被同名覆盖或已被删除，禁止浏览器缓存，避免刷新后仍显示旧图
      'cache-control': 'no-store, no-cache, must-revalidate',
      'x-content-type-options': 'nosniff',
      // SVG 直接打开时可能带脚本，用 CSP 禁掉资源加载与脚本执行
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
    })
    response.end(request.method === 'HEAD' ? undefined : data)
  } catch (error) {
    // 文件不存在、权限不足都会走到这里：按 404 处理并留下日志，不向页面泄露系统路径
    console.warn('[image-preview] 读取图片失败:', filePath, error)
    if (response.headersSent) {
      response.end()
      return
    }

    sendJson(response, 404, { error: '图片不存在或不可读' })
  }
}

/**
 * 注册图片读取路由。
 * @param webServer 宿主 Web 服务器服务
 * @returns 注销函数
 */
export function installImagePreviewRoutes(webServer: WebServerApi): () => void {
  return webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: async (request, response) => {
      if (!isLocalRequest(request)) {
        sendJson(response, 403, { error: '只允许本机访问' })
        return
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { allow: 'GET, HEAD' })
        response.end()
        return
      }

      const url = new URL(request.url ?? ROUTE_PATH, 'http://localhost')
      const filePath = url.searchParams.get('path')

      if (filePath === null || filePath === '') {
        sendJson(response, 400, { error: '缺少 path 参数' })
        return
      }

      // 相对路径无法定位到用户看到的那个文件，直接拒绝而不是猜一个基准目录
      if (!isAbsolute(filePath)) {
        sendJson(response, 400, { error: '只接受绝对路径' })
        return
      }

      await sendImage(request, response, filePath)
    },
  })
}
