import type { Lang } from '../types'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { prompt } from 'enquirer'
import { locales } from '../locales'
import { execCommand } from '../shared'

interface PromptObject {
  types: string
  scopes: string
  description: string
}

/**
 * 交互式添加变更文件到暂存区
 * - 先询问是否添加全部；若否，列出变更文件供多选后执行 git add
 * - 在非交互或输入中断等情况下安全退出，不抛出未处理异常
 * @returns {Promise<void>} 异步任务
 */
export async function gitCommitAdd(): Promise<void> {
  try {
    const res = await prompt<{ confirm: boolean }>([
      {
        name: 'confirm',
        type: 'confirm',
        message: '是否添加所有变更文件到暂存区？'
      }
    ])

    const confirm = !!res?.confirm

    if (!confirm) {
      const stdout = await execCommand('git', ['diff', '--name-only'])
      const files = stdout.split('\n').filter(Boolean)

      if (files.length === 0)
        return

      const sel = await prompt<{ selected: string[] }>([
        {
          name: 'selected',
          type: 'multiselect',
          message: '选择需要添加到暂存区的文件（空格选择，回车确认）',
          choices: files.map(f => ({ name: f, value: f }))
        }
      ])

      const selected = sel?.selected ?? []
      if (!selected.length)
        return

      await execCommand('git', ['add', ...selected], { stdio: 'inherit' })
      return
    }

    await execCommand('git', ['add', '.'], { stdio: 'inherit' })
  }
  catch {

  }
}

/**
 * 交互式生成符合 Conventional Commits 的提交信息并执行提交
 * - 支持取消或非交互环境下安全退出
 * @param {Lang} lang 交互提示语言
 * @returns {Promise<void>} 异步任务
 */
export async function gitCommit(lang: Lang = 'en-us'): Promise<void> {
  try {
    const { gitCommitMessages, gitCommitTypes, gitCommitScopes } = locales[lang]

    const typesChoices = gitCommitTypes.map(([value, msg]) => {
      const nameWithSuffix = `${value}:`
      const message = `${nameWithSuffix.padEnd(12)}${msg}`
      return { name: value, message }
    })

    const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
      name: value,
      message: `${value.padEnd(30)} (${msg})`
    }))

    const result = await prompt<PromptObject>([
      { name: 'types', type: 'select', message: gitCommitMessages.types, choices: typesChoices },
      { name: 'scopes', type: 'select', message: gitCommitMessages.scopes, choices: scopesChoices },
      { name: 'description', type: 'text', message: gitCommitMessages.description }
    ])

    if (!result)
      return

    const breaking = result.description.startsWith('!') ? '!' : ''
    const description = result.description.replace(/^!/, '').trim()
    const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`

    await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' })
  }
  catch {

  }
}

/** Git commit message verify */
export async function gitCommitVerify(lang: Lang = 'zh-cn', ignores: RegExp[] = []) {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel'])

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG')

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim()

  if (ignores.some(regExp => regExp.test(commitMsg)))
    return

  // eslint-disable-next-line regexp/no-unused-capturing-group
  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i

  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify

    throw new Error(errorMsg)
  }
}
