import React from 'react'

import { Button } from '../../components/Button'
import type { Translate } from '../../types/plugin'
import type { McpServerConfig } from './types'

/** MCP 服务器条目的输入框样式，与设置页其它表单保持一致。 */
const INPUT_CLASS =
  'w-full rounded-lg border border-line1 bg-base px-3 py-1.5 text-[12px] text-primary outline-none placeholder:text-secondary focus:border-brand'

/** 服务器标识的合法字符集，与宿主 mcp-client 的 serverName 规则一致。 */
const SERVER_ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/

interface McpServerEditorProps {
  servers: McpServerConfig[]
  onChange(servers: McpServerConfig[]): void
  /** 已绑定本 feature 前缀的翻译函数。 */
  t: Translate
}

/**
 * 把字符串字典格式化成每行一条 `KEY=VALUE`。
 * @param dict 字典
 * @returns 文本
 */
function formatPairs(dict: Record<string, string>): string {
  return Object.entries(dict)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

/**
 * 解析每行一条的 `KEY=VALUE` 文本，忽略空行与没有等号的行。
 * @param text 文本
 * @returns 字典
 */
function parsePairs(text: string): Record<string, string> {
  const result: Record<string, string> = {}

  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (trimmed === '') continue

    const index = trimmed.indexOf('=')
    if (index <= 0) continue

    result[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1)
  }

  return result
}

/**
 * 创建一个空白 MCP 服务器条目。
 * @param index 序号，用于生成默认标识
 * @returns 新条目
 */
function createServer(index: number): McpServerConfig {
  return {
    id: `mcp-${index}`,
    label: `MCP ${index}`,
    transport: 'stdio',
    command: '',
    args: [],
    env: {},
    url: '',
    headers: {},
  }
}

/**
 * MCP 服务器列表编辑。
 *
 * 每个条目对应宿主的一行 mcp-client；标识直接作为 serverName，因此限制为
 * 宿主允许的字符集，非法标识在输入框下方提示，保存前由页面拦截。
 * @param props 服务器列表、变更回调与翻译函数
 */
export function McpServerEditor({ servers, onChange, t }: McpServerEditorProps) {
  /** 修改单个服务器的一个字段。 */
  const patch = (index: number, change: Partial<McpServerConfig>): void => {
    onChange(servers.map((server, current) => (current === index ? { ...server, ...change } : server)))
  }

  /** 追加一个空白服务器，标识按现有数量递增。 */
  const add = (): void => {
    let index = servers.length + 1
    while (servers.some((server) => server.id === `mcp-${index}`)) index += 1
    onChange([...servers, createServer(index)])
  }

  /** 移除一个服务器。 */
  const remove = (index: number): void => {
    onChange(servers.filter((_, current) => current !== index))
  }

  return (
    <section className="rounded-xl border border-line1 bg-layer1">
      <header className="border-b border-line1 px-4 py-3">
        {/* 区块标题 */}
        <h3 className="text-[13px] font-medium text-primary">{t('mcpServersTitle')}</h3>
        {/* 区块说明 */}
        <p className="mt-1 text-[12px] leading-[18px] text-secondary">{t('mcpHint')}</p>
      </header>

      <div className="flex flex-col gap-3 p-4">
        {servers.length === 0 ? (
          // 尚未配置任何服务器时的提示
          <p className="text-[12px] text-secondary">{t('mcpEmpty')}</p>
        ) : null}

        {servers.map((server, index) => (
          <div key={`${server.id}-${index}`} className="rounded-lg border border-line1 bg-base p-3">
            {/* 服务器头部：展示名与移除按钮 */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium text-primary">
                {server.label || server.id}
              </span>
              {/* 移除该服务器 */}
              <Button variant="ghost" onClick={() => remove(index)}>
                {t('remove')}
              </Button>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="block">
                {/* 服务器标识：同时作为 serverName 与 mcp__ 工具前缀 */}
                <span className="mb-1 block text-[12px] text-secondary">{t('mcpIdLabel')}</span>
                <input
                  value={server.id}
                  onChange={(event) => patch(index, { id: event.target.value.trim() })}
                  className={INPUT_CLASS}
                />
                {SERVER_ID_PATTERN.test(server.id) ? null : (
                  // 标识不合法时立即提示，保存按钮会拦截
                  <span className="mt-1 block text-[12px] text-danger">{t('mcpIdInvalid')}</span>
                )}
              </label>
              <label className="block">
                {/* 服务器展示名 */}
                <span className="mb-1 block text-[12px] text-secondary">{t('mcpLabelLabel')}</span>
                <input
                  value={server.label}
                  onChange={(event) => patch(index, { label: event.target.value })}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="block">
                {/* 传输方式 */}
                <span className="mb-1 block text-[12px] text-secondary">
                  {t('mcpTransportLabel')}
                </span>
                <select
                  value={server.transport}
                  onChange={(event) =>
                    patch(index, {
                      transport: event.target.value === 'streamable-http' ? 'streamable-http' : 'stdio',
                    })
                  }
                  className={INPUT_CLASS}
                >
                  {/* 本地命令方式 */}
                  <option value="stdio">{t('mcpStdio')}</option>
                  {/* 远程 HTTP 方式 */}
                  <option value="streamable-http">{t('mcpHttp')}</option>
                </select>
              </label>
            </div>

            {server.transport === 'stdio' ? (
              <div className="mt-2 flex flex-col gap-2">
                <label className="block">
                  {/* 启动命令 */}
                  <span className="mb-1 block text-[12px] text-secondary">
                    {t('mcpCommandLabel')}
                  </span>
                  <input
                    value={server.command}
                    onChange={(event) => patch(index, { command: event.target.value })}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  {/* 命令参数，每行一个 */}
                  <span className="mb-1 block text-[12px] text-secondary">{t('mcpArgsLabel')}</span>
                  <textarea
                    value={server.args.join('\n')}
                    onChange={(event) =>
                      patch(index, {
                        args: event.target.value.split('\n').filter((arg) => arg.trim() !== ''),
                      })
                    }
                    rows={3}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  {/* 环境变量，每行 KEY=VALUE */}
                  <span className="mb-1 block text-[12px] text-secondary">{t('mcpEnvLabel')}</span>
                  <textarea
                    value={formatPairs(server.env)}
                    onChange={(event) => patch(index, { env: parsePairs(event.target.value) })}
                    rows={3}
                    className={INPUT_CLASS}
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <label className="block">
                  {/* 远程 MCP 地址 */}
                  <span className="mb-1 block text-[12px] text-secondary">{t('mcpUrlLabel')}</span>
                  <input
                    value={server.url}
                    onChange={(event) => patch(index, { url: event.target.value })}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  {/* 请求头，每行 KEY=VALUE */}
                  <span className="mb-1 block text-[12px] text-secondary">
                    {t('mcpHeadersLabel')}
                  </span>
                  <textarea
                    value={formatPairs(server.headers)}
                    onChange={(event) => patch(index, { headers: parsePairs(event.target.value) })}
                    rows={3}
                    className={INPUT_CLASS}
                  />
                </label>
              </div>
            )}
          </div>
        ))}

        {/* 追加一个服务器条目 */}
        <div>
          <Button variant="outline" onClick={add}>
            {t('addMcp')}
          </Button>
        </div>
      </div>
    </section>
  )
}

/**
 * 判断服务器标识是否合法，供保存前校验复用。
 * @param id 服务器标识
 * @returns 合法时返回 true
 */
export function isValidServerId(id: string): boolean {
  return SERVER_ID_PATTERN.test(id)
}
