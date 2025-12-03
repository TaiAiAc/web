import { envConfigPlugin, envTypesPlugin, fileChangeLoggerPlugin, mockRouterPlugin, Progress, removeConsolePlugin, virtualHtmlPlugin } from '@quiteer/vite-plugins'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    vue(),
    Progress(),
    /**
     * 示例：在 vite.config.ts 中使用带类型提示的插件选项
     *
     * `VirtualHtmlOptions` 为插件选项类型，能提供 IDE 自动补全与校验
     */
    virtualHtmlPlugin({
      configFile: 'html.config.ts',
      fallbackWhenIndexExists: true,
      pages: {
        '/nested/index.html': {
          title: 'Nested Page',
          entry: '/src/nested/main.ts',
          style: { src: '/src/style.css', position: 'head' }
        }
      }
    }),
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin({ disableTypes: true, obfuscate: false, requiredKeys: ['desc'] }),
    removeConsolePlugin({ processVue: false })
  ]
}))
