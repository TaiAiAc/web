import { resolve } from 'node:path'
import UnoCSS from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * 创建并返回 Vite 构建配置（库模式）
 * - 固定 fileName 为 'index'，产出 dist/index.mjs
 * - 对外与 package.json 的 exports 保持一致
 */
export default defineConfig((config) => {
  console.log('config: ', config)

  return {
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      dts({
        entryRoot: 'src',
        outDir: 'dist',
        staticImport: true,
        // 确保类型声明文件路径正确
        pathsToAliases: true,
        // 内联所有类型定义到一个文件
        rollupTypes: false, // 改为 false 避免复杂的类型合并问题
        // 指定正确的入口文件
        include: ['src'],
        // 排除外部依赖的类型定义
        exclude: ['node_modules', '**/*.test.ts', '**/*.spec.ts'],
        // 避免打包外部库的类型
        compilerOptions: {
          skipLibCheck: true
        }
      }),
      Icons({
        compiler: 'vue3',
        scale: 1,
        defaultClass: 'inline-block'
      })
    ],
    build: {
      emptyOutDir: true,
      // 库模式
      lib: {
        entry: resolve(__dirname, 'src', 'index.ts'),
        name: 'NaiveUiExtra',
        formats: ['es']
      },
      minify: false,
      // CSS 处理
      cssCodeSplit: true,
      // 分块策略
      rollupOptions: {
        external: [
          'vue',
          'naive-ui',
          /^naive-ui\/.*/, // naive-ui 的所有子路径
          /^vue(\/.+)?$/, // vue 的所有子路径
          /^@vue\/.*/ // @vue 命名空间下的所有包
        ],
        output: {
          preserveModules: false
        }
      },
      reportCompressedSize: false,
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  }
})
