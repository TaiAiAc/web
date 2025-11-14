# @quiteer/vite-plugins 插件总览

## 快速上手
```ts
import { defineConfig } from 'vite'
import { createQuiteerPlugins } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    // 一键启用本包内常用插件：文件改动日志、Mock 路由、环境类型、移除 console
    ...createQuiteerPlugins({ level: 'warn' })
  ]
})
```

## 插件列表
- 文件改动日志：美观打印新增/修改/删除文件路径与时间戳
  - 文档：[file-change-logger](/plugins/vite-plugin/file-change-logger)
- API Mock 路由：将 `/api/*` 自动映射到 `<root>/mock/*.json`
  - 文档：[mock-router](/plugins/vite-plugin/mock-router)
- 环境变量类型生成：扫描 `.env*` 自动生成 `env.d.ts`
  - 文档：[env-types](/plugins/vite-plugin/env-types)
- 移除 console：按等级剔除 `console.*` 调用（含 `.vue` 脚本）
  - 文档：[remove-console](/plugins/vite-plugin/remove-console)
- 构建进度条（第三方集成）：`vite-plugin-progress`
  - 文档：[progress](/plugins/vite-plugin/progress)

## 单独使用
```ts
import { defineConfig } from 'vite'
import {
  fileChangeLoggerPlugin,
  mockRouterPlugin,
  envTypesPlugin,
  removeConsolePlugin,
  progress
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    removeConsolePlugin({ level: 'warn' }),
    progress()
  ]
})
```

## 约定与安全
- 仅将符合前缀（默认 `envPrefix` 或 `VITE_`）的变量生成到 `import.meta.env`，避免泄露私密变量
- Mock 路由仅在开发模式启用，不影响生产构建与预览
- 控制台输出统一使用 `kolorist` 美化，信息更易识别
