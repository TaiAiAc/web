import type { Lang } from '../types'
import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { getChangelogHeadingMap } from '../locales'
import { execCommand } from '../shared'

interface CommitItem {
  type: string
  scope?: string
  description: string
  hash: string
  short: string
  author: string
  email: string
  date: string
  added: number
  deleted: number
  filesAdded?: string[]
  filesModified?: string[]
  filesDeleted?: string[]
}

/**
 * 获取分组标题映射（使用 locales/changelog 聚合配置）
 * @param lang 输出语言
 */
function getHeadingMap(lang: Lang): Record<string, string> {
  return getChangelogHeadingMap(lang)
}

function parseCommit(line: string): CommitItem | null {
  const [hash, short, date, author, email, subject] = line.split('|')
  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?!?: (?<description>.+)/i
  const m = subject.match(REG_EXP)
  if (!m?.groups)
    return null
  const type = m.groups.type.toLowerCase()
  const scope = m.groups.scope
  const description = m.groups.description.trim()
  return { type, scope, description, hash, short, author, email, date, added: 0, deleted: 0 }
}

function groupByType(items: CommitItem[], lang: Lang): Map<string, CommitItem[]> {
  const map = new Map<string, CommitItem[]>()
  const headingMap = getHeadingMap(lang)
  for (const it of items) {
    const heading = headingMap[it.type] || (lang === 'en-us' ? 'Other' : '其他')
    const arr = map.get(heading) || []
    arr.push(it)
    map.set(heading, arr)
  }
  return map
}

/** 获取类型图标映射 */
function getTypeIcon(type: string): string {
  const map: Record<string, string> = {
    'feat': '✨ ',
    'feat-wip': '🧪 ',
    'fix': '🐛 ',
    'docs': '📝 ',
    'style': '🎨 ',
    'refactor': '♻️ ',
    'perf': '⚡ ',
    'optimize': '🧹 ',
    'test': '✅ ',
    'build': '🏗️ ',
    'ci': '⚙️ ',
    'chore': '🔧 ',
    'deps': '📦 ',
    'revert': '⏪ ',
    'typo': '✏️ '
  }
  return map[type] || ''
}

async function getTags(): Promise<string[]> {
  const stdout = await execCommand('git', ['tag', '--list', '--sort=-version:refname'])
  return stdout.split('\n').filter(Boolean)
}

async function getRootCommit(): Promise<string> {
  return await execCommand('git', ['rev-list', '--max-parents=0', 'HEAD'])
}

async function getDateForRef(ref: string): Promise<string> {
  const date = await execCommand('git', ['log', '-1', '--date=short', '--format=%ad', ref])
  return date || new Date().toISOString().slice(0, 10)
}

async function getCommitsInRange(range: string): Promise<CommitItem[]> {
  const stdout = await execCommand('git', ['log', range, '--no-merges', '--pretty=format:%H|%h|%ad|%an|%ae|%s', '--date=format:%Y-%m-%d %H:%M %z'])
  const lines = stdout.split('\n').filter(Boolean)
  const items = lines.map(parseCommit).filter((x): x is CommitItem => !!x)
  return items
}

/**
 * 读取 package homepage 以生成提交链接
 * @returns 仓库主页 URL
 */
async function readHomepage(): Promise<string | undefined> {
  try {
    const pkgPath = path.join(process.cwd(), 'scripts', 'package.json')
    const content = await readFile(pkgPath, 'utf8')
    const json = JSON.parse(content)
    return typeof json.homepage === 'string' ? json.homepage.replace(/\/$/, '') : undefined
  }
  catch {
    return undefined
  }
}

async function prependFile(filePath: string, content: string) {
  try {
    await access(filePath)
    const prev = await readFile(filePath, 'utf8')
    const next = [content.trim(), '', prev.trim()].join('\n')
    await writeFile(filePath, next, 'utf8')
  }
  catch {
    await writeFile(filePath, `${content.trim()}\n`, 'utf8')
  }
}

/**
 * 为每个提交补充变更文件与统计信息
 * @param items 提交项
 */
