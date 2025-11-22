import type { Lang } from '../types'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { versionBump } from 'bumpp'
import enquirer from 'enquirer'
import { loadCliOptions } from '../config'
import { execCommand } from '../shared'
import { generateChangelogFiles } from './changelog'

/**
 * 版本管理：交互选择需要提升版本的包、创建自定义前缀标签、生成变更日志
 * - 多层级仓库：通过交互选择需要更新的包，未选中的包跳过
 * - 标签：支持自定义前缀，命名为 <prefix>-v${version}，存在则跳过创建
 * - 变更日志：默认生成 CHANGELOG.md 与 CHANGELOG_TIMELINE.md（中文，both 格式）
 * - 不包含推送操作，如需发布请手动执行 git push / pnpm publish
 * @param {string} [tagPrefix] 标签前缀（可选，留空则交互输入）
 * @returns {Promise<void>} 异步任务
 */
export async function release(tagPrefix?: string): Promise<void> {
  const { prompt: ask } = enquirer
  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])

  const listRaw = await execCommand('git', ['-C', repoRoot, 'ls-files', '**/package.json'])
  const files = listRaw.split('\n').filter(Boolean).filter(p => !p.includes('node_modules'))
  const choices: { name: string, value: string }[] = []
  for (const rel of files) {
    try {
      const abs = path.join(repoRoot, rel)
      const json = JSON.parse(await readFile(abs, 'utf8'))
      if (json?.name)
        choices.push({ name: `${json.name} (${rel})`, value: rel })
    }
    catch {}
  }

  const sel = await ask<{ selected: string[] }>([
    { name: 'selected', type: 'multiselect', message: '选择需要提升版本的包（空格选择，回车确认）', choices }
  ])
  const selectedRaw = sel?.selected ?? []
  const selected = selectedRaw
    .map((s) => {
      const found = choices.find(c => c.value === s || c.name === s)
      return found?.value || s
    })
    .filter(Boolean)
  if (!selected.length)
    return

  await versionBump({
    files: selected.map(rel => path.join(repoRoot, rel)),
    all: false,
    tag: false,
    commit: 'chore(release): v%s'
  })

  const firstPkgPath = path.join(repoRoot, selected[0])
  const version = JSON.parse(await readFile(firstPkgPath, 'utf8')).version as string
  let prefix = tagPrefix
  if (prefix === undefined) {
    try {
      const res = await ask<{ prefix: string }>([
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
  if (!exists.trim())
    await execCommand('git', ['tag', '--annotate', '--message', `chore(projects): release ${tagName}`, tagName])

  const cli = await loadCliOptions()
  const lang: Lang = cli.lang
  await generateChangelogFiles({
    lang,
    format: cli.changelog.formats,
    groupOutput: cli.changelog.groupOutput,
    timelineOutput: cli.changelog.timelineOutput
  })
}
