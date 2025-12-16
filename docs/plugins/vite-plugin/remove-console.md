---
title: 移除 console 插件
---

# @quiteer/vite-plugins · removeConsolePlugin

## 概述
移除 `console` 调用（低于指定等级），在开发与构建阶段都可按需启用，支持 `.vue` 文件内脚本。

## 安装
```ts
import { defineConfig } from 'vite'
import { removeConsolePlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [removeConsolePlugin({ level: 'warn' })]
})
```

## 选项
| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `` `level` `` | `` 'off' \| 'error' \| 'warn' \| 'info' \| 'log' \| 'debug' \| 'trace' `` | `` `'warn'` `` | 日志等级阈值：低于此级别的 `console.*` 调用将被移除 |
| `` `stripInDev` `` | `boolean` | `` `true` `` | 是否在开发环境（dev）中移除 console 调用 |
| `` `stripInBuild` `` | `boolean` | `` `true` `` | 是否在构建（build）时移除 console 调用 |
| `` `methods` `` | `string[]` | — | 自定义保留的方法名白名单（如 `['error', 'warn']`），优先级高于 `level` |
| `` `include` `` / `` `exclude` `` | `RegExp \| RegExp[]` | — | 按文件路径正则过滤，仅对匹配的文件生效 |
| `` `processVue` `` | `boolean` | `` `true` `` | 是否处理 `.vue` 单文件组件中的 `<script>` 内容 |

## 示例
```ts
removeConsolePlugin({
  level: 'warn',
  processVue: true,
  include: [/src\//],
  exclude: [/node_modules/]
})
```

## 注意事项
- 插件在 `transform` 钩子中工作，不依赖 AST 工具，性能较好；极端边界字符串/注释场景已规避。
