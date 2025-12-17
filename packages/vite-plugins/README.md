# @quiteer/vite-plugins

Vite 插件集合，旨在提供开箱即用的开发体验，涵盖环境配置、Mock、HTML 处理及常用插件封装。

- 文档地址：https://quiteerjs.github.io/web/plugins/vite-plugin/

## 安装

```bash
pnpm add -D @quiteer/vite-plugins
```

## 功能全貌

### 核心插件

| 插件名 | 描述 |
| --- | --- |
| `envConfigPlugin` | **环境配置管理**。支持从 `env.config.ts` 自动生成 `.env` 文件及 TypeScript 类型定义，支持字段混淆。 |
| `envTypesPlugin` | **类型生成**。扫描现有 `.env` 文件生成 `env.d.ts`，提供智能提示。 |
| `virtualHtmlPlugin` | **虚拟 HTML**。支持多页面入口配置、EJS 模板渲染，解决多页应用目录结构限制。 |
| `mockRouterPlugin` | **Mock 服务**。基于文件系统的本地 Mock 数据服务。 |
| `removeConsolePlugin` | **日志清理**。生产环境构建时自动移除 `console` 语句。 |
| `fileChangeLoggerPlugin` | **变更日志**。开发模式下在终端实时打印文件变更记录。 |

### 集成预设

本包集成了常用的 Vue 生态及开发插件，方便统一管理依赖版本：

- **Vue 生态**: `Vue` (plugin-vue), `VueJsx` (plugin-vue-jsx), `VueDevTools`
- **UI/样式**: `UnoCSS`, `Icons` (unplugin-icons), `IconsResolver`, `FileSystemIconLoader`, `createSvgIconsPlugin` (vite-plugin-svg-icons)
- **自动化**: `AutoImport`, `Components` (unplugin-vue-components), `NaiveUiResolver`
- **工具**: `Progress` (vite-plugin-progress 构建进度条)

## 快速使用

```ts
import { defineConfig } from 'vite'
import {
  // 核心插件
  envConfigPlugin,
  mockRouterPlugin,
  virtualHtmlPlugin,
  removeConsolePlugin,
  
  // 集成插件
  Vue,
  UnoCSS
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    Vue(),
    UnoCSS(),
    
    // 自动管理环境变量
    envConfigPlugin({ requiredKeys: ['API_URL'] }),
    
    // Mock 服务
    mockRouterPlugin(),
    
    // 虚拟 HTML (多页支持)
    virtualHtmlPlugin({ 
      pages: { 
        index: { entry: 'src/main.ts', title: 'Home' } 
      } 
    }),
    
    // 生产环境移除 console
    removeConsolePlugin()
  ]
})
```
