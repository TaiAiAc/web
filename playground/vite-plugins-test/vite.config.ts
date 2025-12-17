import process from 'node:process'
import { bootstrapEnv, envConfigPlugin, fileChangeLoggerPlugin, mockRouterPlugin, Progress, removeConsolePlugin, virtualHtmlPlugin } from '@quiteer/vite-plugins'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  await bootstrapEnv({ mode, includePrefixes: ['VITE_'] })
  const env = loadEnv(mode, process.cwd(), ['NODE', 'VITE'])
  console.log('env: ', env)
  return ({
    plugins: [
      vue(),
      Progress(),
      /**
       * 示例：在 vite.config.ts 中使用带类型提示的插件选项
       *
       * `VirtualHtmlOptions` 为插件选项类型，能提供 IDE 自动补全与校验
       */
      virtualHtmlPlugin({
        fallbackWhenIndexExists: true,
        config: {
          title: '',
          script: [{
            src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
            async: true,
            position: 'body-append',
            attrs: { 'data-demo': 'quiteer' }
          }],
          link: [{
            src: '/src/style.css',
            media: 'screen',
            position: 'head',
            attrs: { id: 'demo-style' }
          }],
          tags: [
            { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, selfClosing: true, position: 'body-append' }
          ]
        },
        pages: {
          '/nested/index.html': {
            title: 'Nested Page',
            entry: '/src/nested/main.ts',
            link: [{ src: '/src/style.css', position: 'head' }]
          },
          '/group-a/users/index.html': {
            title: 'Users A',
            entry: '/src/nested/main.ts',
            link: [{ src: '/src/style.css', position: 'head' }]
          },
          '/group-b/users/index.html': {
            title: 'Users B',
            entry: '/src/nested/main.ts',
            link: [{ src: '/src/style.css', position: 'head' }]
          }
        }
      }),
      fileChangeLoggerPlugin(),
      mockRouterPlugin(),
      // envTypesPlugin(),
      envConfigPlugin({ obfuscate: false, requiredKeys: ['desc'] }),
      removeConsolePlugin({ processVue: false })
    ]
  })
})
