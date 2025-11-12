# 数字工具

提供数字相关工具：类型判断、范围裁剪、区间判断、随机整数生成等。

## 导入
```ts
import { clamp, inRange, isNumber, randomInt } from '@quiteer/utils'
```

## API 与示例

### isNumber(value)
```ts
// 函数：判断是否为数字
// 作用：返回布尔值（排除 NaN）
isNumber(1) // => true
isNumber(Number.NaN) // => false
```

### clamp(n, min, max)
```ts
// 函数：限制数值范围
// 作用：将数值限制在 [min, max] 区间
clamp(128, 0, 100) // => 100
```

### inRange(n, start, end)
```ts
// 函数：是否在范围内
// 作用：判断数值是否落在半开半闭区间 [start, end)
inRange(5, 0, 10) // => true
inRange(10, 0, 10) // => false
```

### randomInt(min, max)
```ts
// 函数：生成整数随机数
// 作用：返回 [min, max] 闭区间的随机整数
randomInt(1, 6) // => 1~6 任一整数
```
<!-- eof -->
