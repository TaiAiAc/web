import type { QviteConfig } from './typings'
import { fileURLToPath } from 'node:url'
import { IconsResolver, NaiveUiResolver } from '@quiteer/vite-plugins'

export const defaultOptions = {
  plugins: {
    Vue: [{ customElement: true }],
    UnoCSS: false,
    VueDevTools: [{}],
    VueJsx: [{}],
    Progress: [{}],
    FileChangeLogger: false,
    RemoveConsole: false,
    MockRouter: false,
    Icons: false,
    SvgIcons: false,
    AutoImport: [{
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }],
    Components: [{
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        NaiveUiResolver(),
        IconsResolver({ customCollections: 'local', componentPrefix: 'icon-loacl' })
      ]
    }]
  },
  html: { },
  env: {
    obfuscate: false,
    requiredKeys: ['desc']
  },
  vite: {
    server: {
      port: 3000,
      strictPort: false
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      minify: false
    }
  }
} satisfies QviteConfig
