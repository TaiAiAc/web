import type { InlineConfig, Plugin } from 'vite'
import type { QviteConfig, QvitePlugins } from './typings'
import { deepMerge } from '@quiteer/utils'
import { envConfigPlugin, virtualHtmlPlugin } from '@quiteer/vite-plugins'
import { mergeConfig } from 'vite'
import { defaultOptions } from './defaults'
import defaultPlugins from './plugins'
import { store } from './store'

type NormalizeConfig = Required<QviteConfig>

export async function normalizeConfig(raw: QviteConfig): Promise<NormalizeConfig> {
  const config = deepMerge<QviteConfig>(defaultOptions, raw) as NormalizeConfig
  return config
}

export function geVitePlugins(config: NormalizeConfig) {
  const { html, env, plugins } = config

  const pluginKeys = Object.keys(plugins) as (keyof QvitePlugins)[]

  const vitePlugins = pluginKeys.map((key) => {
    const pluginOptions = plugins[key]

    const pluginFn = defaultPlugins[key] as (...args: any[]) => Plugin

    if (Array.isArray(pluginOptions)) {
      return pluginFn(...pluginOptions as any[])
    }

    return null
  }).filter(Boolean) as Plugin[]
  return [...vitePlugins, virtualHtmlPlugin(html), envConfigPlugin(env)]
}

export async function toViteInlineConfig(config: NormalizeConfig): Promise<InlineConfig> {
  const mode = store.get<string>('mode')!
  const root = store.get<string>('root')!

  const plugins = geVitePlugins(config)

  const inline: InlineConfig = mergeConfig({
    configFile: false,
    root,
    mode,
    plugins
  }, { ...config.vite })

  return inline
}
