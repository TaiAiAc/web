// 判断是否是标签元素
export function isElement(el: unknown): el is HTMLElement {
  return el instanceof HTMLElement
}

export function isTagElement(el: unknown): el is HTMLElement {
  return isElement(el) && el.tagName !== undefined
}

// 判断是否是注释
export function isComment(el: unknown): el is Comment {
  return el instanceof Comment
}

// 判断是否是文本节点
export function isTextNode(el: unknown): el is Text {
  return el instanceof Text
}

// 判断是否是元素节点
export function isElementNode(el: unknown): el is HTMLElement {
  return isTagElement(el) || isComment(el) || isTextNode(el)
}

// 判断是否是文档节点
export function isDocumentNode(el: unknown): el is Document {
  return el instanceof Document
}

// 判断是否是文档片段节点
export function isDocumentFragmentNode(el: unknown): el is DocumentFragment {
  return el instanceof DocumentFragment
}

// 判断是否是节点
export function isNode(el: unknown): el is Node {
  return isElementNode(el) || isDocumentNode(el) || isDocumentFragmentNode(el)
}

// 判断是否是节点列表
export function isNodeList(el: unknown): el is NodeList {
  return el instanceof NodeList
}

// 判断是否是元素节点列表
export function isElementNodeList(el: unknown): el is NodeListOf<HTMLElement> {
  return isNodeList(el) && Array.from(el).every(isElementNode)
}

// 是否是多媒体元素
export function isMediaElement(el: unknown): el is HTMLMediaElement {
  return el instanceof HTMLMediaElement
}

// 是否图片标签
export function isImageElement(el: unknown): el is HTMLImageElement {
  return el instanceof HTMLImageElement
}

// 是否音频标签
export function isAudioElement(el: unknown): el is HTMLAudioElement {
  return el instanceof HTMLAudioElement
}

// 是否视频标签
export function isVideoElement(el: unknown): el is HTMLVideoElement {
  return el instanceof HTMLVideoElement
}

// 是否画布
export function isCanvasElement(el: unknown): el is HTMLCanvasElement {
  return el instanceof HTMLCanvasElement
}

// 是否svg元素
export function isSvgElement(el: unknown): el is SVGElement {
  return el instanceof SVGElement
}
