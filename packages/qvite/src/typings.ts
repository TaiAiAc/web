import type { AutoImport, Components, createSvgIconsPlugin, EnvConfigPluginOptions, fileChangeLoggerPlugin, Icons, mockRouterPlugin, Progress, removeConsolePlugin, UnoCSS, VirtualHtmlOptions, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'
import type { UserConfig } from 'tsdown'
import type { UserConfig as ViteUserConfig } from 'vite'

export type { EnvConfig } from '@quiteer/vite-plugins'

export type PluginOptions<T extends (...args: any) => any> = boolean | Parameters<T>

export interface QvitePlugins {
  Vue?: PluginOptions<typeof Vue>
  UnoCSS?: PluginOptions<typeof UnoCSS>
  VueJsx?: PluginOptions<typeof VueJsx>
  Progress?: PluginOptions<typeof Progress>
  VueDevTools?: PluginOptions<typeof VueDevTools>
  RemoveConsole?: PluginOptions<typeof removeConsolePlugin>
  MockRouter?: PluginOptions<typeof mockRouterPlugin>
  FileChangeLogger?: PluginOptions<typeof fileChangeLoggerPlugin>
  Components?: PluginOptions<typeof Components>
  SvgIcons?: PluginOptions<typeof createSvgIconsPlugin>
  Icons?: PluginOptions<typeof Icons>
  AutoImport?: PluginOptions<typeof AutoImport>
}

export interface QviteConfig {
  vite?: ViteUserConfig
  tsdown?: UserConfig | UserConfig[]
  plugins?: QvitePlugins
  html?: VirtualHtmlOptions
  env?: EnvConfigPluginOptions
}

export type Mode = 'development' | 'production' | 'test' | 'staging' | 'production' | string

export type Command = 'build' | 'serve'

export interface ConfigEnv<T = Record<string, string>> {
  command: Command
  mode: Mode
  env: T
  root: string
}

export type QviteConfigFnObject = (env: ConfigEnv) => QviteConfig
export type QviteConfigFnPromise = (env: ConfigEnv) => Promise<QviteConfig>
export type QviteConfigFn = (env: ConfigEnv) => QviteConfig | Promise<QviteConfig>

export type QviteConfigExport
  = | QviteConfig
    | Promise<QviteConfig>
    | QviteConfigFnObject
    | QviteConfigFnPromise
    | QviteConfigFn
