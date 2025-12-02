import type { PluginOption } from 'vite'
import type { QvitePlugins } from './typings'
import { fileChangeLoggerPlugin, mockRouterPlugin, Progress, removeConsolePlugin, UnoCSS, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'

export default {
  FileChangeLogger: fileChangeLoggerPlugin,
  MockRouter: mockRouterPlugin,
  RemoveConsole: removeConsolePlugin,
  Progress,
  Vue,
  VueDevTools,
  VueJsx,
  UnoCSS
} satisfies Record<keyof QvitePlugins, (...args: any[]) => PluginOption>
