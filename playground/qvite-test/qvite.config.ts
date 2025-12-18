import type { ConfigEnv } from '@quiteer/vite'
import { defineConfig } from '@quiteer/vite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>

  return {
    html: {
      config: {
        title: env.VITE_TITLE,
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
        }]
      }
    },
    env: {
      requiredKeys: ['desc', 'baseURL']
    },
    vite: {
      server: {
        port: 8091
      }
    },
    UnoCSS: true,
    plugins: {
      MockRouter: [{
        delay: 1000
      }]
    }
  }
})
