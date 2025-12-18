import { unoConfig } from '@quiteer/unocss'
import { defineConfig } from '@unocss/vite'

export default defineConfig({
  ...unoConfig,
  shortcuts: {
    ...unoConfig.shortcuts,
    // 覆盖 flex-center 类
    'flex-center': 'bg-red w-100 h-100'
  }
})
