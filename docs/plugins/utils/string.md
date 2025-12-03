# 字符串工具

提供一组常用的字符串处理函数：大小写转换、命名风格转换、空白裁剪、内容截断与类型判断等，帮助在 UI 展示、URL 生成、表单清洗等场景下提升开发效率与代码一致性。

## 为什么使用
- 统一命名风格：在路由、文件名、接口参数等需要一致命名的地方，快速在 `kebab-case` 与 `snake_case` 间转换。
- 安全展示：对文案超长场景进行截断，避免布局破坏，同时提供可配置后缀。
- 输入清洗：表单提交前去除空白并进行类型判断，减少后端校验压力。

## 优势
- 轻量零依赖：基于原生字符串操作与正则实现，无需引入第三方库。
- 类型安全：完整的 TypeScript 类型标注，`isString` 提供类型窄化。
- 语义明确：函数命名清晰，读写友好，降低维护成本。

## 使用方式

### 导入
```ts
import { capitalize, isString, kebabCase, snakeCase, trim, truncate } from '@quiteer/utils'
```

### 代码示例
```ts
// 1) 生成 URL slug（商品详情页）
const productName = 'Nike Air Max 2025'
const slug = kebabCase(productName) // => 'nike-air-max-2025'
// 用于路由：/products/nike-air-max-2025

// 2) 生成后端字段名（日志/监控指标）
const metricKey = snakeCase('PageViewCount') // => 'page_view_count'

// 3) UI 文案安全截断（卡片标题/列表项）
const title = '这是一个非常非常非常长的标题，可能会撑破布局'
const shortTitle = truncate(title, 12) // => '这是一个非常...'

// 4) 表单输入清洗与类型判断
const raw = '   Quiteer  '
if (isString(raw)) {
  const normalized = trim(raw) // => 'Quiteer'
}

// 5) 统一标题格式
capitalize('hello world') // => 'Hello world'
```

## API 列表

### `capitalize(input: string): string`
首字母大写。

### `kebabCase(input: string): string`
转为 `kebab-case`（短横线分隔的小写）。

### `snakeCase(input: string): string`
转为 `snake_case`（下划线分隔的小写）。

### `trim(input: string): string`
去除字符串首尾空白。

### `truncate(input: string, maxLength: number, suffix?: string): string`
超长截断并追加后缀（默认 `'...'`）。

### `isString(value: unknown): value is string`
类型判断：是否为原始字符串。

<!-- eof -->
