/**
 * 插件注册的本地 HTTP 路由公用工具。
 *
 * 多个 feature 都要注册「只允许本机访问」的 JSON 路由：技能包配置、会话删除
 * 都属敏感写入，必须拒绝远程访客。这里统一收发格式与回环校验，避免各功能
 * 各写一套判定而出现漏检。
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

/** 回环地址集合，用于确认请求来自本机。 */
const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

/**
 * 判断请求是否来自本机。
 * @param request 入站请求
 * @returns 只有回环地址返回 true
 */
export function isLocalRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress ?? ''
  return LOOPBACK_ADDRESSES.has(address)
}

/**
 * 写 JSON 响应。
 *
 * 已发出响应头时再写会抛 `ERR_HTTP_HEADERS_SENT`，并覆盖掉真正的错误原因；
 * 这里统一拦下并结束响应，调用方的 catch 因此不必各自判断 `headersSent`。
 * @param response 响应对象
 * @param status HTTP 状态码
 * @param body 响应体
 */
export function sendJson(response: ServerResponse, status: number, body: unknown): void {
  if (response.headersSent) {
    console.warn('[all-in-one] 响应已发出，跳过重复写入:', status)
    if (!response.writableEnded) response.end()

    return
  }

  const text = JSON.stringify(body)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  response.end(text)
}

/**
 * 请求体的解析结果。
 *
 * 用判别式区分「超限」与「不是合法 JSON」：两者对客户端是不同错误（413 / 400），
 * 合并成 `undefined` 会让超限请求得到误导性的提示。
 */
export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: 'invalid' | 'too_large' }

/**
 * 读取请求体并解析 JSON。
 * @param request 入站请求
 * @param maxBytes 请求体上限；超出说明请求异常
 * @returns 解析结果
 */
export async function readJsonBody(
  request: IncomingMessage,
  maxBytes: number,
): Promise<JsonBodyResult> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) {
      // 丢弃剩余内容，避免连接里残留未读字节影响后续复用
      request.resume()

      return { ok: false, reason: 'too_large' }
    }
    chunks.push(buffer)
  }

  try {
    return { ok: true, value: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown }
  } catch (error) {
    console.error('[all-in-one] 解析请求体失败:', error)

    return { ok: false, reason: 'invalid' }
  }
}

/**
 * 把请求体错误转成响应。
 * @param response 响应对象
 * @param result 失败的解析结果
 * @param invalidMessage 内容不合法时的提示
 */
export function sendJsonBodyError(
  response: ServerResponse,
  result: Extract<JsonBodyResult, { ok: false }>,
  invalidMessage: string,
): void {
  if (result.reason === 'too_large') {
    sendJson(response, 413, { error: '请求体超过上限' })

    return
  }

  sendJson(response, 400, { error: invalidMessage })
}
