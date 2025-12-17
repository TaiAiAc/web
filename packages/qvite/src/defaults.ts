import type { QviteConfig } from './typings'
import { resolve } from 'node:path'
import { IconsResolver, NaiveUiResolver } from '@quiteer/vite-plugins'
import { store } from './store'

export function getDefaultOptions() {
  const root = store.get<string>('root')!

  const src = resolve(root, 'src')
  console.log('src :>> ', src)
  const defaultOptions = {
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
        open: false,
        strictPort: false
      },
      resolve: {
        alias: {
          '@': resolve(root, 'src')
        }
      },
      build: {
        minify: false
      }
    }
  } satisfies QviteConfig

  return defaultOptions
}
