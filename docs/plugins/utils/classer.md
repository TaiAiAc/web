# 工具类 (Classes)

本模块提供了一组面向对象的实用工具类，封装了状态管理、数据持久化和定时任务等复杂逻辑，帮助开发者快速构建健壮的功能模块。

目前包含以下工具类：
- **HistoryManager**：历史记录管理（支持撤销/重做）。
- **PersistentStore**：持久化存储封装（支持命名空间、适配器模式）。
- **TimedArray**：定时数组（支持固定/随机间隔的数据流模拟）。

---

## HistoryManager (历史记录管理器)

### 为什么使用
在实现撤销（Undo）、重做（Redo）或操作日志功能时，手动维护状态栈和指针非常繁琐且容易出错（如“未来”记录的清理、最大长度限制等）。`HistoryManager` 封装了这些逻辑，提供简洁的 API。

### 优点
- **自动管理**：自动处理指针移动、未来记录截断和最大长度限制。
- **内存友好**：支持设置最大历史条数，避免无限增长导致的内存泄漏。
- **元数据支持**：每条记录自动携带时间戳，方便回溯。

### 使用场景
1. **表单编辑器**：记录用户的输入历史，支持 Ctrl+Z 撤销。
2. **画布/设计工具**：记录元素的位置、大小变化。
3. **配置面板**：允许用户回滚到之前的配置状态。

### 使用方式

```ts
import { HistoryManager } from '@quiteer/utils'

// 1. 初始化：最大保留 10 条记录
const history = new HistoryManager<string>(10)

// 2. 记录操作
history.record('Step 1')
history.record('Step 2')
history.record('Step 3')

console.log(history.getCurrentValue()) // => 'Step 3'

// 3. 撤销操作
const undoVal = history.undo() // 撤销一步
console.log(undoVal) // => 'Step 2'

// 4. 再次记录（会丢弃 Step 3）
history.record('Step 2-New')

// 5. 获取完整历史用于调试
console.log(history.getFullHistory())
```

### API 列表

- `constructor(maxSize: number = 10)`: 构造函数。
- `record(value: T): void`: 记录新状态（并清除当前指针之后的“未来”状态）。
- `undo(steps: number = 1): T | undefined`: 撤销指定步数，返回新状态。
- `getCurrentValue(): T | undefined`: 获取当前状态值。
- `getCurrentTimestamp(): number | undefined`: 获取当前状态的时间戳。
- `canUndo(): boolean`: 是否可撤销。
- `historySize(): number`: 当前历史栈大小。
- `clear(): void`: 清空历史。

---

## PersistentStore (持久化存储)

### 为什么使用
原生 `localStorage` 是全局共享的，容易发生键名冲突（Key Collision）。此外，它只能存储字符串，读写时需要手动序列化/反序列化。`PersistentStore` 引入了“命名空间”概念，并内置 JSON 处理，解决了这些痛点。

### 优点
- **命名空间隔离**：通过 `namespace` 隔离不同模块的数据，防止冲突。
- **自动序列化**：直接存取对象、数组等结构化数据，无需手动 `JSON.parse`。
- **适配器模式**：支持自定义存储后端（内存、localStorage、sessionStorage 或其他）。
- **索引管理**：维护当前命名空间下的 Key 列表，支持按命名空间批量清空。

### 使用场景
1. **用户偏好设置**：存储主题色、语言等配置，与其他业务数据隔离。
2. **表单草稿**：自动保存未提交的表单数据。
3. **Token 管理**：安全地封装 Token 的存取逻辑。

### 使用方式

```ts
import { PersistentStore, createWebStorageAdapter } from '@quiteer/utils'

// 1. 获取实例（默认使用内存存储，刷新丢失）
const memStore = PersistentStore.getInstance('cache')

// 2. 获取实例（使用 localStorage持久化）
const localStore = PersistentStore.getInstance('app-settings', createWebStorageAdapter(localStorage))

// 3. 存取数据（自动序列化）
localStore.set('theme', { mode: 'dark', fontSize: 14 })
const theme = localStore.get('theme', { mode: 'light' }) // 支持默认值

// 4. 判断与删除
if (localStore.has('theme')) {
  localStore.remove('theme')
}

// 5. 清空当前命名空间（不影响其他命名空间）
localStore.clear()
```

### API 列表

- `static getInstance(namespace?: string, adapter?: StorageAdapter): PersistentStore`: 获取单例。
- `set<T>(key: string, value: T): void`: 存储数据。
- `get<T>(key: string, defaultValue?: T): T | undefined`: 读取数据。
- `has(key: string): boolean`: 判断键是否存在。
- `remove(key: string): void`: 删除指定键。
- `keys(): string[]`: 列出当前命名空间下的所有键。
- `clear(): void`: 清空当前命名空间。
- `export(): Record<string, unknown>`: 导出数据。
- `import(data: Record<string, unknown>): void`: 导入数据。

---

## TimedArray (定时数组)

### 为什么使用
在开发实时监控、弹幕系统或模拟数据流时，我们需要按固定频率产生数据，或按随机频率模拟用户行为。`TimedArray` 提供了一个可配置的定时器容器，简化了这类逻辑的编写。

### 优点
- **双模式支持**：同时支持固定间隔（Fixed Interval）和随机间隔（Random Interval）的任务。
- **自动管理**：内置 `start/stop` 控制，无需手动管理 `setInterval/setTimeout` 的清除。
- **事件驱动**：提供 `onPush`、`onPop` 等回调钩子，方便与 UI 绑定。

### 使用场景
1. **实时图表模拟**：按固定频率生成数据点，推动折线图更新。
2. **消息队列消费**：按固定频率从数组中 `pop` 数据进行处理。
3. **压力测试模拟**：按随机频率向系统发送请求或生成日志。

### 使用方式

```ts
import { TimedArray } from '@quiteer/utils'

// 1. 配置定时数组
const stream = new TimedArray<number>({
  fixedInterval: 1000,        // 每 1000ms 执行一次固定操作
  fixedPushValue: () => Date.now(), // 固定操作：推入当前时间戳
  enableFixedPop: true,       // 固定操作：同时也移除旧数据（模拟滑动窗口）
  
  randomIntervalRange: [500, 2000], // 随机操作间隔 500-2000ms
  randomPushValue: () => Math.random() // 随机操作：推入随机数
})

// 2. 绑定事件
stream.onPush = (val) => console.log('New Data:', val)
stream.onPop = () => console.log('Data Removed')

// 3. 启动与停止
stream.start()

setTimeout(() => {
  stream.stop()
  console.log('Final Array:', stream.getArray())
}, 10000)
```

### API 列表

- `constructor(options: TimedArrayOptions)`: 构造函数。
- `start(): void`: 启动定时任务。
- `stop(): void`: 停止任务。
- `push(value: T): void`: 手动推入数据。
- `pop(): T | undefined`: 手动移除数据。
- `getArray(): T[]`: 获取当前数组副本。
- `clear(): void`: 清空数组。
- `destroy(): void`: 销毁实例（停止任务并清空）。
