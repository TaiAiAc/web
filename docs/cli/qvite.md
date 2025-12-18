# 使用指南

本文档系统介绍 `qvite` 的使用方式、优点、使用场景与类型提示实践，确保读者仅凭本页即可完成配置与使用。

## 与传统 Vite 项目的区别

- 类型提示更完善：提供 `defineConfig` 与 `ConfigEnv<T>`，在 `qvite.config.ts` 中获得强类型的 `env`/`mode`/`command`/`root`
- 环境变量更安全全面：集中管理 `env.config.ts`，支持 `requiredKeys` 校验与 `obfuscate` 混淆，默认识别 `QVITE_`、`VITE_` 前缀并按 `mode` 合并
- 无 HTML 化开发：内置虚拟 HTML 插件，无需实体 `index.html` 即可插入 `title/script/style/tags`
- 插件内置编排：常用插件（Vue、UnoCSS、进度条、移除 console、Mock 路由、文件改动日志等）可直接以布尔或参数数组启用，减少样板代码
- Vite/tsdown 联动：开发与构建阶段统一调度，前端与 Node/工具产物可在同一流程中协作
- 开箱默认更合理：默认端口、别名与插件约定即用即配，减少重复配置

## 为什么选择 qvite

- 一体化开发/构建：统一封装 Vite 与 tsdown 的协作流程
- 插件编排更简单：通过配置对象启用常用插件，无需重复样板代码
- 环境变量更规范：默认支持 `QVITE_` 与 `VITE_` 前缀，按 `mode` 自动合并
- HTML 无侵入插入：`virtualHtmlPlugin` 支持脚本、样式、任意标签的虚拟插入
- 强类型体验：`defineConfig` 与 `ConfigEnv<T>` 带来完善的 IDE 提示

## qvite 为你都做了什么

- 配置归一与插件编排
- 自动读取并解析 `qvite.config.*`，合并默认项与用户配置，生成可直接交给 Vite 的内联配置（`packages/qvite/src/transform.ts:62`）。
- 将 `plugins` 字段中的参数数组展开为对应的 Vite 插件实例，并统一追加虚拟 HTML 与环境变量注入插件（`packages/qvite/src/transform.ts:42-60`、`packages/qvite/src/plugins.ts:3-18`）。

- UnoCSS 集成与自动注入
- 启用 `UnoCSS` 后，qvite 会在虚拟 HTML 中自动插入 `import 'uno.css'`，无需在入口手动维护样式引入（`packages/qvite/src/transform.ts:40-64`）。
- 默认推荐与 `@quiteer/unocss` 配合使用：`import UnoPreset from '@quiteer/unocss'`，qvite 内部会在启用时追加该插件（`packages/qvite/src/transform.ts:1-11`、`packages/qvite/src/plugins.ts:1-17`）。
- 若项目已手动导入 `uno.css`，与自动注入不会产生冲突；本地 `unocss.config.ts` 亦可继续生效（预设、规则、扫描路径由本地决定）。
- 相关示例：`playground/qvite-test/qvite.config.ts:1-41`

- 虚拟 HTML 能力（无模板开发）
- 通过 `virtualHtmlPlugin` 在不需要实体 `index.html` 的情况下插入 `title`、`script`、`style` 与任意 `tags`，支持单页与多页配置（`packages/qvite/src/transform.ts:59-60`）。
- 你只需在 `qvite.config.ts` 的 `html.config` 或 `html.pages` 中声明，qvite 会在开发与构建阶段自动生效。

