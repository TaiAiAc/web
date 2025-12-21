import type { VirtualHtmlTag } from '@quiteer/vite-plugins'
import type { InlineConfig, Plugin } from 'vite'
import type { QviteConfig, QvitePlugins } from './typings'
import UnoCSS from '@quiteer/unocss'
import { deepMerge } from '@quiteer/utils'
import { envConfigPlugin, virtualHtmlPlugin } from '@quiteer/vite-plugins'
import { mergeConfig } from 'vite'
import { getDefaultOptions } from './defaults'
import defaultPlugins from './plugins'
import { store } from './store'

type NormalizeConfig = Required<QviteConfig>

function withUnoInjection(config: NormalizeConfig) {
  const { html } = config

  if (!config.UnoCSS)
    return html

  const injection: VirtualHtmlTag = { tag: 'script', attrs: { type: 'module' }, children: `import 'uno.css'`, position: 'head' }

  const next = { ...html }

  if (next.pages) {
    const pages: Record<string, any> = {}
    for (const [k, v] of Object.entries(next.pages)) {
      const cfg = { ...(v || {}) }
      cfg.tags = [...(cfg.tags ?? []), injection]
      pages[k] = cfg
    }
    next.pages = pages as any
  }
  else {
    const cfg = { ...(next.config || {}) }
    cfg.tags = [...(cfg.tags ?? []), injection]
    next.config = cfg as any
  }
  return next
}

export async function normalizeConfig(raw: QviteConfig): Promise<NormalizeConfig> {
  const config = deepMerge<QviteConfig>(getDefaultOptions(raw), raw) as NormalizeConfig
  return config
}

export function geVitePlugins(config: NormalizeConfig) {
  const { env, plugins } = config
  const html = withUnoInjection(config)

  const pluginKeys = Object.keys(plugins) as (keyof QvitePlugins)[]

  const vitePlugins = pluginKeys.map((key) => {
    const pluginOptions = plugins[key]

    const pluginFn = defaultPlugins[key] as (...args: any[]) => Plugin

    if (Array.isArray(pluginOptions)) {
      return pluginFn(...pluginOptions as any[])
    }

    return null
  }).filter(Boolean) as Plugin[]
  return [...vitePlugins, virtualHtmlPlugin(html), envConfigPlugin(env), config.UnoCSS ? UnoCSS() : undefined]
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
