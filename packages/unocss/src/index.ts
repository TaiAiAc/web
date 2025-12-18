import type { PluginOption } from 'vite'
import UnoCSS, { defineConfig } from '@unocss/vite'
import unoConfig from './uno.config'

function UnoPreset(): PluginOption {
  return UnoCSS(unoConfig)
}

export { defineConfig, unoConfig }

export default UnoPreset
