# @quiteer/vite

> `@quiteer/vite` 是在 Vite 基础上增强的前端构建与开发 CLI，内置插件编排、环境变量注入与 HTML 虚拟插入等能力，并支持与 `tsdown` 联动进行前后端/工具产物的构建统一。
> 文档地址：[qvite 文档](https://quiteerjs.github.io/web/cli/qvite.html)

## 特性

- 插件即开即用：通过配置对象启用/配置 `@quiteer/vite-plugins` 的常用插件
- 环境变量统一：按 `mode` 自动合并并注入到应用，默认支持前缀 `QVITE_` 与 `VITE_`
- HTML 虚拟插入：无需改动模板即可插入脚本、样式与自定义标签
- Vite/tsdown 联动：开发与构建阶段统一调用，减少脚手架切换成本
- 强类型提示：提供 `defineConfig`、`ConfigEnv<T>` 等类型工具，完善的 IDE 体验

## 安装

```bash
pnpm add -D @quiteer/vite
```

## 快速开始

1. 创建 `qvite.config.ts`

```ts
import type { ConfigEnv } from '@quiteer/vite'
import { defineConfig } from '@quiteer/vite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>

  return {
    html: {
      config: {
        title: '示例标题'
      }
    },
    vite: {
      server: { port: 8090 }
    }
  }
})
```

2. 配置 `env.config.ts`（可选）

```ts
import type { EnvConfig } from '@quiteer/vite-plugins'

type MyConfig = EnvConfig<'baseURL'>

export default {
  default: { desc: '通用变量' },
  development: { desc: '开发', baseURL: 'http://localhost:3000' },
  production: { desc: '生产', baseURL: 'https://api.example.com' }
} satisfies MyConfig
```

3. 增强类型提示（Node 配置文件项目）

- 在 `tsconfig.node.json` 中添加：

```json
{
  "compilerOptions": {
    "types": ["node", "vite/client"]
  },
  "include": ["qvite.config.ts", "env.d.ts"]
}
```

- 在 `env.d.ts` 中声明：

```ts
interface ImportMetaEnv {
  readonly VITE_BASEURL: string
  readonly VITE_DESC: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

## 命令

- 开发：

```bash
qvite dev -m development -p 8090 --minify
```

- 构建：

```bash
qvite build -m production --minify
```

## 配置说明

`QviteConfig`（见 `src/typings.ts`）包含以下字段：

- `vite`：Vite 原生配置对象（会与内部默认合并）
- `tsdown`：`tsdown` 的 `UserConfig | UserConfig[]`
- `plugins`：插件开关与参数（布尔或参数数组）
- `html`：虚拟 HTML 插入配置
- `env`：环境变量注入插件的选项

默认项参考 `src/defaults.ts`。

## 类型工具

- `defineConfig`：用于 `qvite.config.ts` 的类型辅助（`packages/qvite/index.ts:34-44`）
- `defineViteConfig`：Vite 配置的类型辅助包装（`packages/qvite/index.ts:71-75`）
- `defineTsdownConfig`：tsdown 配置的类型辅助包装（`packages/qvite/index.ts:102-106`）
- `ConfigEnv<T>`：回调入参类型，包含 `command`、`mode`、`env: T`、`root`（`packages/qvite/src/typings.ts:30-35`）

## 插件系统

内置映射见 `packages/qvite/src/plugins.ts`，支持：

- `Vue`、`VueJsx`、`VueDevTools`
- `UnoCSS`
- `Progress`
- `RemoveConsole`
- `MockRouter`
- `FileChangeLogger`

配置方式示例：

```ts
export default defineConfig({
  plugins: {
    Vue: [{ customElement: true }],
    UnoCSS: false,
    Progress: [{}]
  }
})
```

## 环境变量

- 前缀：默认 `QVITE_` 与 `VITE_`（`packages/qvite/src/store.ts:13`）
- 合并：`default` 与 `mode` 环境通过 `vite.loadEnv` 合并（`packages/qvite/src/getConfig.ts:34-38`）
- 注入：由 `envConfigPlugin` 负责注入到客户端（`packages/qvite/src/transform.ts:33-34`）

## HTML 虚拟插入

通过 `virtualHtmlPlugin` 在不改动模板的情况下插入：`title`、`script`、`style`、自定义 `tags`（参考示例 `playground/qvite-test/qvite.config.ts`）。

## 工作流

- 开发：`watch()` 启动 Vite Dev Server，自动选取可用端口并打印地址（`packages/qvite/src/watch.ts:31-50`）
- 构建：`build()` 先执行 `tsdown`，再调用 Vite `build`（`packages/qvite/src/build.ts:30-43`）

## 使用场景与优势

- Monorepo 下统一脚手架与类型提示
- 多环境变量的集中管理与自动注入
- 简化 HTML 注入、减少改模板的侵入性
- Vite 与 tsdown 联动，前后端/工具一体化构建



