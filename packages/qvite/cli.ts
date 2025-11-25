#!/usr/bin/env node
import type { QviteConfig } from './src/typings'
import { loadConfig, watchConfig } from 'c12'
import { cac } from 'cac'
import { version } from './package.json'

import { build } from './src/build'
import { defaultOptions } from './src/defaults'
import { store } from './src/store'
import { watch } from './src/watch'

interface Options {
  mode: string
  minify: boolean
}

interface DevOptions extends Options {
  port: number
}

interface BuildOptions extends Options {
  test: any
}

const cli = cac('qvite')

cli.option('-m , --mode <mode>', '[development | production | test | staging | ...] 环境模式 ', { default: 'development' })
cli.option('--minify', '使代码不进行压缩 ', { default: false })

cli
  .command('[arg]', 'qvite dev ,启动开发环境热更新') // default command
  .alias('dev')
  .option('-p , --port <port>', '[number] 渲染进程的端口号 ，如果占用会切换非占用的端口 ', { default: 8090 })
  .action(async (arg: undefined | string, options: DevOptions) => {
    const { mode, port, minify } = options

    const { config } = await watchConfig<QviteConfig>({
      name: 'qvite',
      defaults: defaultOptions,
      packageJson: true,
      overrides: { mode, port, minify },
      onWatch: (event) => {
        console.log('[watcher]', event.type, event.path)
      },
      acceptHMR({ oldConfig, newConfig, getDiff }) {
        console.log(' oldConfig, newConfig: ', oldConfig, newConfig)
        const diff = getDiff()
        if (diff.length === 0) {
          console.log('No config changed detected!')
          return true // No changes!
        }
      },
      onUpdate({ oldConfig, newConfig, getDiff }) {
        console.log(' oldConfig, newConfig: ', oldConfig, newConfig)
        const diff = getDiff()
        console.log(`Config updated:\n${diff.map(i => i.toJSON()).join('\n')}`)
      }
    })

    store.set('command', 'serve')
    store.set('config', arg || 'qvite.config.ts')
    store.set('mode', (mode || 'development'))
    store.set('port', (port || 8090))
    store.set('minify', !!minify)

    watch(config)
  })

cli
  .command('build [root]', '开始构建服务 , 若不指定平台则默认当前操作系统的架构类型')
  .option('-o , --option', '自定义 , 自定义构建选项 ')
  .action(async (configFile: undefined | string, options: BuildOptions) => {
    const { mode, minify } = options

    const { config } = await loadConfig<QviteConfig>({
      name: 'qvite',
      defaults: defaultOptions,
      overrides: { mode, minify },
      packageJson: true
    })

    store.set('command', 'build')
    store.set('config', configFile || 'qvite.config.ts')
    store.set('mode', (mode || 'production'))
    store.set('minify', minify)

    build(config)
  })

cli.help()
cli.version(version)
cli.parse()
