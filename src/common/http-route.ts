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
 * @param response 响应对象
 * @param status HTTP 状态码
 * @param body 响应体
 */
export function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  response.end(text)
}

/**
 * 读取请求体并解析 JSON。
 * @param request 入站请求
 * @param maxBytes 请求体上限；超出说明请求异常
 * @returns 解析结果；超出上限或不是合法 JSON 时返回 undefined
 */
export async function readJsonBody(request: IncomingMessage, maxBytes: number): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) return undefined
    chunks.push(buffer)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch (error) {
    console.error('[all-in-one] 解析请求体失败:', error)
    return undefined
  }
}
