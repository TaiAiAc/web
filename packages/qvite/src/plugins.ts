import type { PluginOption } from 'vite'
import type { QvitePlugins } from './typings'
import { AutoImport, Components, createSvgIconsPlugin, fileChangeLoggerPlugin, Icons, mockRouterPlugin, Progress, removeConsolePlugin, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'

export default {
  FileChangeLogger: fileChangeLoggerPlugin,
  MockRouter: mockRouterPlugin,
  RemoveConsole: removeConsolePlugin,
  Progress,
  Vue,
  VueDevTools,
  VueJsx,
  Components,
  SvgIcons: createSvgIconsPlugin,
  Icons,
  AutoImport
} satisfies Record<keyof QvitePlugins, (...args: any[]) => PluginOption>
