# @quiteer/utils
> 零依赖、原生 TypeScript/JavaScript 实现的常用工具集合，按模块组织导出：`string`、`number`、`array`、`object`、`function`、`random`、`time`、`type-utils`。
> [文档](https://quiteerjs.github.io/web/plugins/utils)

## 安装

- 使用 `pnpm` 安装：

```bash
pnpm add @quiteer/utils
```

## 使用

- 按需引入（支持 Tree-Shaking）：

```ts
import {
  // 字符串
  capitalize, kebabCase, snakeCase, trim, truncate, isString,
  // 数字与区间
  clamp, inRange,
  // 数组
  unique, chunk, flatten, groupBy, partition,
  // 对象
  isObject, isPlainObject, isEmpty, deepClone, deepMerge, pick, omit, get, set,
  // 函数
  debounce, throttle, once, assert,
  // 随机/时间
  randomInt, randomColor, randomLetter, formatTimestamp,
} from '@quiteer/utils'
```

- 简单示例：

```ts
// 规范化标题
const title = capitalize('hello world') // 'Hello world'

// 范围裁剪
const percent = clamp(128, 0, 100) // 100

// 分组用户
const users = [
  { name: 'A', role: 'admin' },
  { name: 'B', role: 'user' },
  { name: 'C', role: 'admin' }
]
const grouped = groupBy(users, u => u.role)
// grouped.admin => [{name:'A',...},{name:'C',...}]

// 深合并配置
const defaultCfg = { a: 1, list: [1], nested: { x: 1 } }
const userCfg = { b: 2, list: [2], nested: { y: 2 } }
const cfg = deepMerge(defaultCfg, userCfg)
// => { a:1, b:2, list:[1,2], nested:{ x:1, y:2 } }

// 防抖
const handleInput = debounce((v: string) => {
  console.info('input:', v)
}, 300)

// 随机与时间
const dice = randomInt(1, 6)
const color = randomColor()
const timestamp = formatTimestamp(new Date())
```


