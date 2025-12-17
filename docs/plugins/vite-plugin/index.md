# @quiteer/vite-plugins 插件总览

Vite 插件集合，旨在提供开箱即用的开发体验，涵盖环境配置、Mock、HTML 处理及常用插件封装。

## 安装
```bash
pnpm add -D @quiteer/vite-plugins
```

## 功能全貌

### 核心插件

| 插件名 | 描述 | 文档 |
| --- | --- | --- |
| `envConfigPlugin` | **环境配置管理**。支持从 `env.config.ts` 自动生成 `.env` 文件及 TypeScript 类型定义，支持字段混淆。 | [详细](/plugins/vite-plugin/env-config) |
| `envTypesPlugin` | **类型生成**。扫描现有 `.env` 文件生成 `env.d.ts`，提供智能提示。 | [详细](/plugins/vite-plugin/env-types) |
| `virtualHtmlPlugin` | **虚拟 HTML**。支持多页面入口配置、EJS 模板渲染，解决多页应用目录结构限制。 | [详细](/plugins/vite-plugin/virtual-html) |
| `mockRouterPlugin` | **Mock 服务**。基于文件系统的本地 Mock 数据服务。 | [详细](/plugins/vite-plugin/mock-router) |
| `removeConsolePlugin` | **日志清理**。生产环境构建时自动移除 `console` 语句。 | [详细](/plugins/vite-plugin/remove-console) |
| `fileChangeLoggerPlugin` | **变更日志**。开发模式下在终端实时打印文件变更记录。 | [详细](/plugins/vite-plugin/file-change-logger) |

### 集成预设

本包集成了常用的 Vue 生态及开发插件，方便统一管理依赖版本：

- **Vue 生态**: `Vue` (plugin-vue), `VueJsx` (plugin-vue-jsx), `VueDevTools`
- **UI/样式**: `UnoCSS`, `Icons` (unplugin-icons), `IconsResolver`, `FileSystemIconLoader`, `createSvgIconsPlugin` (vite-plugin-svg-icons)
- **自动化**: `AutoImport`, `Components` (unplugin-vue-components), `NaiveUiResolver`
- **工具**: `Progress` (vite-plugin-progress 构建进度条)

## 首次运行保障（读取到环境变量）
- 若你的 `vite.config.ts` 在顶层需要读取环境变量（例如 `loadEnv(mode)`），建议在配置函数开头调用工具方法 `bootstrapEnv` 以保证第一次运行时 `.env` 已生成：
```ts
import { defineConfig, loadEnv } from 'vite'
import { bootstrapEnv } from '@quiteer/vite-plugins'

export default defineConfig(async ({ mode }) => {
  await bootstrapEnv({ mode, includePrefixes: ['VITE_'] })
  const env = loadEnv(mode, process.cwd(), ['VITE'])
  return { plugins: [/* ... */] }
})
```
- 同时在插件列表中保留 `envConfigPlugin`，其负责后续变更的 `.env` 与类型生成（开发期热更新时自动重生成）。

## 快速上手
```ts
import { defineConfig } from 'vite'
import {
  fileChangeLoggerPlugin,
  mockRouterPlugin,
  envTypesPlugin,
  envConfigPlugin,
  removeConsolePlugin,
  progress,
  virtualHtmlPlugin,
  Vue,
  VueJsx,
  UnoCSS
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS(),
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin({ obfuscate: true, obfuscateSkipKeys: ['testUrl'], requiredKeys: ['desc'] }),
    removeConsolePlugin({ level: 'warn' }),
    progress(),
    virtualHtmlPlugin({
      config: {
        title: 'Demo Title',
        script: { src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js', async: true, position: 'body-append' },
        style: { src: '/src/style.css', position: 'head' }
      }
    })
  ]
})
```

## 插件列表
| 功能 | 说明 | 文档 |
|------|------|------|
| 文件改动日志 | 美观打印新增/修改/删除文件路径与时间戳 | [file-change-logger](/plugins/vite-plugin/file-change-logger) |
| API Mock 路由 | 将 `/api/*` 自动映射到 `<root>/mock/*.json` | [mock-router](/plugins/vite-plugin/mock-router) |
| 环境变量类型生成 | 扫描 `.env*` 文件，自动生成 `env.d.ts` 提供类型提示 | [env-types](/plugins/vite-plugin/env-types) |
| 环境配置生成 | 读取 `env.config.ts` 生成 `.env.local` / `.env.{mode}.local`，支持混淆、校验与类型 | [env-config](/plugins/vite-plugin/env-config) |
| 移除 console | 按等级剔除 `console.*` 调用（含 `.vue` 脚本） | [remove-console](/plugins/vite-plugin/remove-console) |
| 虚拟 HTML 生成 | 通过配置对象生成根 `index.html`，实现“无 HTML 文件”开发与构建 | [virtual-html](/plugins/vite-plugin/virtual-html) |
| 构建进度条 | 集成 `vite-plugin-progress` 显示构建进度 | [progress](/plugins/vite-plugin/progress) |
| Vue 集成 | 一键启用 `@vitejs/plugin-vue` | — |
| Vue JSX 支持 | 一键启用 `@vitejs/plugin-vue-jsx` | — |
| UnoCSS 集成 | 一键启用 `@unocss/vite` | — |
| 工具方法 | 提供 `bootstrapEnv`，在配置函数开头预生成 `.env` 与类型，保障首次运行即可读取环境变量 | — |

## 单独使用
```ts
import { defineConfig } from 'vite'
import {
  fileChangeLoggerPlugin,
  mockRouterPlugin,
  envTypesPlugin,
  envConfigPlugin,
  removeConsolePlugin,
  progress,
  virtualHtmlPlugin
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    // 按 mode 读取 env.config.ts，生成 .env 文件并注入 import.meta.env
    envConfigPlugin({ obfuscate: true, obfuscateSkipKeys: ['testUrl'] }),
    removeConsolePlugin({ level: 'warn' }),
    progress(),
    // 无模板开发：直接通过配置生成 index.html
    virtualHtmlPlugin({ config: { title: 'Title', script: { src: '/demo.js', position: 'body-append' } } })
  ]
})
```

## 约定与安全
- 仅将符合前缀（默认 `envPrefix` 或 `VITE_`）的变量生成到 `import.meta.env`，避免泄露私密变量
- Mock 路由仅在开发模式启用，不影响生产构建与预览
- 控制台输出统一使用 `kolorist` 美化，信息更易识别
- 键名规范：插件会将驼峰键名转为下划线大写（`testUrl -> VITE_TEST_URL`，`baseURL -> VITE_BASE_URL`）

## 使用建议
- 在 `env.config.ts` 中集中维护多环境变量，必要时开启 `obfuscate` 但避免存储敏感信息
- 使用虚拟 HTML 插件时合理选择脚本位置（如 `body-append`）与 `async`，降低首屏阻塞
- 组合使用进度与文件改动日志，提升开发反馈质量
- Vue/UnoCSS 封装可直接通过导出的插件函数启用，减少样板代码
- 如需在 `vite.config.ts` 顶层读取环境，使用 `async defineConfig` 并在开头调用 `bootstrapEnv({ mode })`

## 参数约定
- 插件函数支持传入“布尔开关”或“参数对象/数组”（按各插件文档说明）
- 常用导出：`Vue`、`VueJsx`、`UnoCSS`、`fileChangeLoggerPlugin`、`mockRouterPlugin`、`envTypesPlugin`、`envConfigPlugin`、`removeConsolePlugin`、`progress`、`virtualHtmlPlugin`、`bootstrapEnv`
