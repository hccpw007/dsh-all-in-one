/**
 * 「技能包」的 HTTP 路由。
 *
 * 客户端设置页通过同源 fetch 读写技能包。所有写入都要求来自本机回环地址：
 * 技能包会改变后续会话的可用工具与技能，属于敏感配置，不能由远程访客修改。
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

import type { AgentPresetApi, WebServerApi } from '../../../types/host'
import type { PowerPack, PowerPackComposeResponse, PowerPackWriteRequest, PowerPacksPayload } from '../types'

import { listPluginItems } from './catalog'
import { ensureComposedPreset, invalidateComposedPreset } from './presets'
import { listSkillEntries, type SkillEntry } from './skill-catalog'
import {
  removePackSkillDir,
  selectSkills,
  syncPackSkillDir,
} from './skill-links'
import { powerPacksFile, isValidPackId, normalizePack, readPacks, writePacks } from './store'

/** 路由前缀，同时作为客户端请求路径。 */
const ROUTE_PATH = '/dsh-all-in-one/power-packs'

/** 请求体上限；一份技能包配置远小于该值，超出说明请求异常。 */
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
    console.error('[power-pack] 解析请求体失败:', error)
    return undefined
  }
}

/** 组装客户端需要的完整负载。 */
async function buildPayload(): Promise<PowerPacksPayload> {
  const document = await readPacks()
  const skills = await listSkillEntries()
  const plugins = await listPluginItems()

  return {
    packs: document.packs,
    defaultPackId: document.defaultPackId,
    catalog: {
      skills: skills.map(({ name, description }) => ({ name, description })),
      plugins,
    },
    storagePath: powerPacksFile(),
  }
}

/**
 * 按技能规则同步技能包目录，返回最新技能清单供日志与校验使用。
 * @param pack 技能包定义
 * @param allSkills 当前全部技能
 */
async function syncSkills(pack: PowerPack, allSkills: SkillEntry[]): Promise<void> {
  if (pack.skills.mode === 'all') {
    // 「全部」直接扫描用户根，删除旧链接目录避免残留过期链接
    await removePackSkillDir(pack.id)
    return
  }

  await syncPackSkillDir(pack.id, selectSkills(pack.skills, allSkills))
}

/**
 * 保存一个技能包：落盘、同步技能目录、重建预设。
 * @param pack 待保存技能包
 * @returns 保存后的完整负载
 */
async function savePack(pack: PowerPack): Promise<PowerPacksPayload> {
  const allSkills = await listSkillEntries()
  await syncSkills(pack, allSkills)

  const document = await readPacks()
  const index = document.packs.findIndex((item) => item.id === pack.id)

  if (index >= 0) document.packs[index] = pack
  else document.packs.push(pack)

  await writePacks(document)

  return buildPayload()
}

/**
 * 删除一个技能包：落盘、撤销预设、清理技能目录。
 * @param packId 技能包标识
 * @returns 删除后的完整负载
 */
async function deletePack(packId: string): Promise<PowerPacksPayload> {
  const document = await readPacks()
  document.packs = document.packs.filter((pack) => pack.id !== packId)
  // 删除的正是默认技能包时一并清空，避免默认指向不存在的包
  if (document.defaultPackId === packId) document.defaultPackId = ''
  await writePacks(document)

  await removePackSkillDir(packId)

  return buildPayload()
}

/**
 * 设置新建会话默认预选的技能包。
 * @param packId 技能包标识
 * @returns 设置后的完整负载
 */
async function setDefaultPack(packId: string): Promise<PowerPacksPayload> {
  const document = await readPacks()
  if (!document.packs.some((pack) => pack.id === packId)) throw new Error('技能包不存在')

  document.defaultPackId = packId
  await writePacks(document)

  return buildPayload()
}

/** 串行化写入，避免并发保存互相覆盖同一份文档。 */
let writeChain: Promise<unknown> = Promise.resolve()

/**
 * 处理一次写入请求：保存或删除技能包、设置默认技能包，或为「模式 + 技能包」合成组合预设。
 * @param request 写请求体
 * @param api 宿主预设服务
 * @returns 技能包负载，或合成结果的预设 id
 */
async function handleWrite(
  request: PowerPackWriteRequest,
  api: AgentPresetApi,
): Promise<PowerPacksPayload | PowerPackComposeResponse> {
  if (request.action === 'compose') {
    const document = await readPacks()
    const pack = document.packs.find((item) => item.id === request.pack)
    if (!pack) throw new Error('技能包不存在')
    if (request.mode.trim() === '') throw new Error('未指定模式')

    return { presetId: await ensureComposedPreset(api, request.mode, pack) }
  }

  if (request.action === 'delete') {
    if (!isValidPackId(request.id)) throw new Error('技能包标识无效')

    const payload = await deletePack(request.id)
    await invalidateComposedPreset(request.id)
    return payload
  }

  if (request.action === 'setDefault') {
    if (!isValidPackId(request.id)) throw new Error('技能包标识无效')

    return setDefaultPack(request.id)
  }

  const pack = normalizePack(request.pack)
  if (!pack) throw new Error('技能包定义无效')

  const payload = await savePack(pack)
  await invalidateComposedPreset(pack.id)

  return payload
}

/**
 * 注册技能包路由。
 * @param webServer 宿主 Web 服务器
 * @param api 宿主 Agent 预设服务
 * @returns 注销函数
 */
export function installPowerPackRoutes(webServer: WebServerApi, api: AgentPresetApi): () => void {
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
            handleWrite(body as PowerPackWriteRequest, api),
          )
          writeChain = task.catch((error: unknown) => {
            console.error('[power-pack] 写入技能包失败:', error)
          })

          sendJson(response, 200, await task)
          return
        }

        response.writeHead(405, { allow: 'GET, POST' })
        response.end()
      } catch (error) {
        console.error('[power-pack] 处理技能包请求失败:', error)
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  })
}