async function enrichCommit(items: CommitItem[]): Promise<CommitItem[]> {
  const results: CommitItem[] = []
  for (const it of items) {
    const out = await execCommand('git', ['show', it.hash, '--numstat', '--pretty=format:'])
    let added = 0
    let deleted = 0
    for (const line of out.split('\n').filter(Boolean)) {
      const parts = line.split('\t')
      if (parts.length === 3) {
        const ai = Number.parseInt(parts[0], 10)
        const di = Number.parseInt(parts[1], 10)
        if (!Number.isNaN(ai))
          added += ai
        if (!Number.isNaN(di))
          deleted += di
      }
    }
    const statusOut = await execCommand('git', ['show', it.hash, '--name-status', '--pretty=format:'])
    const filesAdded: string[] = []
    const filesModified: string[] = []
    const filesDeleted: string[] = []
    for (const sLine of statusOut.split('\n').filter(Boolean)) {
      const [status, file] = sLine.split('\t')
      if (status === 'A')
        filesAdded.push(file)
      else if (status === 'M')
        filesModified.push(file)
      else if (status === 'D')
        filesDeleted.push(file)
      else if (status?.startsWith('R') && file)
        filesModified.push(file)
    }
    results.push({ ...it, added, deleted, filesAdded, filesModified, filesDeleted })
  }
  return results
}

