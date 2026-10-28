/**
 * 把一个技能包翻译成叠加在模式之上的组合行。
 *
 * 技能包只提供自己的部分：系统提示词、技能提供者与隔离行。工具行不在这里
 * 生成——它们由技能包的三态规则从模式自身的行里筛选，见 `compose.ts`；
 * MCP 服务器同理，只按会话屏蔽，不在这里挂载 mcp-client 行。
 */
import type { PowerPack } from '../types'

import { packSkillDir } from './skill-links'
import type { PresetRow } from './standard-rows'

/** 技能包提示词行的包内子入口，注册为 preset 的一行。 */
const PROMPT_ROW_NAME = 'dsh-all-in-one/preset-pack'

/** 隔离行的包内子入口：在预设作用域里屏蔽全局工具与提示词注入。 */
const ISOLATE_ROW_NAME = 'dsh-all-in-one/preset-isolate'

/** 技能提供者行，按规则扫描用户根或技能包专属目录。 */
export const SKILL_FILESYSTEM_ROW = '@deepseek-ai/dsh-skill-filesystem'

/** 模型侧的技能目录与加载工具行。 */
export const TOOL_SKILL_ROW = '@deepseek-ai/dsh-tool-skill'

/** 隔离行配置：只包含需要被屏蔽的内容，空配置不注册该行。 */
export interface IsolatePlan {
  /** 需要屏蔽的全局工具名，来自已装插件的工具归属扫描。 */
  denyTools: string[]
  /**
   * 需要屏蔽的 MCP 服务器名。
   *
   * 只能保存服务器名而不是工具名：MCP 工具在宿主启动后异步发现，组合预设在
   * 工具就绪前就可能注册，此时算出的工具名单是不完整的。隔离行按名字前缀在
   * 运行期重算，工具晚到也能落到掩码里。
   */
  denyMcpServers: string[]
  /** 需要从提示词移除的段名前缀。 */
  hideSections: string[]
  /** 是否丢弃被排除插件对提示词的改写。 */
  strict: boolean
}

/**
 * 组装技能包自己追加的行：提示词、技能提供者与隔离行。
 * @param pack 技能包定义
 * @param isolate 全局能力隔离计划；没有可隔离内容时省略
 * @returns 要接在模式行之后的组合行
 */
export function buildPackRows(pack: PowerPack, isolate?: IsolatePlan): PresetRow[] {
  const rows: PresetRow[] = []

  // 隔离行放在最前面：先登记掩码与装配快照，再让后续行注册自己的工具
  if (isolate !== undefined) {
    rows.push({ id: 'power-pack-isolate', name: ISOLATE_ROW_NAME, config: isolate })
  }

  // 技能包提示词插到系统提示词前部；为空时不注册，保持模式的提示词不变
  if (pack.systemPrompt.trim() !== '') {
    rows.push({
      id: 'power-pack-prompt',
      name: PROMPT_ROW_NAME,
      config: { text: pack.systemPrompt },
    })
  }

  // 技能规则为「全部」时直接扫描用户根，其余模式只扫描技能包专属链接目录
  const skillConfig =
    pack.skills.mode === 'all'
      ? { includeDefaultRoots: true }
      : { includeDefaultRoots: false, customSkillDirs: [packSkillDir(pack.id)] }

  rows.push({ id: 'skill-filesystem', name: SKILL_FILESYSTEM_ROW, config: skillConfig })
  rows.push({ id: 'tool-skill', name: TOOL_SKILL_ROW })

  return rows
}
