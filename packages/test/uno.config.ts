import presetIcons from '@unocss/preset-icons'
import presetWind3 from '@unocss/preset-wind3'
import { defineConfig } from '@unocss/vite'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  presets: [
    presetWind3({ dark: 'class' }),
    presetIcons({
      scale: 1,
      extraProperties: {
        display: 'inline-block'
      },
      warn: true
    })
  ]
})
