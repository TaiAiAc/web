import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { versionBump } from 'bumpp'
import { prompt } from 'enquirer'
import { execCommand } from '../shared'

/**
 * 发布流程：版本号提升、生成变更日志、提交与打标签
 * - 先统一完成版本号提升与提交（禁用内置打标签以避免已存在标签导致中断）
 * - 支持可选标签前缀（从 CLI 传入或交互输入），避免多包仓库使用全局标签
 * - 读取根 package.json 的版本号，若标签不存在则创建并推送
 * @param {string} execute 发布前执行的命令
 * @param {boolean} push 是否推送提交/标签
 * @param {string} [tagPrefix] 标签前缀（可选）
 * @returns {Promise<void>} 异步任务
 */
export async function release(execute: string, push = true, tagPrefix?: string): Promise<void> {
  await versionBump({
    files: ['**/package.json', '!**/node_modules'],
    execute,
    all: true,
    tag: false,
    commit: 'chore(projects): release v%s',
    push
  })

  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])
  const pkgPath = path.join(repoRoot, 'package.json')
  const content = await readFile(pkgPath, 'utf8')
  const version = JSON.parse(content).version as string
  let prefix = tagPrefix
  if (prefix === undefined) {
    try {
      const res = await prompt<{ prefix: string }>([
        { name: 'prefix', type: 'text', message: '请输入标签前缀（可留空）' }
      ])
      prefix = res?.prefix?.trim() || ''
    }
    catch {
      prefix = ''
    }
  }
  const tagName = `${prefix ? `${prefix}-` : ''}v${version}`

  const exists = await execCommand('git', ['tag', '--list', tagName])
  if (!exists.trim()) {
    await execCommand('git', ['tag', '--annotate', '--message', `chore(projects): release ${tagName}`, tagName])
    if (push)
      await execCommand('git', ['push', '--tags'])
  }

  // 补充：若变更日志文件存在未提交的更改，提交并推送，保证后续 publish 的 git-checks 通过
  const status = await execCommand('git', ['-C', repoRoot, 'status', '--porcelain'])
  if (status.trim()) {
    const files = status.split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => l.replace(/^\S+\s+/, ''))
      .filter(f => f.endsWith('CHANGELOG.md') || f.endsWith('CHANGELOG_TIMELINE.md'))
    if (files.length) {
      await execCommand('git', ['-C', repoRoot, 'add', ...files])
      await execCommand('git', ['-C', repoRoot, 'commit', '-m', 'docs(changelog): update'])
      if (push)
        await execCommand('git', ['-C', repoRoot, 'push'])
    }
  }
}
