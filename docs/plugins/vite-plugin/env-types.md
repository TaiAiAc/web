---
title: 环境变量类型生成插件
---

# @quiteer/vite-plugins · envTypesPlugin

## 概述
扫描项目根目录下的 `.env*` 文件，自动生成 `env.d.ts`，为 `import.meta.env` 提供类型提示与补全。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { envTypesPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [envTypesPlugin()]
})
```

## 选项
| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `` `root` `` | `string` | Vite 的 `` `config.root` `` | 项目根目录 |
| `` `envFilePatterns` `` | `string[]` | `` `['.env', '.env.*', '.env.*.local', '.env.local']` `` | 要扫描的环境变量文件匹配模式 |
| `` `includePrefixes` `` | `string[]` | Vite 的 `` `envPrefix` `` 或 `` `['VITE_']` `` | 仅包含指定前缀的环境变量，避免暴露敏感信息 |
| `` `outputFile` `` | `string` | `` `<root>/env.d.ts` `` | 生成的类型定义文件输出路径 |
| `` `literalUnions` `` | `boolean` | `` `true` `` | 是否生成“联合字面量类型”。开启后会跨所有匹配的 `` `.env*` `` 文件聚合每个键的值并去重，输出更精确的类型；若无可聚合值则回退为 `` `string` `` |

## 示例
```ts
envTypesPlugin({
  includePrefixes: ['VITE_', 'APP_'],
  outputFile: 'types/env.d.ts',
  literalUnions: true
})
```

## 行为说明
- dev 与 build 阶段均会生成；dev 下监听 `.env*` 变更自动更新。
- 仅保留前缀匹配的变量，避免将私密变量暴露到 `import.meta.env`。
- 联合字面量类型收集规则：
  - 从所有匹配的 `.env*` 文件中读取同名键的值，去重并排序；空值与空字符串会被忽略。
  - 若某键在所有文件中均未赋值或仅出现空值，则生成 `string` 类型。
  - 生成的类型不进行布尔/数字推断，避免运行时隐式转换导致的类型不一致。

### 示例输出（片段）
```ts
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_DESC: '通用环境变量' | '开发环境变量' | '生产环境变量'
  readonly VITE_API_URL: '/api' | '/v1' | '/v2' | string // 示例：当值较多或存在非枚举值时，可能包含 string
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

### 关闭联合字面量类型
- 如需保持所有键为 `string`，设置 `literalUnions: false`。
