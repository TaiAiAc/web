# 虚拟 HTML （virtual-html）

## 为什么使用
- 无需维护 `index.html`：以配置对象生成根 HTML，减少重复编辑与合并冲突。
- 与 Vite 生态兼容：开发阶段仍走 `transformIndexHtml`，其他 HTML 插件的变换不会丢失。
- 更友好的抽象：统一用对象描述标签，易于版本化与复用，适合多项目模板化交付。
- 默认开箱可用：内置默认配置（标题、入口、基础 `meta`、`favicon`、`div#app`），零成本启动。
- 构建同样生效：以每页入口模块作为 Rollup 输入，构建结束自动重写各页面 HTML 的入口与样式指向 `assets` 产物，保持“无 HTML 文件”的体验。

## 快速上手
```ts
import { defineConfig } from 'vite'
import { virtualHtmlPlugin } from '@quiteer/vite-plugins'

export default defineConfig(() => ({
  plugins: [
    virtualHtmlPlugin({
      fallbackWhenIndexExists: true,
      config: {
        title: 'App',
        entry: '/src/main.ts',
        htmlAttrs: { lang: 'zh-CN' },
        bodyAttrs: { class: 'theme-light' },
        link: [{ src: '/src/style.css', position: 'head' }],
        script: [{ src: 'https://cdn.example.com/analytics.js', async: true, position: 'body-append' }],
        tags: [{ tag: 'link', attrs: { rel: 'icon', href: '/vite.svg' }, selfClosing: true, position: 'head' }]
      },
      pages: {
        '/nested/index.html': {
          title: 'Nested Page',
          entry: '/src/nested/main.ts',
          link: [{ src: '/src/style.css', position: 'head' }]
        }
      }
    })
  ]
}))
```

## 配置模型
**VirtualHtmlOptions**

| 参数 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `root` | `string` | Vite `root` | 项目根目录 |
| `fallbackWhenIndexExists` | `boolean` | `false` | 存在真实 `index.html` 时是否仍启用虚拟 HTML |
| `config` | `VirtualHtmlConfig` | `-` | 单页基础配置，作为所有页面的默认基线 |
| `pages` | `Record<string, HtmlVirtualConfig | undefined>` | `-` | 多页面覆盖映射，键为以 `/` 开头的路由路径 |

**HtmlVirtualConfig**

| 参数 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `htmlAttrs` | `Record<string, string|number|boolean|null|undefined>` | `{ lang: 'zh-CN' }` | `<html>` 属性，浅合并 |
| `headAttrs` | `Record<string, string|number|boolean|null|undefined>` | `-` | `<head>` 属性，浅合并 |
| `bodyAttrs` | `Record<string, string|number|boolean|null|undefined>` | `{ class: 'theme-light' }` | `<body>` 属性，浅合并 |
| `title` | `string` | `'Vue App'` | 文档标题 |
| `entry` | `string` | `'/src/main.ts'` | 入口脚本（以 `<script type="module">` 注入） |
| `appRoot` | `{ tag?: string; id?: string; attrs?: Record<string, string|number|boolean|null|undefined> }` | `div#app` | 应用根节点；`tag/id` 覆盖，`attrs` 浅合并 |
| `tags` | `VirtualHtmlTag[]` | `[]` | 自定义标签列表，支持 `position` |
| `script` | 见下表 | `[]` | 外链脚本集合，默认位置 `body-append` |
| `link` | 见下表 | `[]` | 外链样式集合，默认位置 `head` |

## config 与 pages 的关系
- `config` 提供“基础配置”，作为所有页面的默认值来源。
- `pages` 为“按页面覆盖”：对每个键（如 `/index.html`、`/nested/index.html`）在 `config` 基础上进行覆盖与浅合并。
- 覆盖与合并规则（以每页为单位）：
  - `title/entry/tags/script/link`：提供则整体替换，不提供沿用基础值。
  - `htmlAttrs/headAttrs/bodyAttrs`：与基础值浅合并（同键覆盖）。
  - `appRoot.id/appRoot.tag`：单独覆盖；`appRoot.attrs`：浅合并。
- 路径规范化：允许键写作 `/`、`/index.html`、`/nested`、`/nested/`，内部统一归一为 `.../index.html`，并支持同义访问映射到同一页面。

