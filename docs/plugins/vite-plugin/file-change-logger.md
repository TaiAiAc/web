---
title: 文件改动日志插件
---

# @quiteer/vite-plugins · fileChangeLoggerPlugin

## 概述
在开发服务器中监听文件新增/修改/删除，并在控制台美观输出相对路径与时间戳（YYYY-MM-DD HH:mm:ss）。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { fileChangeLoggerPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [fileChangeLoggerPlugin()]
})
```

## 选项
| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `` `devOnly` `` | `boolean` | `` `true` `` | 仅在开发启用 |
| `` `events` `` | `` Array<'change' \| 'add' \| 'unlink'> `` | 全部事件 | 监听事件 |
| `` `label` `` | `string` | `` `'file'` `` | 输出标签 |

## 示例
```ts
fileChangeLoggerPlugin({ events: ['change','add'], label: 'watch' })
```

## 注意事项
- 仅在 `dev` 启用，不影响构建输出；使用 `kolorist` 美化输出。
