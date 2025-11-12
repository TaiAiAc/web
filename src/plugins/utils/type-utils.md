# 类型工具

本页介绍 `@quiteer/utils` 中提供的常用 TypeScript 类型工具与相关辅助函数。

## 常用类型
- `DeepPartial<T>`：将对象所有属性递归设为可选
- `DeepRequired<T>`：将对象所有属性递归设为必填
- `RequiredKeys<T>` / `OptionalKeys<T>`：获取必填/可选键集合
- `ValueOf<T>`：提取对象值的联合类型
- `UnionToIntersection<U>`：联合转交叉
- `ReadonlyDeep<T>` / `Mutable<T>`：递归只读/去只读
- `Exact<T, U>`：确保 `U` 没有 `T` 之外的多余属性
- `KeysOfType<T, V>` / `PickByValue<T, V>` / `OmitByValue<T, V>`：按值类型选择/排除键
- `Nullable<T>` / `NullableDeep<T>`：属性变为可空（递归）
- `Primitive` / `JSONValue`：原始类型与可序列化 JSON 类型
- `Brand<T, B>`：品牌类型，为基本类型打标识
- `IfEquals<X, Y, A, B>` / `IsAny<T>` / `IsNever<T>`：条件与类型判别
- `TupleToUnion<T>` / `UnionToTuple<U>`：元组与联合互转（简化）
- `Overwrite<T, U>` / `Merge<T, U>` / `Expand<T>`：对象类型覆盖、合并、展开显示

## 结果类型与辅助函数
- `Result<T, E>`：统一成功/失败的返回结构
- `ok(value)`：生成成功结果
- `err(error)`：生成失败结果

## 使用示例
```ts
import type {
  Brand,
  DeepPartial,
  DeepRequired,
  Exact,
  Expand,
  IfEquals,
  IsAny,
  IsNever,
  JSONValue,
  KeysOfType,
  Merge,
  Mutable,
  Nullable,
  NullableDeep,
  OmitByValue,
  Overwrite,
  PickByValue,
  Primitive,
  ReadonlyDeep,
  RequiredKeys,
  TupleToUnion,
  UnionToIntersection,
  UnionToTuple,
  ValueOf
} from '@quiteer/utils'

// 函数：使用 DeepPartial
// 作用：对配置进行增量更新
interface Config { a: number, nested: { x: number, y?: number } }
const patch: DeepPartial<Config> = { nested: { y: 2 } }

// 函数：Exact 确保无多余属性
// 作用：约束对象必须精确匹配目标结构
interface User { id: number, name: string }
const u: Exact<User, { id: number, name: string }> = { id: 1, name: 'A' }

// 函数：按值类型挑选键
// 作用：仅保留值类型为 string 的键
interface T { a: string, b: number, c: string }
type OnlyStringKeys = KeysOfType<T, string> // 'a' | 'c'
type OnlyString = PickByValue<T, string> // { a: string, c: string }

// 函数：Result 统一返回
// 作用：配合 ok/err 明确成功或失败分支
type Result<T, E = Error> = { ok: true, value: T } | { ok: false, error: E }
function parseToInt(v: string): Result<number> {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n)
    ? { ok: true, value: n }
    : { ok: false, error: new Error('NaN') }
}

// 函数：Brand 为 ID 打品牌
// 作用：避免不同 ID 混用
type UserId = Brand<number, 'UserId'>
function loadUser(id: UserId) {
  return { id, name: 'someone' }
}
```
<!-- eof -->

更多类型可在编辑器中直接查看提示；也可在源码 `packages/utils/src/type-utils.ts` 浏览完整定义。
