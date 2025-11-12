# @quiteer/utils 工具库

本库提供零依赖、使用原生 TypeScript/JavaScript 实现的常用工具函数与类型工具，按模块拆分并由入口聚合导出。

## 模块概览
- 字符串：`capitalize`、`kebabCase`、`snakeCase`、`trim`、`truncate`、`isString`
- 数字：`isNumber`、`clamp`、`inRange`、`randomInt`
- 数组：`isArray`、`unique`、`chunk`、`flatten`、`groupBy`、`partition`
- 对象：`isObject`、`isPlainObject`、`isEmpty`、`deepClone`、`deepMerge`、`pick`、`omit`、`get`、`set`
- 函数：`isBoolean`、`isFunction`、`debounce`、`throttle`、`once`、`assert`
- Promise：`sleep`、`withTimeout`、`retry`，以及 `Result`、`ok`、`err`
- 类型工具：`DeepPartial`、`DeepRequired`、`RequiredKeys`、`OptionalKeys`、`ValueOf`、`UnionToIntersection`、`ReadonlyDeep`、`Mutable`、`Exact` 等

## 安装与引入
```ts
// 函数：安装
// 作用：在工作区根目录执行安装依赖
// pnpm
// pnpm install

// 函数：聚合导入
// 作用：从入口一次性获取常用工具
import {
  capitalize,
  clamp,
  debounce,
  deepMerge,
  DeepPartial,
  err,
  groupBy,
  ok,
  retry,
  sleep
} from '@quiteer/utils'
```

## 快速示例
```ts
// 函数：字符串处理
// 作用：将标题规范化
const title = capitalize('hello world') // => 'Hello world'

// 函数：数值裁剪
// 作用：限制范围到 [0, 100]
const percent = clamp(128, 0, 100) // => 100

// 函数：数组分组
// 作用：按角色对用户分组
const users = [
  { name: 'A', role: 'admin' },
  { name: 'B', role: 'user' },
  { name: 'C', role: 'admin' }
]
const grouped = groupBy(users, u => u.role)
// grouped.admin => [{name:'A',...},{name:'C',...}]

// 函数：对象深合并
// 作用：合并默认配置与用户配置
const defaultCfg = { a: 1, list: [1], nested: { x: 1 } }
const userCfg = { b: 2, list: [2], nested: { y: 2 } }
const cfg = deepMerge(defaultCfg, userCfg)
// => { a:1, b:2, list:[1,2], nested:{ x:1, y:2 } }

// 函数：防抖
// 作用：输入结束 300ms 后再执行处理
const handleInput = debounce((v: string) => {
  console.info('input:', v)
}, 300)

// 函数：睡眠与重试
// 作用：失败时重试 3 次，每次间隔 500ms
await retry(async () => {
  await sleep(500)
  // ...执行任务
  return 42
}, 3, 500)

// 类型：DeepPartial
// 作用：对配置进行增量更新
interface Config { a: number, nested: { x: number, y: number } }
const patch: DeepPartial<Config> = { nested: { y: 2 } }

// 结果类型：Result / ok / err
// 作用：统一返回结构，便于错误分支处理
function parse(v: string) {
  if (!v) {
    return err(new Error('empty'))
  }
  return ok(Number(v))
}
```

更多 API 详见左侧各模块文档。
<!-- eof -->
