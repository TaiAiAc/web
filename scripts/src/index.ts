#!/usr/bin/env node

import type { Lang } from './types'
import cac from 'cac'
import { bgGreen, blue, gray, lightBlue, lightCyan, lightGreen, white } from 'kolorist'
import { version } from '../package.json'
import { checkUpdateAndNotify, cleanup, generateConfig, generateDirTree, gitCommit, gitCommitAdd, gitCommitVerify, gitRemoteBranches, release, selfUpdate, updatePkg } from './commands'
import { generateChangelogFiles } from './commands/changelog'
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

  const cli = cac(blue('quiteer'))

  await checkUpdateAndNotify()

  cli.command('generate-config', `${bgGreen(white('便捷命令'))} ${lightCyan('qui g')}  在项目根目录下生成配置文件`)
    .alias('g')
    .action(async () => {
      await generateConfig()
    })

  cli.command('remove [path]', `${bgGreen(white('便捷命令'))} ${lightBlue('qui rm')}  删除单个或者多个文件 , 多个值用逗号分隔，递归删除`)
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

  cli.command('cleanup [path]', `${bgGreen(white('便捷命令'))} ${lightBlue('qui c')}  清除目录 node_modules、dist 等`)
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

  cli.command('update-pkg', `${bgGreen(white('便捷命令'))} ${lightBlue('qui u')}  更新 package.json 依赖版本`)
    .alias('u')
    .action(async () => {
      await updatePkg(cliOptions.ncuCommandArgs)
    })

  cli.command('self-update', `${bgGreen(white('便捷命令'))} ${lightCyan('qui su')}  自更新：检查并更新 @quiteer/scripts 到最新版本`)
    .alias('su')
    .action(async () => {
      await selfUpdate()
    })

  cli.command('tree [path]', `${bgGreen(white('便捷命令'))} ${lightBlue('qui t')}  生成当前目录结构（默认控制台输出），可选生成 Markdown`)
    .alias('t')
    .option('--md', '是否生成 Markdown 文件', { default: cliOptions.dirTree.md })
    .action(async (path?: string, args?: { md?: boolean }) => {
      await generateDirTree(path, { md: !!args?.md, output: cliOptions.dirTree.output, ignore: cliOptions.dirTree.ignore })
    })

  cli.command('git-commit', `${bgGreen(white('便捷命令'))} ${lightBlue('qui gc')}  git 提交前后的操作和规范等`)
    .alias('gc')
    .option('--add', '添加所有变更文件到暂存区', { default: cliOptions.gitCommit.add })
    .option('-l ,--lang', '校验提交信息的语言', { default: cliOptions.lang })
    .action(async (args: CommandArg) => {
      if (args?.add) {
        await gitCommitAdd()
      }
      await gitCommit(args?.lang)
    })

  cli.command('git-commit-verify', `${bgGreen(white('便捷命令'))} ${lightBlue('qui gv')}  校验提交信息是否符合 Conventional Commits 标准`)
    .alias('gv')
    .option('-l --lang', '校验提交信息的语言', { default: cliOptions.lang })
    .action(async (args: CommandArg) => {
      await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores)
    })

  cli.command('git-branches [url]', `${bgGreen(white('便捷命令'))} ${lightBlue('qui gb')}  查看远程仓库所有分支（分支名 + 最新时间），倒序排序`)
    .alias('gb')
    .action(async (url?: string) => {
      await gitRemoteBranches(url)
    })

  cli.command('release', `${bgGreen(white('便捷命令'))} ${lightBlue('qui r')}  版本管理：选择包并提升版本，创建自定义前缀标签并生成 changelog`)
    .alias('r')
    .option('--tag-prefix <prefix>', '标签前缀（可选，留空则交互输入）')
    .action(async (args: { tagPrefix?: string }) => {
      await release(args?.tagPrefix)
    })

  cli.command('changelog', `${bgGreen(white('便捷命令'))} ${lightBlue('qui cl')}  生成变更日志 CHANGELOG.md、CHANGELOG_TIMELINE`)
    .alias('cl')
    .option('-f, --format <format>', '输出样式：group|timeline|both', { default: cliOptions.changelog.formats })
    .option('--group-output <path>', '分组样式输出文件', { default: cliOptions.changelog.groupOutput })
    .option('--timeline-output <path>', '时间轴样式输出文件', { default: cliOptions.changelog.timelineOutput })
    .option('-l, --lang <lang>', '输出语言', { default: cliOptions.lang })
    .action(async (args: { format?: 'group' | 'timeline' | 'both', groupOutput?: string, timelineOutput?: string, lang?: Lang }) => {
      const cfg = cliOptions.changelog
      await generateChangelogFiles({
        lang: args.lang || cliOptions.lang,
        format: args.format || cfg.formats,
        groupOutput: args.groupOutput || cfg.groupOutput,
        timelineOutput: args.timelineOutput || cfg.timelineOutput
      })
    })

  cli
    .version(lightGreen(version))
    .help()
    .parse()
}

setupCli()