- 环境变量工作流（集中声明与注入）
- 启动时按 `mode` 自动生成 `.env.local` 与 `.env.{mode}.local`，并生成类型文件 `env.d.ts`，确保 `import.meta.env` 有准确的类型提示（`packages/vite-plugins/src/shared/bootstrap-env.ts:42-58`，qvite 调用点：`packages/qvite/src/getConfig.ts:36`）。
- 运行时按前缀合并默认与当前 `mode` 的环境（默认前缀 `QVITE_` 与 `VITE_`），注入到客户端侧代码中（`packages/qvite/src/store.ts:13`、`packages/qvite/src/getConfig.ts:37-40`、`packages/qvite/src/transform.ts:59-60`）。
- 支持 `requiredKeys` 与 `obfuscate`（混淆）选项，避免缺失与泄露风险（默认项见 `packages/qvite/src/defaults.ts:46-49`）。

- 开发体验与端口管理
- 自动选择可用端口并打印访问地址；端口被占用时会平滑切换（`packages/qvite/src/watch.ts:37-45`、`packages/qvite/src/watch.ts:52-54`）。
- 自动开启并打印 Vue DevTools 与 UnoCSS Inspector 的入口地址（服务启动打印）。
- 监听 `qvite.config.*` 变更并自动重启开发服务器，具备简单防抖以避免频繁重启（`packages/qvite/src/watch.ts:65-109`）。

- Vite/tsdown 联动
- 构建与开发阶段均可按需执行 `tsdown`，适合同时管理前端与 Node/工具产物的工作流（`packages/qvite/src/watch.ts:55-63`、`packages/qvite/src/build.ts`）。
- 提供 `defineTsdownConfig` 类型辅助，简化多产物/多平台的声明（`packages/qvite/index.ts:102-106`）。

- 类型工具与强约定
- `defineConfig`、`ConfigEnv<T>`、`defineViteConfig`、`defineTsdownConfig` 等工具，提升 IDE 下的类型提示与重构安全性（`packages/qvite/index.ts:34-44`、`packages/qvite/src/typings.ts:30-35`、`packages/qvite/index.ts:71-75`、`packages/qvite/index.ts:102-106`）。
- 默认提供更合理的约定：端口、别名与基础插件开箱即用（`packages/qvite/src/defaults.ts:50-64`）。

- 贴心的 Vue 生态扩展（默认项）
- 内置 `AutoImport` 与 `Components` 默认配置，自动导入 Vue/Router API 与 Naive UI 常用 API，并为路由组件与本地图标提供解析器（`packages/qvite/src/defaults.ts:23-44`）。
- 暴露图标解析相关工具以便按需使用：`IconsResolver`、`NaiveUiResolver`、`FileSystemIconLoader`（`packages/qvite/index.ts:108`）。

## 快速上手

1) 安装 `@quiteer/vite`

```bash
pnpm add -D @quiteer/vite
```

2) 新建 `qvite.config.ts`

```ts
import type { ConfigEnv } from '@quiteer/vite'
import { defineConfig } from '@quiteer/vite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>

  return {
    html: {
      config: { title: '测试自己的title' }
    },
    vite: {
      server: { port: 8090 }
    }
  }
})
```

3) 可选：环境变量集中配置 `env.config.ts`

```ts
import type { EnvConfig } from '@quiteer/vite'

type MyConfig = EnvConfig<'baseURL'>

export default {
  default: { desc: '通用环境变量', testUrl: 'https://quiteerjs.github.io/web/' },
  development: {
    desc: '开发环境变量',
    baseURL: { value: 'http://localhost:3000', obfuscate: false },
    apiURL: '/api', uploadURL: '/files', gisJs: '/gis', gisCss: '/gis', title: 'xxx'
  },
  production: { desc: '生产环境变量', baseURL: 'https://api.example.com', apiURL: '/api', uploadURL: '/files', title: 'prod' }
} satisfies MyConfig
```

4) 增强类型提示（Node 项目配置）

- 在 `tsconfig.node.json` 中：

```json
{
  "compilerOptions": { "types": ["node", "vite/client"] },
  "include": ["qvite.config.ts", "env.d.ts"]
}
```

- 在 `env.d.ts` 中：

