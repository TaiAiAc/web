/** @description: 是否为 JSON 字符串 */
export function isJSON(val: unknown): val is string {
  try {
    JSON.parse(val as string)
    return true
  }
  catch (_) {
    return false
  }
}

/** @description: 是否为 Base64 字符串 */
export function isBase64(val: unknown): val is string {
  try {
    btoa(atob(val as string))
    return true
  }
  catch (_) {
    return false
  }
}
