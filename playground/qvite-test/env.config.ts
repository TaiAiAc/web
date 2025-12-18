import type { EnvConfig } from '@quiteer/vite'

type MyConfig = EnvConfig<'baseURL'>

export default {
  default: {
    desc: {
      value: '通用环境变量',
      obfuscate: false
    },
    testUrl: 'https://quiteerjs.github.io/web/'
  },
  development: {
    desc: '开发环境变量',
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: false
    }
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'https://api.example.com'
  },
  test: {
    desc: '测试环境变量',
    baseURL: 'https://api.test.example.com'
  },
  staging: {
    desc: '预发布环境变量',
    baseURL: 'https://api.staging.example.com'
  },
  release: {
    desc: '发布环境变量',
    baseURL: 'https://api.release.example.com'
  }
} satisfies MyConfig
