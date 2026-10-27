/**
 * 风格专属技能目录。
 *
 * 宿主的 skill-filesystem 只能配置「扫描哪些根目录」，没有按名字排除的选项。
 * 因此「仅引入 / 仅排除」通过一个专属目录实现：目录里只放符号链接，指向被
 * 该风格允许的原始技能，preset 只扫描这个目录。
 */
import { mkdir, rm, symlink } from 'node:fs/promises'
import { join } from 'node:path'

import type { ResourceRule } from '../types'

import { resolveDshHome, type SkillEntry } from './skill-catalog'

/** 风格数据与技能链接目录的根，全部位于 `$DSH_HOME/all-in-one/chat-styles`。 */
export function chatStylesRoot(): string {
  return join(resolveDshHome(), 'all-in-one', 'chat-styles')
}

/**
 * 一个风格专属的技能目录路径。
 * @param styleId 风格标识
 * @returns 该风格的技能根目录
 */
export function styleSkillDir(styleId: string): string {
  return join(chatStylesRoot(), styleId, 'skills')
}

/**
 * 计算规则允许的技能。
 * @param rule 技能规则
 * @param all 当前可用的全部技能
 * @returns 允许进入该风格会话的技能
 */
export function selectSkills(rule: ResourceRule, all: SkillEntry[]): SkillEntry[] {
  const selected = new Set(rule.items)

  switch (rule.mode) {
    case 'all':
      return all
    case 'include':
      return all.filter((skill) => selected.has(skill.name))
    case 'exclude':
      return all.filter((skill) => !selected.has(skill.name))
    default:
      // 规则来自用户配置，未知模式按最保守的「不提供技能」处理
      return []
  }
}

/**
 * 重建风格技能目录：清空后为每个允许的技能建立符号链接。
 *
 * 失败时向上抛出，由调用方写入保存结果并向用户展示，避免风格静默丢掉技能。
 * @param styleId 风格标识
 * @param skills 该风格允许的技能
 * @returns 目录路径
 */
export async function syncStyleSkillDir(styleId: string, skills: SkillEntry[]): Promise<string> {
  const dir = styleSkillDir(styleId)

  try {
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })

    for (const skill of skills) {
      const target = join(dir, `${skill.name}${skill.kind === 'file' ? '.md' : ''}`)
      await symlink(skill.path, target, skill.kind === 'directory' ? 'dir' : 'file')
    }

    return dir
  } catch (error) {
    console.error('[chat-style] 同步技能目录失败:', dir, error)
    throw error
  }
}

/**
 * 删除一个风格的技能目录，用于删除风格时清理。
 * @param styleId 风格标识
 */
export async function removeStyleSkillDir(styleId: string): Promise<void> {
  // 删除整个风格目录，避免留下只剩空壳的 skills 父目录
  const dir = join(chatStylesRoot(), styleId)

  try {
    await rm(dir, { recursive: true, force: true })
  } catch (error) {
    // 清理失败不应阻止风格删除，但要留下可诊断日志
    console.error('[chat-style] 删除技能目录失败:', dir, error)
  }
}
