---
title: API Mock 自动路由插件
---

# @quiteer/vite-plugins · mockRouterPlugin

## 概述
开发模式下，将请求路径自动映射到本地 `mock` 目录静态文件，例如：
`/api/user/list` → `<root>/mock/user/list.json`。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { mockRouterPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [mockRouterPlugin()]
})
```

## 选项
| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `` `apiPrefix` `` | `string` | `` `'/api'` `` | API 请求前缀 |
| `` `mockDir` `` | `string` | `` `'<root>/mock'` `` | Mock 文件所在目录 |
| `` `extension` `` | `string` | `` `'.json'` `` | Mock 文件的扩展名 |
| `` `delay` `` | `number` | `` `0` `` | 模拟网络延迟，单位为毫秒 |
| `` `onMiss` `` | `` 'pass' \| '404' `` | `` `'pass'` `` | 当请求未匹配到 mock 文件时的处理策略：<br>`'pass'` 表示透传给下游中间件，`'404'` 返回 404 响应 |

## 示例
```ts
mockRouterPlugin({ apiPrefix: '/api', mockDir: 'mock', delay: 300 })
// mock/user/list.json → GET /api/user/list
```

## 注意事项
- 仅在 `dev` 启用，中间件拦截返回 JSON；生产环境不影响。
