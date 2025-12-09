import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  title: '@quiteer/web 中文文档',
  description: '一些 web 开发相关的 npm 包',
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/quiteerjs/web' }],
    sidebar: {
      '/about/': [
        {
          text: '关于',
          items: [{ text: '文档配置', link: '/about/' }]
        }
      ],
      '/cli/': [
        {
          text: 'CLI',
          items: [
            { text: '一些脚本工具', link: '/cli/' },
            { text: 'scripts', link: '/cli/scripts' },
            { text: 'qvite', link: '/cli/qvite' }
          ]
        }
      ],
      ...introduceSidebar()
    }
  },
  // 关键：在 SSR 阶段将这些依赖打包处理，避免 CJS 命名导出错误
  vite: {
    ssr: {
      noExternal: [
        'naive-ui',
        'vueuc',
        'vooks',
        'treemate',
        'evtd'
      ]
    },
    optimizeDeps: {
      include: ['vue', 'naive-ui', 'vueuc', 'vooks']
    }
  }
})

/**
 * 生成顶部导航配置：
 * 返回 VitePress 导航栏的菜单结构。
 */
function nav() {
  return [
    {
      text: '指引',
      link: '/introduce/project',
      activeMatch: '/introduce|main|renderer|config|builder/'
    },
    {
      text: 'CLI',
      link: '/cli/',
      activeMatch: '/cli/'
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
          link: 'https://github.com/quiteerjs/quiteer-vue-directives'
        }
      ]
    }
  ]
}

/**
 * 生成侧边栏配置：
 * 定义介绍与插件文档的侧边栏结构。
 */
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
            { text: 'QuiTable', link: '/plugins/naive-extra/QuiTable' },
            { text: 'QuiLayout', link: '/plugins/naive-extra/QuiLayout' }
          ]
        },
        {
          text: '@quiteer/box',
          items: [
            { text: '总览', link: '/plugins/box/' }
          ]
        },
        {
          text: '@quiteer/axios',
          items: [
            { text: '总览', link: '/plugins/axios/' }
          ]
        },
        {
          text: '@quiteer/vite-plugins',
          items: [
            { text: '插件总览', link: '/plugins/vite-plugin/' },
            { text: '文件改动日志', link: '/plugins/vite-plugin/file-change-logger' },
            { text: '环境变量配置', link: '/plugins/vite-plugin/env-config' },
            { text: '自动生成环境变量类型', link: '/plugins/vite-plugin/env-types' },
            { text: 'API Mock 路由', link: '/plugins/vite-plugin/mock-router' },
            { text: '移除 console', link: '/plugins/vite-plugin/remove-console' },
            { text: '虚拟 HTML 生成', link: '/plugins/vite-plugin/virtual-html' },
            { text: '构建进度条（第三方）', link: '/plugins/vite-plugin/progress' }
          ]
        },
        {
          text: '@quiteer/directives',
          items: [
            { text: '指令总览', link: '/plugins/directives/' },
            { text: '权限指令(v-permission)', link: '/plugins/directives/permission' },
            { text: '复制指令(v-copy)', link: '/plugins/directives/copy' },
            { text: '防抖指令(v-debounce)', link: '/plugins/directives/debounce' },
            { text: '节流指令(v-throttle)', link: '/plugins/directives/throttle' },
            { text: '点击外部(v-click-outside)', link: '/plugins/directives/clickOutside' },
            { text: '文本省略(v-ellipsis)', link: '/plugins/directives/ellipsis' },
            { text: '交叉观察(v-intersecting)', link: '/plugins/directives/intersecting' },
            { text: '图片懒载(v-lazy)', link: '/plugins/directives/lazy' },
            { text: '加载指令(v-loading)', link: '/plugins/directives/loading' },
            { text: '水印指令(v-watermark)', link: '/plugins/directives/watermark' }
          ]
        },
        {
          text: '@quiteer/utils',
          items: [
            { text: '总览', link: '/plugins/utils/' },
            { text: '函数', link: '/plugins/utils/function' },
            { text: '数组', link: '/plugins/utils/array' },
            { text: '对象', link: '/plugins/utils/object' },
            { text: '字符串', link: '/plugins/utils/string' },
            { text: '数字', link: '/plugins/utils/number' },
            { text: '时间', link: '/plugins/utils/time' },
            { text: '随机', link: '/plugins/utils/random' },
            { text: '类型', link: '/plugins/utils/type-utils' }
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
