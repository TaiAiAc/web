# 函数工具 (Function Utils)

提供了一组高阶函数工具，用于控制函数的执行频率、执行次数以及运行时断言，是优化前端性能和增强代码健壮性的利器。

## 为什么使用

在处理用户输入、窗口调整或滚动等高频事件时，直接执行回调会导致严重的性能问题（如页面卡顿、接口重复请求）。`debounce` 和 `throttle` 是解决此类问题的标准方案。此外，`once` 和 `assert` 等工具也能简化特定的逻辑控制。

## 优点

- **性能优化**：通过控制函数执行频率，显著降低 CPU 和网络开销。
- **灵活配置**：支持 `immediate`、`leading`、`trailing` 等细粒度选项，满足不同交互需求。
- **类型友好**：保留原函数的参数和返回值类型推导，开发体验流畅。

## 使用场景

1. **搜索框联想**：用户停止输入 300ms 后才发送请求（`debounce`）。
2. **窗口调整/滚动**：每隔 100ms 计算一次布局或加载更多数据（`throttle`）。
3. **单例初始化**：确保某些配置或连接只被初始化一次（`once`）。
4. **类型守卫**：在运行时校验数据结构，辅助 TypeScript 进行类型收窄（`assert`）。

## 使用方式

### 导入

```ts
import { assert, debounce, once, throttle } from '@quiteer/utils'
```

### 代码示例

```ts
// 1. 防抖（场景：输入框实时搜索）
const handleInput = debounce((value: string) => {
  fetchSearchResults(value)
}, 300)

// 2. 节流（场景：滚动监听）
const handleScroll = throttle(() => {
  updateStickyHeader()
}, 100)
window.addEventListener('scroll', handleScroll)

// 3. 只执行一次（场景：应用启动）
const initializeApp = once(() => {
  console.log('App Initialized')
  return true
})
initializeApp() // Logs "App Initialized"
initializeApp() // No effect

// 4. 断言（场景：运行时参数校验）
function divide(a: number, b: number) {
  assert(b !== 0, 'Divider cannot be zero')
  return a / b
}
```

## API 列表

### `debounce<T>(fn: T, wait?: number, immediate?: boolean): T & { cancel: () => void }`
防抖函数。在指定等待时间窗口内合并多次调用，仅执行最后一次。
- **wait**: 等待时间（毫秒），默认 300。
- **immediate**: 是否在首次触发时立即执行。
- **cancel**: 返回的函数包含 `cancel` 方法，可取消挂起的执行。

### `throttle<T>(fn: T, wait?: number, leading?: boolean, trailing?: boolean): T`
节流函数。在时间窗口内最多执行一次。
- **wait**: 时间窗口（毫秒），默认 300。
- **leading**: 是否允许窗口开始时触发（立即执行），默认 `true`。
- **trailing**: 是否允许窗口结束时触发（延时执行），默认 `true`。

### `once<T>(fn: T): T`
只执行一次。包装函数使其仅执行一次，后续调用直接返回首次执行结果。

### `assert(condition: any, message?: string): asserts condition`
断言函数。如果条件为假（falsy），则抛出 Error。
- **message**: 错误消息，默认 `'Assertion failed'`。
- **TypeScript**: 调用后会将 `condition` 中的变量类型收窄。
