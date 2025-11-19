import type { Lang } from './locales'
import cac from 'cac'
import { blue, gray, lightGreen } from 'kolorist'
import { version } from '../package.json'
import { cleanup, generateConfig, gitCommit, gitCommitAdd, gitCommitVerify, release, updatePkg } from './commands'
import { loadCliOptions } from './config'

type CommandArg = Partial<{
  add: boolean
  verify: boolean
  lang: Lang
  execute: string
  push: boolean
}>

export async function setupCli() {
  /**
   * 初始化并注册 CLI
   * - 加载配置，注册命令与选项
   * - 设置中文提示与帮助文案
   * @returns Promise<void>
   */
  const cliOptions = await loadCliOptions()

  const cli = cac(blue('quiteer-scripts'))

  cli
    .version(lightGreen(version))
    .help()

  cli.command('generate-config', '在项目根目录下生成配置文件')
    .alias('g')
    .action(async () => {
      await generateConfig()
    })

  cli.command('remove [path]', '删除单个或者多个文件，多个值用逗号分隔，递归删除')
    .alias('rm')
    .action(async (paths: string) => {
      if (paths && paths.includes(',')) {
        await cleanup(paths.split(','))
      }
      else if (paths) {
        await cleanup([paths])
      }
      else {
        console.info('quiteer-script :>> ', gray('无事发生'))
      }
    })

  cli.command('cleanup [path]', '清除目录 node_modules、dist 等')
    .alias('c')
    .action(async (paths) => {
      if (paths && paths.includes(',')) {
        const path = paths.split(',')
        await cleanup(path)
      }
      else if (paths) {
        await cleanup([paths])
      }
      else {
        await cleanup(cliOptions.cleanupDirs)
      }
    })

  cli.command('update-pkg', '更新 package.json 依赖版本')
    .alias('u')
    .action(async () => {
      await updatePkg(cliOptions.ncuCommandArgs)
    })

  cli.command('git-commit', 'git 提交前后的操作和规范等')
    .alias('git-c')
    .option('--add', '添加所有变更文件到暂存区', { default: true })
    .option('-l ,--lang', '校验提交信息的语言', { default: cliOptions.lang })
    .action(async (args: CommandArg) => {
      if (args?.add) {
        await gitCommitAdd()
      }
      await gitCommit(args?.lang)
    })

  cli.command('git-commit-verify', '校验提交信息是否符合 Conventional Commits 标准')
    .alias('git-v')
    .option('-l --lang', '校验提交信息的语言', { default: cliOptions.lang })
    .action(async (args: CommandArg) => {
      await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores)
    })

  cli.command('release', '发布：更新版本、生成变更日志、提交代码')
    .alias('r')
    .option('--execute', '执行发布的命令')
    .option('--push', '是否推送代码', { default: true })
    .action(async (args: CommandArg) => {
      await release(args?.execute, args?.push)
    })

  cli.parse()
}

setupCli()
