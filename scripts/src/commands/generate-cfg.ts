import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { defaultOptions } from '../config'

/**
 * 函数：在项目根目录生成 quiteer 配置文件
 * 作用：若已有配置则询问是否覆盖；按默认配置生成 `quiteer.config.ts`
 */
export async function generateConfig() {
  const cwd = process.cwd()
  const configPath = path.join(cwd, 'quiteer.config.ts')

  const regexList = defaultOptions.gitCommitVerifyIgnores
    .map(r => r.toString())

  // 辅助：将 JSON.stringify 的结果缩进到对象层级
  const indentJson = (val: unknown) => {
    const json = JSON.stringify(val, null, 2)
    return json.split('\n').map((line, i) => (i === 0 ? line : `  ${line}`)).join('\n')
  }

  const fileContent = [
    '// 自动生成的 quiteer 配置文件',
    '// 说明：可在此文件中覆盖默认配置项，所有未定义项将采用默认值',
    '',
    'export default {',
    '  // 清理命令默认清理的目录（支持 glob）',
    `  cleanupDirs: ${indentJson(defaultOptions.cleanupDirs)},`,
    '',
    '  // CLI 提示语言：zh-cn | en-us',
    `  lang: ${JSON.stringify(defaultOptions.lang)},`,
    '',
    '  // npm-check-updates 命令参数',
    `  ncuCommandArgs: ${indentJson(defaultOptions.ncuCommandArgs)},`,
    '',
    '  // 提交信息校验的忽略规则（正则）',
    '  gitCommitVerifyIgnores: [',
    ...regexList.map((r, idx, arr) => `    ${r}${idx < arr.length - 1 ? ',' : ''}`),
    '  ],',
    '',
    '  // 发布配置：执行的发布命令与是否推送',
    `  release: ${indentJson(defaultOptions.release)},`,
    '',
    '  // changelog 配置（仅保留输出文件与样式）',
    `  changelog: ${indentJson(defaultOptions.changelog)},`,
    '',
    '  // git-commit 配置：是否默认添加变更文件到暂存区',
    `  gitCommit: ${indentJson(defaultOptions.gitCommit)},`,
    '}',
    ''
  ].join('\n')

  await writeFile(configPath, fileContent, 'utf8')
}
