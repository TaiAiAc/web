import type { PluginOption } from 'vite'
import UnoCSS from '@unocss/vite'
import { unoConfig } from './uno.config'

function UnoPreset(): PluginOption {
  return UnoCSS(unoConfig)
}

export default UnoPreset
