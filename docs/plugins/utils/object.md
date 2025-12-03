# 对象工具 (Object Utils)

提供了一组用于对象操作的实用工具，涵盖类型判断、空值检测、深拷贝、深合并以及属性的挑选、排除和路径访问。

## 为什么使用

JavaScript 中的对象操作充满陷阱，例如 `null` 也是对象、引用类型的副作用、深度合并的复杂性以及访问嵌套属性时的 `undefined` 报错。本模块封装了这些底层细节，提供了一套安全、直观的 API。

## 优点

- **安全可靠**：`get/set` 自动处理路径中可能出现的 `null/undefined`，防止运行时报错。
- **深度处理**：`deepClone` 和 `deepMerge` 支持递归操作，解决浅拷贝无法隔离引用和合并配置的问题。
- **类型辅助**：`isPlainObject` 严格区分普通对象与数组/日期等其他引用类型。

## 使用场景

1. **配置合并**：将用户配置与默认配置深度合并（`deepMerge`）。
2. **数据防篡改**：在传递数据前创建副本，防止下游修改影响上游（`deepClone`）。
3. **安全访问**：从深层嵌套的后端数据中读取字段，避免 `Cannot read property of undefined`（`get`）。
4. **字段清洗**：提交表单前只保留需要的字段或剔除敏感字段（`pick/omit`）。

## 使用方式

### 导入

```ts
import { deepClone, deepMerge, get, isEmpty, isObject, isPlainObject, omit, pick, set } from '@quiteer/utils'
```

### 代码示例

```ts
// 1. 深拷贝与合并
const defaultCfg = { theme: { color: 'blue', font: 'arial' } }
const userCfg = { theme: { color: 'red' } }
const finalCfg = deepMerge(defaultCfg, userCfg)
// => { theme: { color: 'red', font: 'arial' } }

// 2. 安全路径读写
const data = { users: [{ id: 1, profile: { name: 'Alice' } }] }
const name = get(data, 'users[0].profile.name') // => 'Alice'
const age = get(data, 'users[0].profile.age', 18) // => 18 (默认值)

set(data, 'users[0].settings.active', true) // 自动创建 settings 对象

// 3. 属性挑选与排除
const user = { id: 1, name: 'Bob', password: '123', token: 'abc' }
const publicInfo = pick(user, ['id', 'name']) // => { id: 1, name: 'Bob' }
const safeUser = omit(user, ['password', 'token']) // => { id: 1, name: 'Bob' }
```

## API 列表

### `isObject(value: unknown): boolean`
判断是否为对象（非 `null`）。
- **Returns**: `value !== null && typeof value === 'object'`。

### `isPlainObject(value: unknown): boolean`
判断是否为普通对象（`{}`）。
- **Note**: 排除数组、Date、RegExp 等特殊对象。

### `isEmpty(value: unknown): boolean`
判断值是否为空。
- **Rules**: `null/undefined`、空字符串（trim后）、空数组、空对象均返回 `true`。

### `deepClone<T>(value: T): T`
深拷贝对象。
- **Impl**: 优先使用 `structuredClone`，回退策略为递归拷贝。

### `deepMerge<T>(...sources: T[]): T`
深合并对象。
- **Rules**: 递归合并对象属性；数组属性进行拼接；基本类型覆盖。

### `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`
挑选属性。返回仅包含指定键的新对象。

### `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`
排除属性。返回排除指定键的新对象。

### `get(obj: any, path: string, defaultValue?: any): any`
通过路径读取值。
- **Path**: 支持 `.` 和 `[]` 语法（如 `a.b[0].c`）。
- **Default**: 路径不可达时返回 `defaultValue`。

### `set(obj: any, path: string, value: any): any`
通过路径设置值。
- **Behavior**: 路径中间缺失的属性会自动创建为对象或数组。
