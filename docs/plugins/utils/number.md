# 数字工具 (Number Utils)

提供了基础的数值处理工具，用于处理数值范围限制和区间判断，简化边界条件的逻辑编写。

## 为什么使用

在处理用户输入（如表单年龄、数量）、UI 交互（如滑块、进度条）时，经常需要对数值进行合法性校验或强制修正。手动编写 `Math.min/max` 组合或 `if` 判断不仅繁琐，而且容易出错。

## 优点

- **边界安全**：`clamp` 确保数值永远不会越界。
- **智能区间**：`inRange` 自动处理起始值和结束值的大小关系（无需关心 `start < end`）。
- **语义清晰**：相比原生的 `if (x >= min && x < max)`，使用 `inRange` 代码意图更明确。

## 使用场景

1. **表单修正**：限制用户输入的百分比在 0-100 之间（`clamp`）。
2. **进度条控制**：确保计算出的进度值不小于 0 且不大于总长度（`clamp`）。
3. **命中检测**：判断鼠标点击位置是否在某个区域内（`inRange`）。
4. **数据过滤**：筛选出价格在指定区间内的商品（`inRange`）。

## 使用方式

### 导入

```ts
import { clamp, inRange } from '@quiteer/utils'
```

### 代码示例

```ts
// 1. 范围限制（场景：透明度设置）
const opacity = 1.5
const safeOpacity = clamp(opacity, 0, 1) // => 1

// 2. 区间判断（场景：判断成绩等级）
const score = 85
if (inRange(score, 60, 100)) {
  console.log('Pass')
}

// 3. 智能区间（无需关心参数顺序）
inRange(5, 10, 0) // => true (自动处理为 [0, 10))
```

## API 列表

### `clamp(n: number, min: number, max: number): number`
限制数值范围。将数值限制在闭区间 `[min, max]` 内。
- **n**: 待限制的数值。
- **min**: 下界。
- **max**: 上界。
- **Returns**: 若 `n < min` 返回 `min`；若 `n > max` 返回 `max`；否则返回 `n`。

### `inRange(n: number, start: number, end: number): boolean`
是否在范围内。判断数值是否落在半开区间 `[start, end)` 内（包含 start，不包含 end）。
- **start**: 起始边界。
- **end**: 结束边界。
- **Note**: 内部会自动处理 `start` 和 `end` 的大小关系，取较小值为下界，较大值为上界。
