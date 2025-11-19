import { access, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { prompt } from 'enquirer'
import { defaultOptions } from '../config'

/**
 * 函数：在项目根目录生成 quiteer 配置文件
 * 作用：若已有配置则询问是否覆盖；按默认配置生成 `quiteer.config.ts`
 */
export async function generateConfig() {
  const cwd = process.cwd()
  const configPath = path.join(cwd, 'quiteer.config.ts')

  let exists = true
  try {
    await access(configPath)
  }
  catch {
    exists = false
  }

  if (exists) {
    const { overwrite } = await prompt<{ overwrite: boolean }>([
      {
        name: 'overwrite',
        type: 'confirm',
        message: `检测到已存在配置文件 ${path.basename(configPath)}，是否覆盖？`
      }
    ])

    if (!overwrite)
      return
  }

  const regexList = defaultOptions.gitCommitVerifyIgnores
    .map(r => r.toString())

  // 辅助：将 JSON.stringify 的结果缩进到对象层级
  const indentJson = (val: unknown) => {
    const json = JSON.stringify(val, null, 2)
    return json.split('\n').map((line, i) => (i === 0 ? line : `  ${line}`)).join('\n')
  }

  const fileContent = [
    '// 自动生成的 quiteer 配置文件',
    '',
    'export default {',
    `  cleanupDirs: ${indentJson(defaultOptions.cleanupDirs)},`,
    `  lang: ${JSON.stringify(defaultOptions.lang)},`,
    `  ncuCommandArgs: ${indentJson(defaultOptions.ncuCommandArgs)},`,
    '  gitCommitVerifyIgnores: [',
    ...regexList.map((r, idx, arr) => `    ${r}${idx < arr.length - 1 ? ',' : ''}`),
    '  ]',
    '}',
    ''
  ].join('\n')

  await writeFile(configPath, fileContent, 'utf8')
}
