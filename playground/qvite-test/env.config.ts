import type { EnvConfig } from '@quiteer/vite-plugins'

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
    },
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'xxx'
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'https://api.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    title: 'prod'
  },
  test: {
    desc: '测试环境变量',
    baseURL: 'https://api.test.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    title: 'test'
  },
  staging: {
    desc: '预发布环境变量',
    baseURL: 'https://api.staging.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    title: 'staging'
  },
  release: {
    desc: '发布环境变量',
    baseURL: 'https://api.release.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    title: 'release'
  }
} satisfies MyConfig
