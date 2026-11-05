/**
 * 「会话图片预览」的图片读取路由。
 *
 * 只读、只允许本机访问，请求分两类受理：
 *   - 常规图片：扩展名必须在白名单内，且必须落在用户主目录或临时目录内；
 *   - 宿主附件对象：`<DSH_HOME>/attachments/v1/objects/<两位>/<64 位哈希>`，没有扩展名，
 *     由文件头探测真实类型。这类文件是宿主持久化的附件，正是最需要长期预览的来源。
 * 附件对象也可以只给附件 ID（`sha256:<64 位哈希>`）：工具输出里只有 ID，没有路径，
 * 换算成附件库路径的工作放在宿主侧，浏览器端不需要知道 DSH 主目录。
 *
 * 响应统一带 nosniff 与 CSP，避免把任意文件读成可执行资源；文件内容按流回传，
 * 不再把整张图读进内存（会话图片网格可能并发请求多张 32MB 的图）。
 */
import { createReadStream } from 'node:fs'
import { open, realpath, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir, tmpdir } from 'node:os'
import { basename, dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'

import type { WebServerApi } from '../../../types/host'

import { resolveDshHome } from '../../../common/dsh-home'
import { isLocalRequest, sendJson } from '../../../common/http-route'

/** 路由前缀，同时作为浏览器端的请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/image'

/** 单个图片的体积上限；超过说明不是该功能要预览的普通截图。 */
const MAX_FILE_BYTES = 32 * 1024 * 1024

/** 判断附件真实类型时读取的头部字节数。 */
const TYPE_PROBE_BYTES = 64

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

/** 附件 ID：`sha256:<64 位内容哈希>`；裸哈希也接受，宿主的部分输出会省略前缀。 */
const ATTACHMENT_ID_PATTERN = /^(?:sha256:)?([0-9a-f]{64})$/

/**
 * 允许读取普通图片的根目录。
 *
 * 此前只要路径是绝对路径、扩展名在白名单内就会读取，本机任意图片都可被同源页面
 * 拉取。按目录白名单收窄：用户主目录（含 DSH 主目录与附件库）与系统临时目录，
 * 覆盖截图工具与会话附件的实际落位，同时挡掉 `~` 之外的系统文件。
 * @returns 候选根目录，重复项已去掉
 */
function allowedImageRoots(): string[] {
  const roots = [resolveDshHome(), homedir(), tmpdir(), '/tmp', '/private/tmp']

  return [...new Set(roots)]
}

/**
 * 展开后的允许根目录缓存。
 *
 * 根目录在进程生命周期内不会变化，逐个 realpath 一次即可；否则每张图片都要对
 * 五个根各做一次 syscall。
 */
let resolvedRoots: string[] | undefined

/**
 * 取展开后的允许根目录。
 * @returns 真实路径形式的根目录
 */
async function allowedRootsResolved(): Promise<string[]> {
  if (resolvedRoots !== undefined) return resolvedRoots

  const resolved = await Promise.all(
    allowedImageRoots().map(async (root) => {
      try {
        return await realpath(root)
      } catch (error) {
        // 根目录不存在（如非 macOS 上的 /private/tmp）时退化为原始路径比较
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn('[image-preview] 解析允许目录失败:', root, error)
        }

        return root
      }
    }),
  )

  resolvedRoots = [...new Set(resolved)]

  return resolvedRoots
}

/** 路径检查结果。 */
type PathDecision =
  | { ok: true; path: string }
  | { ok: false; reason: 'missing' | 'denied' }

/**
 * 判断文件真实路径是否落在允许的根目录内。
 *
 * 用 realpath 展开符号链接后再比较，避免「附件库里放一个指向 /etc 的链接」绕过检查。
 * @param filePath 待检查的绝对路径
 * @returns 允许读取时返回展开后的真实路径；否则给出缺失或越界
 */
async function resolveAllowedPath(filePath: string): Promise<PathDecision> {
  let real: string

  try {
    real = await realpath(filePath)
  } catch (error) {
    // 文件不存在、权限不足或悬空链接都无法读取。
    // ENOENT 是常态（路径已被删除、预览还没回收），不刷日志
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { ok: false, reason: 'missing' }
    }

    console.warn('[image-preview] 解析图片真实路径失败:', filePath, error)

    return { ok: false, reason: 'denied' }
  }

  for (const realRoot of await allowedRootsResolved()) {
    if (real === realRoot || real.startsWith(`${realRoot}${sep}`)) return { ok: true, path: real }
  }

  console.warn('[image-preview] 图片不在允许的目录内，已拒绝:', filePath)

  return { ok: false, reason: 'denied' }
}

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
 * 把附件 ID 换算成附件库对象路径。
 *
 * 只按内容寻址规则拼路径，不读取任何索引：ID 就是文件名，分片目录取哈希前两位，
 * 因此不会因为索引缺失而预览不到附件。
 * @param attachmentId 附件 ID，可带 `sha256:` 前缀
 * @returns 附件库对象绝对路径；ID 形态非法时返回 undefined
 */
function resolveAttachmentPath(attachmentId: string): string | undefined {
  const matched = ATTACHMENT_ID_PATTERN.exec(attachmentId)
  if (matched === null) return undefined

  const hash = matched[1]
  return join(resolveDshHome(), ATTACHMENT_OBJECT_DIR, hash.slice(0, 2), hash)
}