function formatSection(title: string, date: string, items: CommitItem[], repoUrl: string | undefined, lang: Lang) {
  const groups = groupByType(items, lang)
  const lines: string[] = []
  lines.push('## 变更日志')
  lines.push('')
  for (const [heading, arr] of groups) {
    if (!arr.length)
      continue
    lines.push(`### ${heading}`)
    const dayMap = groupByDay(arr)
    for (const [day, list] of dayMap) {
      const dayAdded = list.reduce((s, c) => s + ((c.filesAdded?.length) || 0), 0)
      const dayMod = list.reduce((s, c) => s + ((c.filesModified?.length) || 0), 0)
      const dayDel = list.reduce((s, c) => s + ((c.filesDeleted?.length) || 0), 0)
      lines.push(`#### ${day} \`✏️ ${dayMod}+\` \`➕ ${dayAdded}+\` \`🗑️ ${dayDel}+\``)
      for (const it of list) {
        const scopeFmt = it.scope ? `\`${it.scope}\`` : ''
        const link = repoUrl ? ` ([\`${it.short}\`](${repoUrl}/commit/${it.hash}))` : ''
        const email = ` <${it.email}>`
        const typeIcon = getTypeIcon(it.type)
        const typeLabel = it.type === 'chore' ? '**chore**' : `**${it.type}**`
        const time = getTime(it.date)
        lines.push(`- ${typeIcon} ${typeLabel} ${scopeFmt ? `${scopeFmt}: ` : ''}${it.description}`)
        lines.push(`  > **🕒  ${time}** · \`➕${it.added}\` / \`➖${it.deleted}\``)
        lines.push(`  > \`👤 ${it.author}\` ${email}${link}`)
        for (const f of it.filesAdded ?? []) lines.push(`  - ➕ \`${f}\``)
        for (const f of it.filesModified ?? []) lines.push(`  - ✏️ \`${f}\``)
        for (const f of it.filesDeleted ?? []) lines.push(`  - 🗑️ ~~~~\`${f}\`~~~~`)
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}

function formatTimeline(items: CommitItem[], repoUrl: string | undefined) {
  const lines: string[] = []
  lines.push('## 变更日志')
  lines.push('')
  const dayMap = groupByDay(items)
  for (const [day, list] of dayMap) {
    const dayAdded = list.reduce((s, c) => s + ((c.filesAdded?.length) || 0), 0)
    const dayMod = list.reduce((s, c) => s + ((c.filesModified?.length) || 0), 0)
    const dayDel = list.reduce((s, c) => s + ((c.filesDeleted?.length) || 0), 0)
    lines.push(`### ${day} \`✏️ ${dayMod}+\` \`➕ ${dayAdded}+\` \`🗑️ ${dayDel}+\``)
    for (const it of list) {
      const link = repoUrl ? ` ([\`${it.short}\`](${repoUrl}/commit/${it.hash}))` : ''
      const email = ` <${it.email}>`
      const typeIcon = getTypeIcon(it.type)
      const time = getTime(it.date)
      const scopeFmt = it.scope ? `\`${it.scope}\`` : ''
      const typeLabel = it.type === 'chore' ? '**chore**' : `**${it.type}**`
      lines.push(`- ${typeIcon} ${typeLabel} ${scopeFmt ? `${scopeFmt}: ` : ''}${it.description}`)
      lines.push(`  > **🕒  ${time}** · \`➕${it.added}\` / \`➖${it.deleted}\``)
      lines.push(`  > \`👤 ${it.author}\` ${email}${link}`)
      for (const f of it.filesAdded ?? []) lines.push(`  - ➕ \`${f}\``)
      for (const f of it.filesModified ?? []) lines.push(`  - ✏️ \`${f}\``)
      for (const f of it.filesDeleted ?? []) lines.push(`  - 🗑️ ~~~~\`${f}\`~~~~`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

/**
 * 生成两种样式的 CHANGELOG 文件
 * @param {{ lang: Lang, format: 'group' | 'timeline' | 'both', groupOutput: string, timelineOutput: string }} options 生成选项
 * @param {'zh-cn'|'en-us'} options.lang 输出语言
 * @param {'group'|'timeline'|'both'} options.format 输出样式
 * @param {string} options.groupOutput 分组样式输出文件路径
 * @param {string} options.timelineOutput 时间轴样式输出文件路径
 * @returns {Promise<void>} 异步任务
 */
export async function generateChangelogFiles(options: {
  lang: Lang
  format: 'group' | 'timeline' | 'both'
  groupOutput: string
  timelineOutput: string
}) {
  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])
  const homepage = await readHomepage()
  const tags = await getTags()
  let title = '未发布'
  let date = new Date().toISOString().slice(0, 10)
  let range = ''
  if (tags.length >= 1) {
    const latest = tags[0]
    const prev = tags[1]
    title = latest
    date = await getDateForRef(latest)
    range = prev ? `${prev}..${latest}` : `${await getRootCommit()}..${latest}`
  }
  else {
    range = 'HEAD'
  }
  let items = await getCommitsInRange(range)
  items = await enrichCommit(items)
  const fallback = [`## ${title} - ${date}`, '', '- 无符合 Conventional Commits 标准的提交', ''].join('\n')
  if (options.format === 'group' || options.format === 'both') {
    const content = items.length ? formatSection(title, date, items, homepage, options.lang) : fallback
    const outPath = path.join(repoRoot, options.groupOutput)
    await prependFile(outPath, content)
  }
  if (options.format === 'timeline' || options.format === 'both') {
    const content = items.length ? formatTimeline(items, homepage) : fallback
    const outPath = path.join(repoRoot, options.timelineOutput)
    await prependFile(outPath, content)
  }
}

/**
 * 生成单文件的 CHANGELOG（保留兼容）
 * @param output 输出文件
 * @param lang 语言
 */
export async function generateChangelog(output = 'CHANGELOG.md', lang: Lang = 'zh-cn') {
  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])
  const outPath = path.join(repoRoot, output)
  const homepage = await readHomepage()

  const tags = await getTags()

  let title = '未发布'
  let date = new Date().toISOString().slice(0, 10)
  let range = ''

  if (tags.length >= 1) {
    const latest = tags[0]
    const prev = tags[1]
    title = latest
    date = await getDateForRef(latest)
    if (prev)
      range = `${prev}..${latest}`
    else
      range = `${await getRootCommit()}..${latest}`
  }
  else {
    range = 'HEAD'
  }

  const items = await getCommitsInRange(range)
  const enriched = await enrichCommit(items)

  const section = enriched.length
    ? formatSection(title, date, enriched, homepage, lang)
    : [
        `## ${title} - ${date}`,
        '',
        lang === 'en-us' ? '- No commits matching Conventional Commits' : '- 无符合 Conventional Commits 标准的提交',
        ''
      ].join('\n')

  await prependFile(outPath, section)
}

// 环境变量运行支持已移除，统一通过 CLI 使用

function getDay(d: string): string {
  const m = d.match(/^(\d{4}-\d{2}-\d{2})/)?.[1]
  return m || d
}

function getTime(d: string): string {
  const m = d.match(/^\d{4}-\d{2}-\d{2}\s(\d{2}:\d{2})/)?.[1]
  return m || d
}

function groupByDay(items: CommitItem[]): Map<string, CommitItem[]> {
  const map = new Map<string, CommitItem[]>()
  for (const it of items) {
    const day = getDay(it.date)
    const arr = map.get(day) || []
    arr.push(it)
    map.set(day, arr)
  }
  return map
}
