import type { ConfigEnv } from '@quiteer/vite'
import { defineConfig } from '@quiteer/vite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>
  console.log('envConfig: ', envConfig)
  console.log('env: ', env)

  return {
    html: {
      config: {
        title: env.VITE_TITLE,
        script: {
          src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
          async: true,
          position: 'body-append',
          attrs: { 'data-demo': 'quiteer' }
        },
        style: {
          src: '/src/style.css',
          media: 'screen',
          position: 'head',
          attrs: { id: 'demo-style' }
        },
        tags: [
          { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, children: '测试文字', selfClosing: true, position: 'body-append' }
        ]
      }
    },
    env: {
      requiredKeys: ['desc', 'baseURL']
    },
    vite: {
      server: {
        port: 8090
      }
    },
    plugins: {
      MockRouter: [{
        delay: 1000
      }]
    }
  }
})
