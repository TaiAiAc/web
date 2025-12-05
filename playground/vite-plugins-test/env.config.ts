import type { EnvConfig } from '@quiteer/vite-plugins'

type MyConfig = EnvConfig<'baseURL' | 'apiURL' | 'uploadURL' | 'gisJs' | 'gisCss'>

export default {
  default: {
    desc: {
      value: '通用环境变量',
      obfuscate: true
    },
    testUrl: 'https://quiteerjs.github.io/web/'
  },
  development: {
    desc: '开发环境变量',
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: true
    },
    apiURL: '/api',
    gisJs: '/gis',
    gisCss: '/gis'
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'https://api.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'prod'
  },
  test: {
    desc: '测试环境变量',
    baseURL: 'https://api.test.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'test'
  },
  staging: {
    desc: '预发布环境变量',
    baseURL: 'https://api.staging.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'staging'
  },
  release: {
    desc: '发布环境变量',
    baseURL: 'https://api.release.example.com',
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'release'
  }
} satisfies MyConfig
