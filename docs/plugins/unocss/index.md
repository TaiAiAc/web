# @quiteer/unocss

> 面向 Vite 的 UnoCSS 集成插件与可复用配置集合。提供统一的预设组合、主题、规则与快捷类，并以插件形式一键启用。

## 特性
- 集成即用：导出 Vite 插件函数，开箱加载统一的 `uno.config` 配置
- 预设组合：默认启用 `presetWind4`、`presetIcons`、`presetWebFonts`
- 主题与快捷：提供可复用的 `theme` 与 `shortcuts` 集合
- 自定义规则：支持组件层规则与通用规则扩展
- 生产友好：构建外部化原生依赖，避免跨平台 `.node` 模块打包问题


## 安装
- 主项目（使用者）需安装：
  - `pnpm add -D @quiteer/unocss`
  - 使用 Vite 5+（`vite@>=5`）

## 快速开始
```ts
// vite.config.ts
import UnoPreset from '@quiteer/unocss'
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue(),
    UnoPreset() // 加载统一的 UnoCSS 配置
  ]
}
```

## 在 Qvite 中使用
- 若使用 `@quiteer/vite`（qvite），只需开启 `UnoCSS`：
```ts
// qvite.config.ts
import { defineConfig } from '@quiteer/vite'

export default defineConfig({
  UnoCSS: true
})
```
- 启用后，qvite 会自动注入 `import 'uno.css'` 到虚拟 HTML，确保样式生效（实现位置：`packages/qvite/src/transform.ts:40-64`）。


## 内置插件

`@quiteer/unocss` 默认集成了以下 UnoCSS 预设和转换器：

- **预设 (Presets)**
  - [`@unocss/preset-wind4`](https://unocss.dev/presets/wind)：基于 Tailwind/Windi CSS 的实用工具类预设（UnoCSS v4 风格）。
  - [`@unocss/preset-icons`](https://unocss.dev/presets/icons)：纯 CSS 图标方案，支持 Iconify 数据源。
  - [`@unocss/preset-web-fonts`](https://unocss.dev/presets/web-fonts)：Web 字体预设。

- **转换器 (Transformers)**
  - [`@unocss/transformer-directives`](https://unocss.dev/transformers/directives)：支持 `@apply`, `@screen`, `theme()` 等指令。
  - [`@unocss/transformer-variant-group`](https://unocss.dev/transformers/variant-group)：支持变体组写法（如 `hover:(bg-gray-400 font-medium)`）。

## 默认配置

- shortcuts

<<< ../../../packages/unocss/src/shortcuts.ts

- theme

<<< ../../../packages/unocss/src/theme.ts

- rules

<<< ../../../packages/unocss/src/rule.ts



## 如何拓展配置

> 在根目录下创建 `uno.config.ts` 配置文件，即可拓展配置。

- defineConfig

> 可以使用 `defineConfig` 函数来获取代码提示。

- unoConfig

> 可以使用 `unoConfig` 来获取默认配置。

```ts
// uno.config.ts
import { defineConfig,unoConfig } from '@quiteer/unocss/uno.config.ts'

const myConfig = defineConfig({
  rules: [[/^wh-(\d+)$/, ([, d]) => ({ width: `${Number(d)/4}rem`, height: `${Number(d)/4}rem` })]]
})

export default myConfig
```




::: tip  配合 IDE 插件代码提示
- 虽然已经把 unocss 相关的包都内聚了，但是为了代码高亮提示还是要在根目录下创建 `uno.config.ts` 文件。
- 检查是否已经安装了对应插件，windcss 插件会跟 unocss 插件冲突
:::

如果你对当前配置满意，就不需要在 `uno.config.ts` 文件中配置了。
```ts
// uno.config.ts
export default {}
```


