/**
 * 「会话图片预览」的图片读取路由。
 *
 * 只读、只允许本机访问，路径分两类受理：
 *   - 常规图片：扩展名必须在白名单内；
 *   - 宿主附件对象：`<DSH_HOME>/attachments/v1/objects/<两位>/<64 位哈希>`，没有扩展名，
 *     由文件头探测真实类型。这类文件是宿主持久化的附件，正是最需要长期预览的来源。
 *
 * 响应统一带 nosniff 与 CSP，避免把任意文件读成可执行资源。
 */
import { readFile, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { basename, dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'

import type { WebServerApi } from '../../../types/host'

import { resolveDshHome } from '../../../common/dsh-home'
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

/** 附件对象目录的相对位置，拼在 DSH 主目录之后。 */
const ATTACHMENT_OBJECT_DIR = join('attachments', 'v1', 'objects')

/** 附件对象的文件名形态：内容哈希，没有扩展名。 */
const ATTACHMENT_OBJECT_NAME = /^[0-9a-f]{64}$/

/** 附件对象的分片目录名：哈希前两位。 */
const ATTACHMENT_SHARD_NAME = /^[0-9a-f]{2}$/

/**
 * 判断路径是否是宿主附件对象。
 *
 * 只认内容寻址的形状（分片目录 + 64 位哈希文件名），并且必须落在 DSH 主目录的
 * 附件库内，避免这条免扩展名的口子被用来读取任意文件。
 * @param filePath 展开后的绝对路径
 * @returns 属于附件库对象时返回 true
 */
function isAttachmentObject(filePath: string): boolean {
  const root = join(resolveDshHome(), ATTACHMENT_OBJECT_DIR)
  const resolvedPath = resolve(filePath)

  if (!resolvedPath.startsWith(`${resolve(root)}${sep}`)) return false
  if (!ATTACHMENT_OBJECT_NAME.test(basename(resolvedPath))) return false

  return ATTACHMENT_SHARD_NAME.test(basename(dirname(resolvedPath)))
}

/**
 * 按文件头判断图片类型。
 *
 * 附件对象没有扩展名，只能看魔数；只识别宿主会写出的位图格式，
 * 不把文本类内容（如 SVG、脚本）当作图片返回。
 * @param data 文件内容
 * @returns Content-Type；不是受支持的图片时返回 undefined
 */
function detectImageType(data: Buffer): string | undefined {
  const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (data.length >= 8 && data.subarray(0, 8).equals(PNG_SIGNATURE)) return 'image/png'

  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return 'image/jpeg'
  }

  if (data.length >= 6) {
    const header = data.subarray(0, 6).toString('latin1')
    if (header === 'GIF87a' || header === 'GIF89a') return 'image/gif'
  }

  if (
    data.length >= 12 &&
    data.subarray(0, 4).toString('latin1') === 'RIFF' &&
    data.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp'
  }

  if (data.length >= 2 && data[0] === 0x42 && data[1] === 0x4d) return 'image/bmp'

  if (data.length >= 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0x01 && data[3] === 0x00) {
    return 'image/x-icon'
  }

  // AVIF 的 brand 位于 ftyp 之后，宿主写出的规范化图片不会是 AVIF，这里只做兼容
  if (data.length >= 12 && data.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = data.subarray(8, 12).toString('latin1')
    if (brand === 'avif' || brand === 'avis') return 'image/avif'
  }

  return undefined
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
  const extensionType = CONTENT_TYPES[extname(filePath).toLowerCase()]
  const attachmentObject = extensionType === undefined && isAttachmentObject(filePath)

  if (extensionType === undefined && !attachmentObject) {
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
    const contentType = extensionType ?? detectImageType(data)
    if (contentType === undefined) {
      sendJson(response, 415, { error: '文件内容不是受支持的图片' })
      return
    }

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
      const rawPath = url.searchParams.get('path')

      if (rawPath === null || rawPath === '') {
        sendJson(response, 400, { error: '缺少 path 参数' })
        return
      }

      // 浏览器不知道用户主目录，`~/` 由宿主展开；其余相对路径无法定位，直接拒绝
      const filePath = rawPath.startsWith('~/') ? join(homedir(), rawPath.slice(2)) : rawPath

      if (!isAbsolute(filePath)) {
        sendJson(response, 400, { error: '只接受绝对路径' })
        return
      }

      await sendImage(request, response, filePath)
    },
  })
}
