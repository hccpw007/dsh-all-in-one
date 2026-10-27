/**
 * 「对话风格」的 HTTP 路由。
 *
 * 客户端设置页通过同源 fetch 读写风格。所有写入都要求来自本机回环地址：
 * 风格会改变后续会话的可用工具与技能，属于敏感配置，不能由远程访客修改。
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

import type { AgentPresetApi, WebServerApi } from '../../../types/host'
import type { ChatStyle, ChatStyleWriteRequest, ChatStylesPayload } from '../types'

import { listPluginItems } from './catalog'
import { registerStylePreset, unregisterStylePreset } from './presets'
import { listSkillEntries, type SkillEntry } from './skill-catalog'
import {
  removeStyleSkillDir,
  selectSkills,
  syncStyleSkillDir,
} from './skill-links'
import { chatStylesFile, isValidStyleId, normalizeStyle, readStyles, writeStyles } from './store'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/chat-styles'

/** 请求体上限；一份风格配置远小于该值，超出说明请求异常。 */
const MAX_BODY_BYTES = 1024 * 1024

/** 回环地址集合，用于确认请求来自本机。 */
const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

/**
 * 判断请求是否来自本机。
 * @param request 入站请求
 * @returns 只有回环地址返回 true
 */
function isLocalRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress ?? ''
  return LOOPBACK_ADDRESSES.has(address)
}

/**
 * 写 JSON 响应。
 * @param response 响应对象
 * @param status HTTP 状态码
 * @param body 响应体
 */
function sendJson(response: ServerResponse, status: number, body: unknown): void {
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
 * @returns 解析结果；超出上限或不是合法 JSON 时返回 undefined
 */
async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) return undefined
    chunks.push(buffer)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch (error) {
    console.error('[chat-style] 解析请求体失败:', error)
    return undefined
  }
}

/** 组装客户端需要的完整负载。 */
async function buildPayload(): Promise<ChatStylesPayload> {
  const document = await readStyles()
  const skills = await listSkillEntries()
  const plugins = await listPluginItems()

  return {
    styles: document.styles,
    catalog: {
      skills: skills.map(({ name, description }) => ({ name, description })),
      plugins,
    },
    storagePath: chatStylesFile(),
  }
}

/**
 * 按技能规则同步风格目录，返回最新技能清单供日志与校验使用。
 * @param style 风格定义
 * @param allSkills 当前全部技能
 */
async function syncSkills(style: ChatStyle, allSkills: SkillEntry[]): Promise<void> {
  if (style.skills.mode === 'all') {
    // 「全部」直接扫描用户根，删除旧链接目录避免残留过期链接
    await removeStyleSkillDir(style.id)
    return
  }

  await syncStyleSkillDir(style.id, selectSkills(style.skills, allSkills))
}

/**
 * 保存一个风格：落盘、同步技能目录、重建预设。
 * @param style 待保存风格
 * @returns 保存后的完整负载
 */
async function saveStyle(style: ChatStyle): Promise<ChatStylesPayload> {
  const allSkills = await listSkillEntries()
  await syncSkills(style, allSkills)

  const document = await readStyles()
  const index = document.styles.findIndex((item) => item.id === style.id)

  if (index >= 0) document.styles[index] = style
  else document.styles.push(style)

  await writeStyles(document)

  return buildPayload()
}

/**
 * 删除一个风格：落盘、撤销预设、清理技能目录。
 * @param styleId 风格标识
 * @returns 删除后的完整负载
 */
async function deleteStyle(styleId: string): Promise<ChatStylesPayload> {
  const document = await readStyles()
  document.styles = document.styles.filter((style) => style.id !== styleId)
  await writeStyles(document)

  await removeStyleSkillDir(styleId)

  return buildPayload()
}

/** 串行化写入，避免并发保存互相覆盖同一份文档。 */
let writeChain: Promise<unknown> = Promise.resolve()

/**
 * 处理一次写入请求。
 * @param request 写请求体
 * @param api 宿主预设服务
 * @returns 响应负载
 */
async function handleWrite(
  request: ChatStyleWriteRequest,
  api: AgentPresetApi,
): Promise<ChatStylesPayload> {
  if (request.action === 'delete') {
    if (!isValidStyleId(request.id)) throw new Error('风格标识无效')

    const payload = await deleteStyle(request.id)
    await unregisterStylePreset(request.id)
    return payload
  }

  const style = normalizeStyle(request.style)
  if (!style) throw new Error('风格定义无效')

  const payload = await saveStyle(style)
  const order = payload.styles.findIndex((item) => item.id === style.id)
  await registerStylePreset(api, style, Math.max(order, 0))

  return payload
}

/**
 * 注册风格路由。
 * @param webServer 宿主 Web 服务器
 * @param api 宿主 Agent 预设服务
 * @returns 注销函数
 */
export function installChatStyleRoutes(webServer: WebServerApi, api: AgentPresetApi): () => void {
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
          sendJson(response, 200, await buildPayload())
          return
        }

        if (request.method === 'POST') {
          const body = await readJsonBody(request)
          if (!body || typeof body !== 'object') {
            sendJson(response, 400, { error: '请求体不是合法 JSON' })
            return
          }

          // 写入串行执行，读取操作仍可并发
          const task = writeChain.then(() =>
            handleWrite(body as ChatStyleWriteRequest, api),
          )
          writeChain = task.catch((error: unknown) => {
            console.error('[chat-style] 写入风格失败:', error)
          })

          sendJson(response, 200, await task)
          return
        }

        response.writeHead(405, { allow: 'GET, POST' })
        response.end()
      } catch (error) {
        console.error('[chat-style] 处理风格请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
