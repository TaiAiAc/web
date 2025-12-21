import { fileURLToPath, URL } from 'node:url'

import UnoCSS from '@quiteer/unocss'
import { Icons, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 10902
  },
  plugins: [
    Vue(),
    VueJsx(),
    VueDevTools(),
    UnoCSS(),
    Icons()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
