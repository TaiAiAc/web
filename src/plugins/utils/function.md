# 函数工具

提供常用函数相关工具：类型判断、防抖、节流、只执行一次、断言等。

## 导入
```ts
import { assert, debounce, isFunction, once, throttle } from '@quiteer/utils'
```

## API 与示例

### isBoolean(value)
```ts
// 函数：判断是否为布尔值
// 作用：返回 true/false
isBoolean(true) // => true
isBoolean('true') // => false
```

### isFunction(value)
```ts
// 函数：判断是否为函数
// 作用：用于类型收窄
function f() {}
isFunction(f) // => true
```

### debounce(fn, wait, immediate?)
```ts
// 函数：防抖
// 作用：在等待时间内合并多次调用，仅最后一次执行（可选立即执行）
const save = debounce((text: string) => {
  console.info('save:', text)
}, 300)
save('a')
save('ab')
save('abc') // 仅最后一次触发
```

### throttle(fn, wait, leading?, trailing?)
```ts
// 函数：节流
// 作用：在时间窗口内最多执行一次，可配置首尾触发
const scroll = throttle(() => {
  console.info('scroll')
}, 200)
```

### once(fn)
```ts
// 函数：只执行一次
// 作用：包装函数使其只执行一次，后续调用返回首次结果
const init = once(() => ({ ready: true }))
init() // => { ready: true }
init() // => 仍返回首次结果
```

### assert(condition, message?)
```ts
// 函数：断言
// 作用：条件为假时抛出错误；并在 TS 层收窄类型
function mustNumber(v: unknown) {
  assert(typeof v === 'number', 'not number')
  // 这里 v 已被收窄为 number
  return v + 1
}
```