/**
 * 按文件头判断图片类型。
 *
 * 附件对象没有扩展名，只能看魔数；只识别宿主会写出的位图格式，
 * 不把文本类内容（如 SVG、脚本）当作图片返回。
 * @param data 文件头部字节
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
 * 读文件头部若干字节。
 * @param filePath 文件路径
 * @returns 头部内容；读取失败时返回 undefined
 */
async function readHead(filePath: string): Promise<Buffer | undefined> {
  let handle

  try {
    handle = await open(filePath, 'r')
    const buffer = Buffer.alloc(TYPE_PROBE_BYTES)
    const { bytesRead } = await handle.read(buffer, 0, TYPE_PROBE_BYTES, 0)

    return buffer.subarray(0, bytesRead)
  } catch (error) {
    console.warn('[image-preview] 读取图片头部失败:', filePath, error)

    return undefined
  } finally {
    await handle?.close()
  }
}

/** 图片响应的公共头：禁止缓存、禁止嗅探，并用 CSP 禁掉脚本与外部资源。 */
const IMAGE_HEADERS = {
  'cache-control': 'no-store, no-cache, must-revalidate',
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
} as const

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

  // 既不是扩展名白名单也不是附件对象时已拒绝；到这里再按目录白名单收窄
  const decision = await resolveAllowedPath(filePath)
  if (!decision.ok) {
    if (decision.reason === 'missing') {
      sendJson(response, 404, { error: '图片不存在或不可读' })
      return
    }

    sendJson(response, 403, { error: '图片路径不在允许的目录内' })
    return
  }

  const realPath = decision.path

  if (attachmentObject) {
    const root = join(resolveDshHome(), ATTACHMENT_OBJECT_DIR)
    // 附件对象也要求真实路径仍在附件库内：符号链接不能把它带到别处
    if (!realPath.startsWith(`${resolve(root)}${sep}`) && realPath !== resolve(root)) {
      sendJson(response, 403, { error: '附件路径越界' })
      return
    }
  }

  let info
  try {
    info = await stat(realPath)
  } catch (error) {
    console.warn('[image-preview] 读取图片状态失败:', realPath, error)
    sendJson(response, 404, { error: '图片不存在或不可读' })
    return
  }

  if (!info.isFile()) {
    sendJson(response, 404, { error: '不是文件' })
    return
  }

  if (info.size > MAX_FILE_BYTES) {
    sendJson(response, 413, { error: '图片体积超过上限' })
    return
  }

  // 附件对象没有扩展名：只读头部探测类型，不把整份文件读进内存
  let contentType = extensionType
  if (contentType === undefined) {
    const head = await readHead(realPath)
    const detected = head === undefined ? undefined : detectImageType(head)
    if (detected === undefined) {
      sendJson(response, 415, { error: '文件内容不是受支持的图片' })
      return
    }

    contentType = detected
  }

  response.writeHead(200, {
    ...IMAGE_HEADERS,
    'content-type': contentType,
    'content-length': info.size,
  })

  // HEAD 只需要元数据：此前也会完整读盘，纯属浪费
  if (request.method === 'HEAD') {
    response.end()
    return
  }

  const stream = createReadStream(realPath)
  stream.on('error', (error) => {
    console.warn('[image-preview] 读取图片流失败:', realPath, error)
    if (!response.headersSent) {
      sendJson(response, 404, { error: '图片不存在或不可读' })
      return
    }

    response.destroy(error)
  })
  // 客户端提前断开时停止读文件，避免继续占用句柄
  response.on('close', () => stream.destroy())
  stream.pipe(response)
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

      // 整段兜底：URL 解析或文件操作抛错时也要结束响应，不能留下挂起的连接
      try {
        const url = new URL(request.url ?? ROUTE_PATH, 'http://localhost')

        if (url.pathname !== ROUTE_PATH) {
          sendJson(response, 404, { error: '未知接口' })
          return
        }

        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.writeHead(405, { allow: 'GET, HEAD' })
          response.end()
          return
        }

        // 附件 ID 优先：工具输出里只有 ID，没有可用的文件路径
        const attachmentId = url.searchParams.get('attachment')
        if (attachmentId !== null) {
          const attachmentPath = resolveAttachmentPath(attachmentId)
          if (attachmentPath === undefined) {
            sendJson(response, 400, { error: '附件 ID 格式不正确' })
            return
          }

          await sendImage(request, response, attachmentPath)
          return
        }

        const rawPath = url.searchParams.get('path')

        if (rawPath === null || rawPath === '') {
          sendJson(response, 400, { error: '缺少 path 或 attachment 参数' })
          return
        }

        // 浏览器不知道用户主目录，`~/` 由宿主展开；其余相对路径无法定位，直接拒绝
        const filePath = rawPath.startsWith('~/') ? join(homedir(), rawPath.slice(2)) : rawPath

        if (!isAbsolute(filePath)) {
          sendJson(response, 400, { error: '只接受绝对路径' })
          return
        }

        await sendImage(request, response, filePath)
      } catch (error) {
        console.error('[image-preview] 处理图片请求失败:', error)
        if (!response.headersSent) {
          sendJson(response, 500, {
            error: error instanceof Error ? error.message : String(error),
          })
          return
        }

        if (!response.writableEnded) response.end()
      }
    },
  })
}