## 多页面行为
- 开发阶段
  - 中间件拦截访问路径，归一化为 `.../index.html`，按 `pages` 映射或回退到 `config` 生成 HTML；随后走 `server.transformIndexHtml` 应用其他插件变换。
  - 若存在真实 `index.html` 且未开启 `fallbackWhenIndexExists`，不拦截请求，交由 Vite 默认处理。
- 构建阶段
  - 在 `config` 钩子按每页的 `entry` 作为 `rollupOptions.input`，同时生成临时 HTML 到项目根的 `/.quiteer/**/index.html` 以备兜底。
  - 产出后将根部的 `name.html` 复制回目标页面路径（如 `nested/index.html`），并进行“资源重写”：
    - 依据 `manifest.json` 将 `<script type="module" src="/src/...">` 重写为 `/assets/*.js`；
    - 移除指向 `/src/...` 的 `<link rel="stylesheet">` 并注入构建后的 `/assets/*.css`；
    - 若无 `manifest.json`，按约定推测入口产物名（根页使用 `index-*`，其他页使用入口名如 `main-*`）。
  - 最终 `dist` 中保留与 `pages` 键一致的目录结构，例如：
    - `dist/index.html`
    - `dist/nested/index.html`
    - `dist/group-a/users/index.html`

## 标签注入与默认项
- `meta charset` 与 `meta viewport`：若未在 `tags` 中显式提供，默认注入两项基础 meta，避免重复注入。
- `script` 默认位置 `body-append`；`link` 默认位置 `head`。
- `tags` 未指定 `position` 且为 `script` 时，视为 `body-append` 注入。

## 脚本与样式
- `script[]`

| 字段 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `src` | `string` | `-` | 资源地址（必填） |
| `type` | `string` | `-` | 脚本类型，如 `'module'` |
| `async` | `boolean` | `false` | 异步加载脚本 |
| `defer` | `boolean` | `false` | 延迟执行脚本 |
| `crossorigin` | `'anonymous' | 'use-credentials'` | `-` | 跨域策略 |
| `integrity` | `string` | `-` | SRI 哈希校验 |
| `referrerpolicy` | `string` | `-` | 引荐策略 |
| `nonce` | `string` | `-` | CSP nonce |
| `fetchpriority` | `'high' | 'low' | 'auto'` | `'auto'` | 获取优先级 |
| `attrs` | `Record<string, string|number|boolean|null|undefined>` | `-` | 扩展自定义属性（如 `data-*`） |
| `position` | `'head' | 'body-prepend' | 'body-append'` | `'body-append'` | 注入位置 |

- `link[]`

| 字段 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `src` | `string` | `-` | 样式地址（必填） |
| `rel` | `'stylesheet'` | `'stylesheet'` | `<link>` 的 `rel` 值 |
| `media` | `string` | `-` | 媒体过滤（如 `screen`/`print`） |
| `crossorigin` | `'anonymous' | 'use-credentials'` | `-` | 跨域策略 |
| `integrity` | `string` | `-` | SRI 哈希校验 |
| `referrerpolicy` | `string` | `-` | 引荐策略 |
| `attrs` | `Record<string, string|number|boolean|null|undefined>` | `-` | 扩展自定义属性 |
| `position` | `'head' | 'body-prepend' | 'body-append'` | `'head'` | 注入位置 |

- 与 `tags` 的关系：`script[]/link[]` 会被转换为对应的标签描述并按位置与 `tags` 一同渲染；`tags` 适用于更自由的标签注入（包含 `<style>`、内联 `<script>` 等）。
- 构建期行为说明：
  - 若 `<link>` 的 `href` 指向源码目录（如 `"/src/style.css"`），构建后会被移除，并根据入口产物自动注入 `/assets/*.css`；
  - 推荐将样式通过入口模块 `import './style.css'` 引入，以确保产物提取与注入稳定；如需保留 `<link>`，请指向可发布的静态资源（如 `public`）。

示例：
```ts
virtualHtmlPlugin({
  config: {
    link: [
      { src: '/assets/base.css', position: 'head' },
      { src: '/assets/print.css', media: 'print', position: 'head' }
    ],
    script: [
      { src: 'https://cdn.example.com/analytics.js', async: true, position: 'body-append', attrs: { 'data-app': 'quiteer' } },
      { src: '/assets/feature.js', type: 'module', position: 'body-prepend' }
    ]
  }
})
```

