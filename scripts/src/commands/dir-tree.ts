import type { DirTreeOption } from '../types'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { gray, lightBlue, lightCyan, lightGreen } from 'kolorist'

/**
 * 生成目录树结构字符串（ASCII Tree）
 * - 默认忽略常见目录：node_modules、.git、dist、out、logs
 * @param root 起始目录，默认为当前工作目录
 * @returns 目录树字符串
 */
export async function buildDirTree(root = process.cwd(), ignoreList?: string[]): Promise<string> {
  const ignore = new Set(ignoreList ?? ['node_modules', '.git', 'dist', 'out', 'logs'])

  async function walk(dir: string, prefix = ''): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true })
    const items = entries
      .filter(e => !ignore.has(e.name))
      .map(e => ({ name: e.name, isDir: e.isDirectory() }))
      .sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1))

    const lines: string[] = []
    const lastIdx = items.length - 1
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      const isLast = i === lastIdx
      const connector = isLast ? '└── ' : '├── '
      const nextPrefix = prefix + (isLast ? '    ' : '│   ')
      lines.push(`${prefix}${connector}${it.name}`)
      if (it.isDir) {
        const sub = await walk(path.join(dir, it.name), nextPrefix)
        lines.push(...sub)
      }
    }
    return lines
  }

  const title = path.basename(root)
  const content = await walk(root)
  return [`|-- ${title}`, ...content].join('\n')
}

/**
 * 根据目录树内容生成 Markdown 并写入文件
 * - 使用代码块包裹，便于阅读
 * @param tree 目录树字符串
 * @param outfile 输出文件路径，默认 `DIRECTORY_TREE.md`
 */
export async function writeDirTreeMd(tree: string, outfile = 'DIRECTORY_TREE.md'): Promise<void> {
  const header = '## 目录结构\n\n'
  const md = `${header}\`\`\`text\n${tree}\n\`\`\`\n`
  await writeFile(path.join(process.cwd(), outfile), md, 'utf8')
}

/**
 * 生成并输出目录结构，支持可选生成 Markdown 文件
 * - 默认只在控制台输出
 * @param dir 目标目录，默认当前工作目录
 * @param md 是否生成 Markdown 文件，默认 false
 */
export async function generateDirTree(dir?: string, opts?: Partial<DirTreeOption>): Promise<void> {
  const target = dir ? path.resolve(process.cwd(), dir) : process.cwd()
  const tree = await buildDirTree(target, opts?.ignore)
  console.info('quiteer-script :>>', gray(`\n${tree}\n`))
  if (opts?.md) {
    const out = opts?.output || 'DIRECTORY_TREE.md'
    await writeDirTreeMd(tree, out)
    console.info(lightCyan('quiteer-script :>>'), lightGreen(`已生成 Markdown: ${lightBlue(out)}`))
  }
}
