# 数组工具

提供数组相关工具：判断、去重、分块、扁平化、分组、分隔等。

## 导入
```ts
import { chunk, flatten, groupBy, isArray, partition, unique } from '@quiteer/utils'
```

## API 与示例

### isArray(value)
```ts
// 函数：判断是否为数组
// 作用：返回 true/false
isArray([1, 2]) // => true
isArray('x') // => false
```

### unique(arr)
```ts
// 函数：数组去重
// 作用：返回不含重复元素的新数组
unique([1, 2, 2, 3]) // => [1, 2, 3]
```

### chunk(arr, size)
```ts
// 函数：数组分块
// 作用：按指定大小切分为二维数组
chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
```

### flatten(arr, depth?)
```ts
// 函数：扁平化数组
// 作用：将多维数组拍平为一维（深度 1 或指定深度）
flatten([1, [2], [3, 4]]) // => [1, 2, 3, 4]
```

### groupBy(arr, keyFn)
```ts
// 函数：分组数组
// 作用：按键函数返回值对数组进行分组
const grouped = groupBy([
  { name: 'A', role: 'admin' },
  { name: 'B', role: 'user' },
  { name: 'C', role: 'admin' }
], x => x.role)
// grouped.admin => [{...},{...}]
```

### partition(arr, predicate)
```ts
// 函数：数组分隔
// 作用：根据谓词划分为命中与未命中两部分
partition([1, 2, 3, 4], n => n % 2 === 0) // => [[2, 4], [1, 3]]
```
<!-- eof -->
