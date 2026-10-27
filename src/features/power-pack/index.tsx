import type { FeatureDefinition } from '../../shell/registry'
import * as powerPackClient from './client'
import { PowerPackEntry } from './entry'
import { powerPackLocales } from './locales'
import { PowerPackPage } from './page'

/**
 * 「技能包」的注册定义。
 *
 * 技能包叠加在新建任务时所选的模式之上，选择时由宿主侧合成为组合预设；
 * 设置页负责创建、编辑与删除技能包，客户端扩展把两个下拉带进新会话界面。
 */
const powerPackFeature: FeatureDefinition = {
  id: 'power-pack',
  order: 20,
  entry: PowerPackEntry,
  page: PowerPackPage,
  client: powerPackClient,
  locales: powerPackLocales,
}

export default powerPackFeature
