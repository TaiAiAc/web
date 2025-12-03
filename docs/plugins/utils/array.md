# 数组工具 (Array Utils)

提供了一组常用的数组操作工具，涵盖去重、分块、扁平化、分组与分隔等场景，旨在简化日常开发中的数据处理逻辑。

## 为什么使用

在前端数据处理中，数组操作占据了很大比重。虽然 ES6+ 提供了强大的数组方法，但在某些特定场景（如分组、分块）下，原生 API 仍需编写冗余代码。本模块封装了这些高频操作，提供语义化强、类型安全的函数，提升代码可维护性。

## 优点

- **类型安全**：基于 TypeScript 构建，泛型支持完善，自动推导返回值类型。
- **高性能**：底层尽可能使用原生 API（如 `Set` 去重、`reduce` 分组），保证执行效率。
- **零依赖**：无需引入 lodash 等大型库，轻量级实现。

## 使用场景

1. **数据去重**：接口返回的列表可能包含重复项，使用 `unique` 快速清洗。
2. **分页展示**：将长列表使用 `chunk` 切分为多页或多行展示。
3. **数据归类**：使用 `groupBy` 将扁平化的数据按类别聚合（如按日期、部门分组）。
4. **状态拆分**：使用 `partition` 将任务列表拆分为“已完成”和“未完成”两组。

## 使用方式

### 导入

```ts
import { chunk, flatten, groupBy, partition, unique } from '@quiteer/utils'
```

### 代码示例

```ts
// 1. 数组去重
const tags = ['js', 'css', 'js', 'html']
const uniqueTags = unique(tags) // => ['js', 'css', 'html']

// 2. 数组分块（场景：轮播图每页显示 3 个）
const items = [1, 2, 3, 4, 5, 6, 7]
const pages = chunk(items, 3) // => [[1, 2, 3], [4, 5, 6], [7]]

// 3. 数组分组（场景：按权限归类用户）
const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'admin' }
]
const usersByRole = groupBy(users, u => u.role)
/* =>
{
  admin: [{ id: 1, ... }, { id: 3, ... }],
  user: [{ id: 2, ... }]
}
*/

// 4. 数组分隔（场景：分离及格与不及格成绩）
const scores = [85, 59, 90, 42, 78]
const [passed, failed] = partition(scores, s => s >= 60)
// passed => [85, 90, 78]
// failed => [59, 42]
```

## API 列表

### `unique<T>(arr: T[]): T[]`
数组去重。使用 `Set` 保持原始顺序。
- **注意**：对象去重基于引用相等。

### `chunk<T>(arr: T[], size: number): T[][]`
数组分块。将数组按指定大小切分为二维数组。
- **size**：每个分块的最大长度。

### `flatten<T>(arr: (T | T[])[], depth?: number): T[]`
数组扁平化。
- **depth**：默认为 1，仅拍平一层。如需深度拍平可多次调用或使用原生 `flat`。

### `groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Record<K, T[]>`
数组分组。
- **keyFn**：生成分组键的函数，支持返回 string/number/symbol。

### `partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]]`
数组分隔。
- **returns**：返回二元组 `[满足条件的元素, 不满足条件的元素]`。