## 类型与提示
```ts
import type { VirtualHtmlOptions, VirtualHtmlConfig, VirtualHtmlTag } from '@quiteer/vite-plugins'

const tags: VirtualHtmlTag[] = [
  { tag: 'link', attrs: { rel: 'icon', href: '/icons/app.svg' }, selfClosing: true, position: 'head' },
  { tag: 'script', attrs: { type: 'module', src: '/feature.ts' }, position: 'body-append' },
  { tag: 'meta', attrs: { name: 'theme-color', content: '#222' }, selfClosing: true, position: 'head' }
]

const cfg: VirtualHtmlConfig = {
  title: 'Quiteer App',
  entry: '/src/main.ts',
  htmlAttrs: { lang: 'zh-CN' },
  bodyAttrs: { class: 'theme-dark' },
  link: [{ src: '/src/style.css', media: 'screen', position: 'head', attrs: { id: 'main-style' } }],
  script: [{ src: '/vendor/feature.js', defer: true, position: 'body-append' }],
  tags,
  appRoot: { id: 'app', tag: 'div', attrs: { 'data-app': 'root' } }
}

const opt: VirtualHtmlOptions = {
  config: cfg,
  pages: {
    '/index.html': { title: 'Home' },
    '/nested/index.html': { title: 'Nested', entry: '/src/nested/main.ts' }
  },
  fallbackWhenIndexExists: true
}
```
- IDE 对 `tag/attrs/selfClosing/position` 提示与约束；`attrs` 支持 `string|number|boolean|null|undefined`。
- `position` 支持 `head | body-prepend | body-append`；当未指定且为 `script` 时默认视为 `body-append`。

## 应用场景
- 脚手架与模板工程：统一 HTML 输出，项目间复用一套配置。
- 多主题/多品牌：通过配置切换 `favicon`、`title`、`meta`，无需维护多份 `index.html`。
- Demo/样例：快速生成可运行的 HTML 根结构，突出入口脚本与根节点。
- CI/CD：构建时生成入口 HTML，弱化仓库中的静态 HTML 依赖。

## 注意事项
- 安全：避免将未验证文本直接放入 `children`；为外部资源设置 `integrity + crossorigin` 并评估来源可信度。
- 入口：`entry` 默认 `'/src/main.ts'`，需为 ES Module 并能正常挂载应用至 `appRoot`。
- 回退策略：存在真实 `index.html` 时，若需覆盖，请显式启用 `fallbackWhenIndexExists`。
- 项目结构：支持“非标准结构”，只需在每页配置中提供正确的入口脚本路径；构建后会自动重写 HTML 以指向 `assets` 产物。

## 非标准项目结构支持
- 自定义根目录：插件以 Vite 的 `root`（或插件的 `options.root`）为准解析所有路径，适用于多仓/子应用结构。
- 自定义入口位置：`entry` 可为绝对（以 `/` 开头，相对于项目根）或相对路径（不以 `/` 开头）；构建期将该入口作为 Rollup 输入。
- 静态资源：建议放 `public/`，例如 `<img src="/logo.svg">` 或 `<link href="/styles/app.css">`，构建会原样复制到 `dist`。
- 页面键规范：在 `pages` 中使用以 `/` 开头的路由键，推荐标准写法 `'/path/to/index.html'`；也支持 `'/path/to'` 与 `'/path/to/'`（内部统一归一为 `index.html`）。

## 构建输出与资源重写细节
- 多页面输入名唯一化：
  - 根页面使用 `index`，其他页面按路径段以 `__` 连接（如 `/group-a/users/index.html` → `group-a__users`），避免输入名冲突。
- 资源重写顺序：
  - 首选 `manifest.json`（精确文件名）；
  - 兜底采用约定命名推测（根页 `index-*`，非根页使用入口名如 `main-*`）。
- 重写内容：
  - `<script type="module" src="/src/...">` → `<script type="module" crossorigin src="/assets/*.js">`
  - 移除 `href="/src/..."` 的 `<link>`，注入 `/assets/*.css` 到 `</head>` 前。

## 示例：内联脚本与自定义标签
```ts
export default {
  title: 'App',
  entry: '/src/main.ts',
  tags: [
    { tag: 'meta', attrs: { name: 'color-scheme', content: 'dark light' }, selfClosing: true, position: 'head' },
    { tag: 'script', children: 'window.__BOOT__ = Date.now()' }
  ],
  appRoot: { id: 'app' }
}
```
