import presetIcons from '@unocss/preset-icons'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1,
      extraProperties: {
        display: 'inline-block'
      },
      warn: true
    })
  ]
})
