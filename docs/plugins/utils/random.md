# 随机工具 (Random Utils)

提供了生成随机数、随机颜色和随机字母的基础工具，常用于模拟数据、UI 占位或简单的游戏逻辑。

## 为什么使用

在前端开发中，我们经常需要生成“假数据”来填充页面，或者在 Canvas/动画中生成随机属性。手动实现随机逻辑（如 `Math.floor(Math.random() * n)`）容易写错边界条件。本模块封装了最常用的随机生成器。

## 优点

- **简单易用**：`randomInt` 自动处理边界取整，确保包含最大值和最小值。
- **零依赖**：纯原生实现，无需引入 heavy 的 mock 库。

## 使用场景

1. **模拟数据**：生成随机价格、库存数量或状态码（`randomInt`）。
2. **UI 占位**：为头像或卡片生成随机背景色（`randomColor`）。
3. **验证码生成**：生成随机字母组合（`randomLetter`）。

## 使用方式

### 导入

```ts
import { randomColor, randomInt, randomLetter } from '@quiteer/utils'
```

### 代码示例

```ts
// 1. 随机整数（场景：模拟掷骰子）
const dice = randomInt(1, 6) // => 1, 2, 3, 4, 5, 6

// 2. 随机颜色（场景：生成标签背景色）
const tagColor = randomColor() // => '#3f8a12'

// 3. 随机字母（场景：生成简单验证码）
const code = Array.from({ length: 4 }, () => randomLetter()).join('')
// => 'aBcd'
```

## API 列表

### `randomInt(min: number, max: number): number`
生成随机整数。
- **Range**: 闭区间 `[min, max]`（包含 min 和 max）。
- **Impl**: `Math.floor(Math.random() * (max - min + 1)) + min`。

### `randomColor(): string`
生成随机颜色。
- **Returns**: 十六进制颜色字符串（如 `#1a2b3c`）。

### `randomLetter(): string`
生成随机字母。
- **Returns**: 单个英文字母（`a-z` 或 `A-Z`）。
