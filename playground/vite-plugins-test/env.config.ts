import type { EnvConfig } from '@quiteer/vite-plugins'

type EnvNames = 'development' | 'production' | 'test' | 'obfuscate'

type MyConfig = EnvConfig<'baseURL' | 'apiURL' | 'uploadURL' | 'gisJs' | 'gisCss', EnvNames>

export default {
  default: {
    desc: {
      value: '通用环境变量',
      obfuscate: true
    },
    testUrl: {
      value: 'https://quiteerjs.github.io/web/',
      obfuscate: true
    }
  },
  development: {
    desc: '开发环境变量',
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: true
    },
    apiURL: '/api',
    gisJs: '/gis',
    gisCss: '/gis',
    test: 'false',
    test1: true
  },
  production: {
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: true
    },
    desc: '生产环境变量',
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
  obfuscate: {
    desc: {
      value: '混淆环境变量',
      obfuscate: true
    },
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: true
    },
    apiURL: {
      value: '/api',
      obfuscate: true
    },
    uploadURL: {
      value: '/files',
      obfuscate: true
    },
    gisJs: {
      value: '/gis',
      obfuscate: true
    },
    gisCss: {
      value: '/1',
      obfuscate: true
    }
  }
} satisfies MyConfig
