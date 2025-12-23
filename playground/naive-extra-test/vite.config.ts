import { fileURLToPath, URL } from 'node:url'

import UnoCSS from '@quiteer/unocss'
import { AutoImport, Components, Icons, NaiveUiResolver, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 10902
  },
  plugins: [
    VueDevTools(),
    UnoCSS(),
    Vue(),
    VueJsx(),
    UnoCSS(),
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      dts: 'src/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        NaiveUiResolver()
      ]
    }),
    Icons({
      compiler: 'vue3',
      scale: 1,
      defaultClass: 'inline-block'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
