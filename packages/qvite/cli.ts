#!/usr/bin/env node
import { cac } from 'cac'
import { version } from './package.json'

import { build } from './src/build'
import { getConfig } from './src/getConfig'
import { store } from './src/store'
import { watch } from './src/watch'

interface Options {
  minify: boolean
}

interface DevOptions extends Options {
  mode: string
  port: number
}

interface BuildOptions extends Options {
  mode: string
}

const cli = cac('qvite')

cli.option('--minify', '使代码进行压缩 ', { default: false })

cli
  .command('[config-file]', 'qvite dev ,启动开发环境热更新') // default command
  .alias('dev')
  .option('-m , --mode <mode>', '[development | production | test | staging | ...] 环境模式 ', { default: 'development' })
  .option('-p , --port <port>', '[number] 渲染进程的端口号 ，如果占用会切换非占用的端口 ', { default: 8090 })
  .action(async (configFile: string = 'qvite.config.ts', options: DevOptions) => {
    const { mode, port, minify } = options

    store.set('command', 'serve')
    store.set('config', configFile)
    store.set('mode', mode)
    store.set('port', port)
    store.set('minify', !!minify)

    const config = await getConfig(configFile)
    watch(config)
  })

cli
  .command('build [root]', '开始构建服务 , 若不指定平台则默认当前操作系统的架构类型')
  .option('-m , --mode <mode>', '[development | production | test | staging | ...] 环境模式 ', { default: 'production' })
  .action(async (configFile: string = 'qvite.config.ts', options: BuildOptions) => {
    const { mode, minify } = options

    store.set('command', 'build')
    store.set('config', configFile)
    store.set('mode', mode)
    store.set('minify', minify)

    const config = await getConfig(configFile)
    build(config)
  })

cli.help()
cli.version(version)
cli.parse()
