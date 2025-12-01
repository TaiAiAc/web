# @quiteer/is
> 面向 Web 与通用场景的类型判断集合，按模块组织导出：`type`、`dom`、`color`、`url`、`vanilla`、`web`。
> [文档](https://quiteerjs.github.io/web/plugins/is.html)


## 安装

- 使用 `pnpm` 安装：

```bash
pnpm add @quiteer/is
```

## 使用

- 按需引入常用判断方法（支持 Tree-Shaking）：

```ts
import {
  // 基础类型
  isString, isNumber, isBoolean, isFunction, isArray, isObject, isDef, isUnDef,
  isNull, isNullOrUnDef, isEmpty, isPromise, isDate, isRegExp,
  // DOM
  isElement, isTextNode, isComment, isNode, isNodeList, isImageElement,
  // 颜色
  isHexColor, isRgbColor, isRgbaColor, isColorName, isColorString,
  // 原生
  isJSON,
  // Web 环境
  isClient, isWindow, isMobileBrowser, isChromeBrowser
} from '@quiteer/is'
```

- 简单示例：

```ts
import { isString, isEmpty, isHexColor, isElement, isClient } from '@quiteer/is'

function readTitle(v: unknown): string {
  if (!isString(v) || isEmpty(v)) return ''
  return (v as string).trim()
}

function isValidColor(v: unknown): boolean {
  return isHexColor(v)
}

function setPlaceholder(el: unknown, url: string) {
  if (!isClient()) return
  if (isElement(el) && el instanceof HTMLImageElement) {
    el.src = url
  }
}
```
