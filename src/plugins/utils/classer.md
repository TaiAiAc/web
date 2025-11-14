# 工具类（classer）：TimedArray 与 HistoryManager

针对需要“时间驱动与历史管理”的场景提供两类轻量工具。

## TimedArray

用于按固定/随机间隔向数组 push 或 pop 元素，适合模拟数据流、心跳包或队列。

### 选项
- `fixedPushValue?: T | (()=>T)`：固定间隔 push 的值（可为函数）
- `enableFixedPop?: boolean`：是否启用固定间隔 pop
- `fixedInterval?: number`：固定操作间隔（ms），默认 `1000`
- `randomIntervalRange?: [number, number]`：随机 push 的间隔范围（ms），默认 `[500, 2000]`
- `randomPushValue: () => T`：随机 push 的值生成函数（必填）

### 示例
```ts
import { TimedArray } from '@quiteer/utils'

/**
 * 函数：创建定时数组
 * 作用：固定每秒 push 一个心跳，随机 0.5~2s 再 push 模拟值
 */
const ta = new TimedArray<number>({
  fixedPushValue: () => 1,
  enableFixedPop: false,
  fixedInterval: 1000,
  randomIntervalRange: [500, 2000],
  randomPushValue: () => Math.floor(Math.random() * 100)
})

/**
 * 函数：监听 push 事件
 * 作用：在 UI 中展示最新值
 */
ta.onPush = (v) => console.log('fixed push:', v)
ta.onRandomPush = (v) => console.log('random push:', v)

/**
 * 函数：启动/停止
 * 作用：管理定时任务生命周期
 */
ta.start()
setTimeout(() => ta.stop(), 5000)

/**
 * 函数：销毁
 * 作用：组件卸载时释放资源
 */
ta.destroy()
```

### 代码参考
- 构造与校验：`packages/utils/src/classer/TimedArray.ts:20`
- 启动定时任务：`packages/utils/src/classer/TimedArray.ts:38`
- 随机 push 调度：`packages/utils/src/classer/TimedArray.ts:65`

## HistoryManager

用于记录值的变化并支持撤回（undo），适合表单、配置面板或画布操作历史。

### 示例
```ts
import { HistoryManager } from '@quiteer/utils'

/**
 * 函数：创建历史管理器
 * 作用：最多保留 20 条历史，支持撤回
 */
const hm = new HistoryManager<string>(20)

/**
 * 函数：记录变化
 * 作用：每次用户输入时入栈
 */
hm.record('a')
hm.record('ab')
hm.record('abc')

/**
 * 函数：撤回两步
 * 作用：返回撤回后的当前值
 */
const afterUndo = hm.undo(2) // => 'a'

/**
 * 函数：获取当前值与时间戳
 * 作用：用于显示“最后变更时间”
 */
hm.getCurrentValue() // => 'a'
hm.getCurrentTimestamp() // => 1650000000000

/**
 * 函数：导出与清空
 * 作用：调试或持久化
 */
console.log(hm.getFullHistory())
hm.clear()
```

### 代码参考
- 记录与截断未来：`packages/utils/src/classer/HistoryManager.ts:21`
- 撤回实现：`packages/utils/src/classer/HistoryManager.ts:45`
- 当前值与时间戳：`packages/utils/src/classer/HistoryManager.ts:60`