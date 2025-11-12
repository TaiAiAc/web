# 对象工具

提供对象相关工具：判断、空值检测、深拷贝、深合并、挑选/排除、路径读写等。

## 导入
```ts
import { deepClone, deepMerge, get, isEmpty, isObject, isPlainObject, omit, pick, set } from '@quiteer/utils'
```

## API 与示例

### isObject(value)
```ts
// 函数：判断是否为对象（非 null）
// 作用：过滤 null 与非对象值
isObject({}) // => true
isObject(null) // => false
```

### isPlainObject(value)
```ts
// 函数：判断是否为普通对象
// 作用：区分数组、日期等特殊对象
isPlainObject({}) // => true
isPlainObject([]) // => false
```

### isEmpty(value)
```ts
// 函数：判断值是否为空
// 作用：字符串空、数组长度为 0、对象无自有属性均视为空
isEmpty('  ') // => true
isEmpty([]) // => true
isEmpty({ a: 1 }) // => false
```

### deepClone(value)
```ts
// 函数：深拷贝对象
// 作用：优先使用结构化拷贝，不可用时回退为递归拷贝
const src = { a: 1, nested: { x: 1 } }
const copy = deepClone(src)
```

### deepMerge(...sources)
```ts
// 函数：深合并对象
// 作用：将多个对象深度合并为新对象（数组拼接、对象递归）
deepMerge({ a: 1, list: [1] }, { b: 2, list: [2] })
// => { a:1, b:2, list:[1,2] }
```

### pick(obj, keys)
```ts
// 函数：挑选对象属性
// 作用：返回仅包含指定键的新对象
pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
```

### omit(obj, keys)
```ts
// 函数：排除对象属性
// 作用：返回排除指定键的新对象
omit({ a: 1, b: 2, c: 3 }, ['b']) // => { a: 1, c: 3 }
```

### get(obj, path, defaultValue?)
```ts
// 函数：通过路径读取对象值
// 作用：支持 a.b[0].c 风格路径读取，未命中返回默认值
const obj = { a: { b: [{ c: 1 }] } }
get(obj, 'a.b[0].c') // => 1
get(obj, 'a.x.y', 0) // => 0
```

### set(obj, path, value)
```ts
// 函数：通过路径设置对象值
// 作用：支持 a.b[0].c 风格路径写入，不存在时自动创建
const obj = {}
set(obj, 'a.b[0].c', 1) // => { a: { b: [ { c: 1 } ] } }
```
