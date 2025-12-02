import type { ConfigEnv } from 'qvite'
import { defineConfig } from 'qvite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>
  console.log('envConfig: ', envConfig)
  console.log('env: ', env)

  return {
    html: {
      config: {
        title: '测试自己的title',
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
          { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, selfClosing: true, position: 'body-append' }
        ]
      }
    },
    vite: {
      server: {
        port: 8090
      }
    }
  }
})
