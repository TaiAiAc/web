import { defineConfig } from 'vitepress'
import { version } from '../package.json'

export default defineConfig({
  title: '@quiteer/web 中文文档',
  description: '一些 web 开发相关的 npm 包',
  srcDir: 'src',
  base: '/web/',
  lang: 'en',
  head: [['link', { rel: 'icon', href: '/web/favicon.ico' }]],
  markdown: {
    lineNumbers: true
  },
  lastUpdated: true,
  appearance: true,
  themeConfig: {
    siteTitle: '@quiteer/web',
    logo: '/favicon.ico',
    lastUpdatedText: '最后更新时间',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-11-present Quiteer'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    nav: nav(),
    socialLinks: [{ icon: 'github', link: 'https://github.com/TaiAiAc/web' }],
    sidebar: {
      '/about/': [
        {
          text: '关于',
          items: [{ text: '文档配置', link: '/about/' }]
        }
      ],
      ...introduceSidebar()
    }
  }
})

function nav() {
  return [
    {
      text: '指引',
      link: '/introduce/project',
      activeMatch: '/introduce|main|renderer|config|builder/'
    },
    {
      text: '关于',
      link: '/about/',
      activeMatch: '/about/'
    },
    {
      text: '相关文档',
      items: [
        {
          text: 'vue',
          link: 'https://cn.vuejs.org/'
        },
        {
          text: 'vite',
          link: 'https://cn.vitejs.dev/'
        },
        {
          text: 'typescript',
          link: 'https://www.typescriptlang.org/'
        },
        {
          text: 'unocss',
          link: 'https://unocss.dev/'
        },
        {
          text: 'naive-ui',
          link: 'https://www.naiveui.com/zh-CN/os-theme'
        },
        {
          text: 'axios',
          link: 'https://axios-http.com/zh/'
        },
        {
          text: 'tsdown',
          link: 'https://tsdown.dev/zh-CN/'
        }
      ]
    },
    {
      text: version,
      items: [
        {
          text: '组织',
          link: 'https://github.com/QuiteerJs'
        },
        {
          text: 'electronup',
          link: 'https://quiteerjs.github.io/electronup/'
        },
        {
          text: 'electron-vue3-quiet',
          link: 'https://taiaiac.github.io/electron-vue3-quiet-doc/'
        },
        {
          text: 'parser-config',
          link: 'https://github.com/QuiteerJs/parser-config'
        },
        {
          text: '@quiteer/directives',
          link: 'https://github.com/TaiAiAc/quiteer-vue-directives'
        }
      ]
    }
  ]
}

function introduceSidebar() {
  const commonRoute = [
    {
      text: '介绍',
      items: [
        { text: '项目介绍', link: '/introduce/project' },
        { text: '快速上手', link: '/introduce/introduction' }
      ]
    },
    {
      text: '插件',
      items: [
        { text: '插件总览', link: '/plugins/' },
        {
          text: '@quiteer/naive-extra',
          items: [
            { text: '总览', link: '/plugins/naive-extra/' },
            { text: 'QuiUpload', link: '/plugins/naive-extra/QuiUpload' },
            { text: 'QuiForm', link: '/plugins/naive-extra/QuiForm' },
            { text: 'QuiTable', link: '/plugins/naive-extra/QuiTable' }
          ]
        },
        {
          text: '@quiteer/directives',
          items: [
            { text: '指令总览', link: '/plugins/directives/' },
            { text: '权限指令(v-permission)', link: '/plugins/directives/permission' },
            { text: '加载指令(v-loading)', link: '/plugins/directives/loading' }
          ]
        },
        { text: '@quiteer/is', link: '/plugins/is' }
      ]
    }
  ]

  return {
    '/introduce/': commonRoute,
    '/plugins/': commonRoute
  }
}
