import type { Plugin } from 'vite'
import type { RemoveConsoleOptions } from './remove-console'

import { envTypesPlugin } from './env-types'
import { fileChangeLoggerPlugin } from './file-change-logger'
import { mockRouterPlugin } from './mock-router'

import { removeConsolePlugin } from './remove-console'

export type { EnvTypesOptions } from './env-types'
export * from './extra'
export type { FileChangeLoggerOptions } from './file-change-logger'
export type { MockRouterOptions } from './mock-router'

/**
 * 函数：创建 Quiteer 插件集合
 * 作用：聚合进度条与移除 console 等插件，便于一键使用
 */
export function createQuiteerPlugins(options?: RemoveConsoleOptions): Plugin[] {
  return [
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    removeConsolePlugin(options)
  ]
}

/**
 * 函数：默认导出单个 removeConsolePlugin
 * 作用：方便在 vite 配置中直接使用；如需进度条请显式导入 buildProgressPlugin
 */
export { envTypesPlugin, fileChangeLoggerPlugin, mockRouterPlugin, removeConsolePlugin }

export type { ConsoleLevel, RemoveConsoleOptions } from './remove-console'
