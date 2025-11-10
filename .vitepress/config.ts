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
          text: 'electron',
          link: 'https://www.electronjs.org/'
        },
        {
          text: 'vite',
          link: 'https://cn.vitejs.dev/'
        },
        {
          text: 'tsup',
          link: 'https://tsup.egoist.dev/'
        },
        {
          text: 'electron-builder',
          link: 'https://www.electron.build/'
        }
      ]
    },
    {
      text: version,
      items: [
        {
          text: '组织',
          link: 'https://github.com/QuiteerJs'
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
        { text: 'parser-config', link: '/plugins/parser-config' },
        { text: 'create-electronup', link: '/plugins/create-electronup' },
        { text: 'electron-ipc', link: '/plugins/electron-ipc' },
        { text: 'electron-preload', link: '/plugins/electron-preload' },
        { text: 'electron-browser', link: '/plugins/electron-browser' }
      ]
    }
  ]

  return {
    '/introduce/': commonRoute,
    '/plugins/': commonRoute
  }
}
