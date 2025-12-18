import { defineConfig, unoConfig } from '@quiteer/vite/uno.config.ts'

export default defineConfig({
  ...unoConfig,
  shortcuts: {
    ...unoConfig.shortcuts,
    // 覆盖 flex-center 类
    'flex-center': 'bg-red w-100 h-100'
  }
})
