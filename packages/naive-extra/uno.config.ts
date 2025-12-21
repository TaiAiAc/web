import { defineConfig } from '@quiteer/unocss/uno.config.ts'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  }
})
