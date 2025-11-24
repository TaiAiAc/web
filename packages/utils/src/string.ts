/**
 * 首字母大写
 *
 * 将输入字符串的首字符转为大写，其他字符保持不变；输入为空字符串时返回空字符串。
 *
 * @param input - 待转换的字符串
 * @returns 转换后的字符串；若 `input` 为空则返回空字符串
 *
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('') // ''
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function capitalize(input: string): string {
  if (!input)
    return ''
  return input.charAt(0).toUpperCase() + input.slice(1)
}

/**
 * 转为 kebab-case
 *
 * 将驼峰命名或空格分隔的字符串转换为短横线分隔的 `kebab-case` 小写格式。
 *
 * @param input - 输入字符串
 * @returns 转换为 `kebab-case` 的字符串
 *
 * @example
 * ```ts
 * kebabCase('HelloWorld') // 'hello-world'
 * kebabCase('hello world') // 'hello-world'
 * ```
 */
export function kebabCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

/**
 * 转为 snake_case
 *
 * 将驼峰命名或空格分隔的字符串转换为下划线分隔的 `snake_case` 小写格式。
 *
 * @param input - 输入字符串
 * @returns 转换为 `snake_case` 的字符串
 *
 * @example
 * ```ts
 * snakeCase('HelloWorld') // 'hello_world'
 * snakeCase('hello world') // 'hello_world'
 * ```
 */
export function snakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

/**
 * 去除首尾空白
 *
 * 安全移除字符串首尾空白字符，相当于原生 `String.prototype.trim`。
 *
 * @param input - 输入字符串
 * @returns 去除首尾空白后的新字符串
 */
export function trim(input: string): string {
  return input.trim()
}

/**
 * 截断字符串
 *
 * 当字符串长度超出 `maxLength` 时使用 `suffix` 结尾进行截断，默认后缀为 `'...'`。
 *
 * @param input - 输入字符串
 * @param maxLength - 最大长度；应为非负整数
 * @param suffix - 截断后缀；默认 `'...'`
 * @returns 若未超长返回原字符串；超长则返回截断后的字符串
 *
 * @example
 * ```ts
 * truncate('hello world', 5) // 'he...'
 * truncate('hello', 10) // 'hello'
 * ```
 */
export function truncate(input: string, maxLength: number, suffix = '...'): string {
  if (input.length <= maxLength)
    return input
  return input.slice(0, Math.max(0, maxLength - suffix.length)) + suffix
}

/**
 * 判断是否为字符串
 *
 * 判断输入是否为原始字符串类型。
 *
 * @param value - 任意值
 * @returns 当 `typeof value === 'string'` 时返回 `true`
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
