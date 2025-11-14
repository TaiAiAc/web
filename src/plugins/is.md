# 类型判断（@quiteer/is）

面向 Web 与通用场景的类型判断集合，按模块组织导出：`type`、`dom`、`color`、`vanilla`、`web`。

## 安装与引入
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

## 模块说明
- `type`：基础类型与结构判断，来源见 `packages/is/src/type.ts`
- `dom`：浏览器 DOM 节点与元素判断，来源见 `packages/is/src/dom.ts`
- `color`：颜色字符串/对象判断，来源见 `packages/is/src/color.ts`
- `vanilla`：通用原生判断（如 `isJSON`），来源见 `packages/is/src/vanilla.ts`
- `web`：浏览器与小程序环境判断，来源见 `packages/is/src/web.ts`

## 使用示例
```ts
import { isString, isEmpty, isHexColor, isRgbColor, isElement, isClient } from '@quiteer/is'

/**
 * 函数：安全读取标题
 * 作用：仅当值为非空字符串时返回其裁剪结果
 */
function readTitle(v: unknown): string {
  if (!isString(v) || isEmpty(v)) return ''
  return (v as string).trim()
}

/**
 * 函数：颜色解析开关
 * 作用：根据输入判断是否为十六进制或 rgb/rgba 颜色
 */
function canParseColor(v: unknown): boolean {
  return isHexColor(v) || isRgbColor(v)
}

/**
 * 函数：图片占位设置
 * 作用：在客户端且目标为图片标签时设置占位图
 */
function setPlaceholder(el: unknown, url: string) {
  if (!isClient()) return
  if (isElement(el) && el instanceof HTMLImageElement) {
    el.src = url
  }
}
```

## 代码参考
- 基础类型判断：`packages/is/src/type.ts:9`
- DOM 判断：`packages/is/src/dom.ts:2`
- 颜色判断：`packages/is/src/color.ts:4`
- Web 环境：`packages/is/src/web.ts:71`
- JSON 判断：`packages/is/src/vanilla.ts:2`