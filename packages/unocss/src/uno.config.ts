import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind4 from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig, presetIcons } from 'unocss'
import { rules } from './rule'
import { shortcuts } from './shortcuts'
import { theme } from './theme'

export { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export { defineConfig }

export const unoConfig = defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  rules,
  theme,
  shortcuts,
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1,
      extraProperties: {
        display: 'inline-block'
      },
      warn: true
    }),
    presetWebFonts()
  ]
})