```ts
interface ImportMetaEnv {
  readonly VITE_APIURL: string
  readonly VITE_BASEURL: string
  readonly VITE_DESC: string
  readonly VITE_GISCSS: string
  readonly VITE_GISJS: string
  readonly VITE_TESTURL: string
  readonly VITE_TITLE: string
  readonly VITE_UPLOADURL: string
  // 以下为 Vite 基础字段，便于在不依赖 vite/client 的情况下获得提示
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

- 不安装 `vite` 的类型方式：在 `tsconfig.node.json` 的 `types` 中添加 "@quiteer/vite/client"，即可获得基础的 `import.meta.env` 提示；项目自定义的 `VITE_*` 键仍建议在本地 `env.d.ts` 中声明。

```json
{
  "compilerOptions": { "types": ["node", "@quiteer/vite/client"] },
  "include": ["qvite.config.ts", "env.d.ts"]
}
```

## 命令行

- 启动开发：

```bash
qvite dev -m development -p 8090 --minify
```

- 构建生产：

```bash
qvite build -m production --minify
```

## 配置详解

`QviteConfig` 包含以下字段：

| 字段 | 类型 | 对应插件 / 功能 | 说明 |
|------|------|------------------|------|
| `` vite `` | `import('vite').UserConfig` | Vite 原生配置 | 透传给 Vite 的标准配置对象，支持所有官方选项 |
| `` tsdown `` | `UserConfig \| UserConfig[]` | TypeScript 降级构建 | 用于生成兼容旧版浏览器的降级包（如 ES5），可配置多套输出 |
| `` plugins `` | `object` | 内置插件管理 | 控制内置插件（如 `removeConsolePlugin`、`mockRouterPlugin` 等）的启用状态及参数 |
| `` html `` | `VirtualHtmlOptions` | `virtualHtmlPlugin` | 配置无模板 HTML 生成，如 `title`、`script`、`tags`、多页等 |
| `` env `` | `EnvConfigOptions` | `envConfigPlugin` | 配置环境变量生成逻辑，如 `requiredKeys`、`obfuscate`、`typesOutput` 等 |
| `` UnoCSS `` | `boolean` | `@quiteer/unocss` | 启用 UnoCSS 插件并自动注入 `import 'uno.css'` 到虚拟 HTML（`packages/qvite/src/transform.ts:40-64`） |

### 默认配置

- 插件默认：
  | 插件名 | 默认值 | 启用方式 | 说明 |
  |--------|--------|----------|------|
  | `` Vue `` | `[{ customElement: true }]` | 已默认开启 | 启用 Vue 自定义元素支持（Web Components） |
  | `` VueDevTools `` | `[{}]` | 已默认开启 | 在开发环境注入 Vue DevTools 支持 |
  | `` VueJsx `` | `[{}]` | 已默认开启 | 支持 JSX/TSX 语法（配合 `@vitejs/plugin-vue-jsx`） |
  | `` Progress `` | `[{}]` | 已默认开启 | 构建时显示进度条（如 `vite-plugin-progress`） |
  | `` FileChangeLogger `` | `false` | `FileChangeLogger: true` | 开发模式下记录文件变更日志，**默认关闭** |
  | `` RemoveConsole `` | `false` | `RemoveConsole: true` 或传入选项对象 | 构建时移除 `console.*` 调用，**默认关闭** |
  | `` MockRouter `` | `false` | `MockRouter: true` 或传入 `{ apiPrefix, mockDir, ... }` | 启用本地 API Mock 路由，**默认关闭** |
- HTML 默认：为空对象（不插入标题/脚本/样式/标签）
- 环境默认：`{ obfuscate: false, requiredKeys: ['desc'] }`
- Vite 默认：
  - `server: { port: 3000, strictPort: false }`
  - `resolve.alias: { '@': 'src' }`
  - `build: { minify: false }`

### 覆盖方式

- 覆盖/启用插件：将插件字段设置为“参数数组”，数组内容会作为插件工厂的入参展开；设置为 `false` 表示禁用。
  ```ts
  export default defineConfig({
    plugins: {
      Vue: [{ customElement: false }], // 覆盖默认参数
      UnoCSS: [{}],                    // 启用 UnoCSS（默认关闭）
      RemoveConsole: [{ level: 'warn' }],
      FileChangeLogger: false          // 禁用文件改动日志
    }
  })
  ```
- 覆盖 HTML 插入：为 `html.config` 提供标题/脚本/样式/标签，即可按位置插入到页面。
  ```ts
  export default defineConfig({
    html: {
      config: {
        title: '自定义标题',
        script: { src: '/demo.js', position: 'body-append', async: true },
        style: { src: '/style.css', position: 'head' },
        tags: [{ tag: 'meta', attrs: { name: 'theme-color', content: '#fff' }, selfClosing: true, position: 'head' }]
      }
    }
  })
  ```
- 覆盖环境变量注入：为 `env` 提供选项，例如必填键或混淆设置。
  ```ts
  export default defineConfig({
    env: { requiredKeys: ['baseURL', 'apiURL'], obfuscate: true }
  })
  ```
- 覆盖 Vite 配置：直接在 `vite` 字段提供原生配置，内部会与默认项合并。
  ```ts
  export default defineConfig({
    vite: {
      server: { port: 8090, strictPort: true },
      resolve: { alias: { '@': '/src', '~': '/types' } },
      build: { minify: 'esbuild' }
    }
  })
  ```

### 插件使用

> [插件文档](/plugins/vite-plugin/)

:::tip
qvite 已经内置了常用插件的封装（Vue、Vue JSX、UnoCSS、Progress、DevTools 等），无需单独安装对应的 Vite 插件包。
:::

插件配置规则：
- 每个插件字段应为“参数数组”（传入到插件工厂函数）；当值为 `false` 时禁用插件
- 常见插件：`Vue`、`VueJsx`、`VueDevTools`、`UnoCSS`、`Progress`、`RemoveConsole`、`MockRouter`、`FileChangeLogger`

示例：

```ts
export default defineConfig({
  plugins: {
    Vue: [{ customElement: true }],
    UnoCSS: false,
    Progress: [{}],
    RemoveConsole: [{}]
  }
})
```

### HTML 虚拟插入示例

示例：

```ts
html: {
  config: {
    title: '测试自己的title',
    script: { src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js', async: true, position: 'body-append', attrs: { 'data-demo': 'quiteer' } },
    style: { src: '/src/style.css', media: 'screen', position: 'head', attrs: { id: 'demo-style' } },
    tags: [ { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, selfClosing: true, position: 'body-append' } ]
  }
}
```

### 环境变量处理

- 前缀：默认识别 `QVITE_` 与 `VITE_`
- 合并逻辑：在启动/构建时将默认环境与当前 `mode` 的环境变量进行合并
- 注入位置：通过内置插件将环境变量注入到客户端，运行时代码可通过 `import.meta.env` 访问

## 类型提示实践

| 名称 | 类型 / 用途 | 参数 | 说明 |
|------|-------------|------|------|
| `` defineConfig `` | 配置入口函数 | `(config: QViteUserConfig \| (env: ConfigEnv<Env>) => QViteUserConfig)` | 用于 `qvite.config.ts` 的主配置定义函数，提供完整类型推导 |
| `` ConfigEnv<T> `` | 环境上下文类型 | `{ command: 'build' \| 'serve'; mode: string; env: T; root: string }` | 配置回调函数的入参类型，`T` 为 `.env` 文件解析后的环境变量类型 |
| `` defineViteConfig `` | Vite 配置包装器 | `(config: UserConfig \| (env: ConfigEnv<Env>) => UserConfig)` | 专用于定义透传给 Vite 的原生配置部分，支持函数式配置 |
| `` defineTsdownConfig `` | tsdown 配置包装器 | `(config: UserConfig \| UserConfig[])` | 用于定义降级构建（如 ES5 兼容包）的 Vite 配置，支持单/多输出 |
`

在配置回调中使用：

```ts
export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>
  // 此时 IDE 将获得 env 的强类型提示
  return { /* ... */ }
})
```

## 适用场景

- Monorepo 项目需要统一的 Vite/tsdown 工作流与约定
- 复杂环境变量（多 mode、多来源）需要集中声明与注入
- 希望通过配置而非模板改动实现 HTML 资源插入
- 提升前端配置的类型安全与开发体验

## 插件参数详解

- `Vue`：数组参数示例 `[{ customElement: true }]`
- `UnoCSS`：`true` 开启，或传入配置数组 `[{ /* uno options */ }]`
- `Progress`：显示构建/启动进度，数组参数示例 `[{}]`
- `RemoveConsole`：移除 `console.*`，数组参数示例 `[{}]`
- `MockRouter`：基于约定生成路由（示例参数 `[{}]`），适合快速原型
- `FileChangeLogger`：文件变更日志打印（示例参数 `[{}]`）

参数传递规则：当为数组时，内容将作为插件工厂的参数展开传入；当为 `false` 时禁用插件。

## HTML 插入配置详解

- `config.title`：设置页面标题
- `config.script`：插入脚本（支持 `src`、`async`、`position`、`attrs`）
- `config.style`：插入样式（支持 `src`、`media`、`position`、`attrs`）
- `config.tags`：插入任意标签（支持 `tag`、`attrs`、`selfClosing`、`position`）

`position` 取值示例：`head`、`body-append` 等，表示插入位置。

## 环境变量配置与提示

- 建议创建 `env.config.ts` 用于集中声明各 `mode` 的变量，支持 `default` 与具体 `mode`
- 支持设置 `obfuscate`（对特定变量进行混淆）与 `requiredKeys`（必填键集合）
- 运行时读取：

```ts
const baseURL = import.meta.env.VITE_BASEURL
const desc = import.meta.env.VITE_DESC
```

## 与 tsdown 联动

- 在开发/构建阶段，如提供了 `tsdown` 配置，将优先执行 tsdown 的构建
- `tsdown` 可用于 Node/工具产物构建，与前端打包流程协作统一

示例：

```ts
import { defineTsdownConfig } from '@quiteer/vite'

export default defineTsdownConfig([
  { name: 'client', entry: ['src/index.ts'], outDir: 'dist/client', platform: 'node' }
])
```

## 常见问题排查

- 报错“找不到名称 ImportMetaEnv”：确认 `tsconfig.node.json` 的 `types` 含有 `vite/client`，且 `include` 包含 `env.d.ts`
- 运行时 `import.meta.env` 缺少键：检查是否在 `env.config.ts` 声明；若配置了 `requiredKeys`，必须补全
- 端口被占用：开发服务器将自动选择可用端口（可通过 `-p` 指定初始端口）
- 插件未生效：确保插件配置为数组参数或 `true`；为 `false` 则禁用
- HTML 插入未出现：检查 `html.config` 中相应字段是否正确填写（如 `position`、`src`）

## 最佳实践

- 在 `env.d.ts` 中仅声明实际需要的 `VITE_*` 键，避免污染类型空间
- 使用 `ConfigEnv<T>` 获取强类型环境对象，减少手写字符串带来的错误
- 将公共 Vite 配置放入 `vite` 字段，通过 `qvite` 统一注入插件与环境变量
- 对第三方脚本尽量采用 `async` 与合理的 `position`，避免阻塞渲染

## 安全与性能

- 避免将敏感信息直接写入 `env.config.ts` 或客户端可读的 `VITE_*` 变量
- 可通过 `obfuscate` 配置对部分变量进行混淆处理（仍需谨慎）
- 类型辅助为零运行时开销；插件插入为常量时间级开销，绝大部分性能由 Vite/浏览器决定
