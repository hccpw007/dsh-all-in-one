import type { FeatureDefinition } from '../../shell/registry'
import * as chatStyleClient from './client'
import { ChatStyleEntry } from './entry'
import { chatStyleLocales } from './locales'
import { ChatStylePage } from './page'

/**
 * 「对话风格」的注册定义。
 *
 * 每个风格在宿主侧注册为一个 Agent 预设，新建任务的预设选择器即可选到；
 * 设置页负责创建、编辑与删除风格，客户端扩展把选择器带进新会话界面。
 */
const chatStyleFeature: FeatureDefinition = {
  id: 'chat-style',
  order: 20,
  entry: ChatStyleEntry,
  page: ChatStylePage,
  client: chatStyleClient,
  locales: chatStyleLocales,
}

export default chatStyleFeature
