# 类型判断（@quiteer/is）

面向 Web 与通用场景的类型判断集合，按模块组织导出：`type`、`dom`、`color`、`vanilla`、`web`。

## 为什么使用

在 JavaScript 开发中，准确判断数据类型和运行环境是基础且频繁的需求。原生的 `typeof`、`instanceof` 和 `Object.prototype.toString` 使用繁琐且容易出错。`@quiteer/is` 提供了一套统一、标准且经过充分测试的判断函数，旨在提升代码的健壮性和可读性。

## 优点

- **全面覆盖**：涵盖基础类型、DOM 节点、颜色格式、URL 类型、浏览器/运行环境等全方位判断。
- **类型安全**：所有函数均实现 TypeScript 类型守卫（Type Guard），在判断为真后自动缩窄变量类型。
- **模块化设计**：按功能拆分模块，支持 Tree-shaking，按需引用。
- **轻量高效**：零第三方依赖，基于原生 API 封装。

## 使用场景

1. **参数防御性编程**：在工具函数或组件 props 中校验输入值是否符合预期。
2. **跨端兼容处理**：根据 `isMobileBrowser`、`isIOSBrowser` 等判断环境，抹平差异。
3. **DOM 交互逻辑**：在指令或复杂组件中准确识别 `Element`、`TextNode` 或 `Comment`。
4. **数据清洗**：验证接口返回的颜色、URL 或 JSON 字符串格式。

## 使用方式

### 安装与引入

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

### 模块说明

- `type`：基础类型与结构判断，来源见 `packages/is/src/type.ts`
- `dom`：浏览器 DOM 节点与元素判断，来源见 `packages/is/src/dom.ts`
- `color`：颜色字符串/对象判断，来源见 `packages/is/src/color.ts`
- `vanilla`：通用原生判断（如 `isJSON`），来源见 `packages/is/src/vanilla.ts`
- `web`：浏览器与小程序环境判断，来源见 `packages/is/src/web.ts`

### 代码示例

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

## API 列表

### type
- `is` - 判断值是否为指定类型（基于 `Object.prototype.toString`）
- `isString` - 是否为字符串
- `isNumber` - 是否为数值
- `isBoolean` - 是否为布尔类型
- `isFunction` - 是否为函数（含 `AsyncFunction`）
- `isObject` - 是否为非 `null` 的对象
- `isArray` - 是否为数组
- `isDef` - 是否已定义（非 `undefined`）
- `isUnDef` - 是否未定义（`undefined`）
- `isNull` - 是否为 `null`
- `isNullOrUnDef` - 是否为 `null` 或 `undefined`
- `isNullAndUnDef` - 是否同时为 `null` 与 `undefined` (注意：逻辑上不可能同时满足，始终返回 false)
- `isEmpty` - 是否为空数据（空串、空数组、`null`、`0`）
- `isSymbol` - 是否为 `Symbol`
- `isPromise` - 是否为 `Promise`（且存在 `then/catch`）
- `isAsyncFunction` - 是否为 `AsyncFunction`
- `isMap` - 是否为 `Map` 对象
- `isSet` - 是否为 `Set` 对象
- `isWeakMap` - 是否为 `WeakMap` 对象
- `isWeakSet` - 是否为 `WeakSet` 对象
- `isRegExp` - 是否为正则表达式
- `isDate` - 是否为日期对象
- `isProxy` - 是否为 `Proxy` 对象

### dom
- `isElement` - 是否为 `HTMLElement`
- `isTagElement` - 是否为标签元素（含 `tagName`）
- `isComment` - 是否为注释节点 `Comment`
- `isTextNode` - 是否为文本节点 `Text`
- `isElementNode` - 是否为元素型节点（元素/注释/文本之一）
- `isDocumentNode` - 是否为文档节点 `Document`
- `isDocumentFragmentNode` - 是否为文档片段 `DocumentFragment`
- `isNode` - 是否为任意节点 `Node`
- `isNodeList` - 是否为节点列表 `NodeList`
- `isElementNodeList` - 是否为元素节点列表（每项均为元素）
- `isMediaElement` - 是否为多媒体元素 `HTMLMediaElement`
- `isImageElement` - 是否为图片元素 `HTMLImageElement`
- `isAudioElement` - 是否为音频元素 `HTMLAudioElement`
- `isVideoElement` - 是否为视频元素 `HTMLVideoElement`
- `isCanvasElement` - 是否为画布元素 `HTMLCanvasElement`
- `isSvgElement` - 是否为 `SVGElement`

### color
- `isHexColor` - 是否为十六进制颜色（`#RGB`/`#RRGGBB`）
- `isRgbColor` - 是否为 `rgb(...)` 颜色（通道 0-255 或百分比）
- `isRgbaColor` - 是否为 `rgba(...)` 颜色（含透明度 0-1）
- `isColorName` - 是否为颜色名称（仅检查是否为纯字母字符串）
- `isColorString` - 是否为颜色字符串（任一颜色格式）
- `isColorObject` - 是否为颜色对象 `{ red, green, blue, alpha }`
- `isColor` - 是否为颜色（字符串或名称）

### url
- `isUrlString` - 是否为可解析的 URL 字符串（`new URL`）
- `isHttpUrl` - 是否为 `http:` 链接
- `isHttpsUrl` - 是否为 `https:` 链接
- `isWebsocketUrl` - 是否为 `ws:`/`wss:` 链接
- `isImageUrl` - 是否为图片链接（常见图片后缀）
- `isVideoUrl` - 是否为视频链接（常见视频后缀）
- `isFileUrl` - 是否为文件链接（`file:` 或常见可下载后缀）

### vanilla
- `isJSON` - 是否为可被 `JSON.parse` 解析的字符串

### web
- `isWebkitBrowser` - 是否为 WebKit 内核浏览器
- `isMobileBrowser` - 是否为移动端浏览器
- `isChromeBrowser` - 是否为 Chrome 浏览器
- `isFirefoxBrowser` - 是否为 Firefox 浏览器
- `isSafariBrowser` - 是否为 Safari 浏览器
- `isOperaBrowser` - 是否为 Opera 浏览器
- `isEdgeBrowser` - 是否为 Edge 浏览器
- `isIEBrowser` - 是否为 IE 浏览器
- `isMacBrowser` - 是否为 macOS 系统
- `isWindowsBrowser` - 是否为 Windows 系统
- `isLinuxBrowser` - 是否为 Linux 系统
- `isAndroidBrowser` - 是否为 Android 系统
- `isIOSBrowser` - 是否为 iOS 系统
- `isClient` - 是否在浏览器环境（`window` 存在）
- `isWindow` - 是否为 `Window` 对象
- `isWechatMiniProgram` - 是否为微信小程序环境
- `isAlipayMiniProgram` - 是否为支付宝小程序环境
- `isBaiduMiniProgram` - 是否为百度小程序环境
- `isByteDanceMiniProgram` - 是否为字节跳动小程序环境
- `isQQMiniProgram` - 是否为 QQ 小程序环境
