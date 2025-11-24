/**
 * 判断是否为对象（非 null）
 *
 * 判断输入是否为 `object` 且不为 `null`，适用于基本对象与数组、日期等引用类型。
 *
 * @param value - 任意值
 * @returns 当 `value !== null && typeof value === 'object'` 时返回 `true`
 */
export function isObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object'
}

/**
 * 判断是否为普通对象
 *
 * 用于区分数组、日期等特殊引用类型，确保对象原型为 `Object.prototype` 或 `null`。
 *
 * @param value - 任意值
 * @returns 当对象的原型为 `Object.prototype` 或 `null` 时返回 `true`
 *
 * @example
 * ```ts
 * isPlainObject({ a: 1 }) // true
 * isPlainObject(new Date()) // false
 * isPlainObject([]) // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
  if (!isObject(value))
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 判断值是否为空
 *
 * 将 `null/undefined`、空字符串（去除空白后）、空数组、无自有属性的普通对象视为“空”。
 *
 * @param value - 任意值
 * @returns 为空返回 `true`，否则返回 `false`
 */
export function isEmpty(value: unknown): boolean {
  if (value == null)
    return true
  if (typeof value === 'string')
    return value.trim().length === 0
  if (Array.isArray(value))
    return value.length === 0
  if (isPlainObject(value))
    return Object.keys(value).length === 0
  return false
}

/**
 * 深拷贝对象
 *
 * 优先使用原生 `structuredClone` 拷贝复杂结构；在不支持时回退为递归拷贝（处理数组与普通对象）。
 *
 * @param value - 任意可拷贝的值
 * @returns 新拷贝的值；与输入解耦
 *
 * @throws {DOMException} 在部分环境下 `structuredClone` 可能抛出不支持的错误
 *
 * @remarks
 * - 回退实现不处理循环引用与 `Map/Set/Date` 等特殊对象；必要时自行扩展
 *
 * @security
 * 深拷贝将打断与源对象的引用关系；确认安全需求后再使用浅/深拷贝
 */
export function deepClone<T>(value: T): T {
  if (typeof (globalThis as any).structuredClone === 'function')
    return (globalThis as any).structuredClone(value)
  if (!isObject(value))
    return value as any
  if (Array.isArray(value))
    return value.map(v => deepClone(v)) as any
  const out: Record<string, any> = {}
  for (const k of Object.keys(value as Record<string, any>)) out[k] = deepClone((value as any)[k])
  return out as T
}

/**
 * 深合并对象
 *
 * 将多个对象深度合并为新对象：普通对象执行递归合并、数组采用拼接、基本类型后写覆盖。
 *
 * @param sources - 待合并的对象列表
 * @returns 合并后的新对象
 *
 * @example
 * ```ts
 * deepMerge({a:1, b:{c:1}}, {b:{d:2}}) // { a:1, b:{ c:1, d:2 } }
 * ```
 */
export function deepMerge<T extends Record<string, any>>(...sources: T[]): T {
  const result: Record<string, any> = {}
  for (const src of sources) {
    for (const key of Object.keys(src || {})) {
      const v = src[key]
      if (isPlainObject(v))
        result[key] = deepMerge(result[key] || {}, v)
      else if (Array.isArray(v))
        result[key] = [...(result[key] || []), ...v]
      else result[key] = v
    }
  }
  return result as T
}

/**
 * 挑选对象属性
 *
 * 返回仅包含指定键的新对象；不存在的键将被忽略。
 *
 * @param obj - 源对象
 * @param keys - 需要保留的键列表
 * @returns 仅包含指定键的新对象
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const k of keys) {
    if (k in obj)
      (out as any)[k] = obj[k]
  }
  return out
}

/**
 * 排除对象属性
 *
 * 返回排除指定键的新对象；其余键保持不变。
 *
 * @param obj - 源对象
 * @param keys - 需要排除的键列表
 * @returns 排除指定键的新对象
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const out = { ...obj }
  for (const k of keys) delete (out as any)[k]
  return out
}

/**
 * 通过路径读取对象值
 *
 * 支持 `a.b[0].c` 风格路径读取；当路径中断或不存在时返回 `defaultValue`。
 *
 * @param obj - 源对象
 * @param path - 路径字符串，支持 `[]` 下标与 `.` 链式访问
 * @param defaultValue - 未命中时的默认值
 * @returns 读取到的值或默认值
 *
 * @example
 * ```ts
 * get({a:{b:[{c:1}]}},'a.b[0].c') // 1
 * get({}, 'x.y', 0) // 0
 * ```
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
  let cur = obj
  for (const t of tokens) {
    if (cur == null)
      return defaultValue
    cur = cur[t]
  }
  return cur ?? defaultValue
}

/**
 * 通过路径设置对象值
 *
 * 支持 `a.b[0].c` 风格路径写入；当中间路径不存在时自动创建对象或数组。
 *
 * @param obj - 目标对象
 * @param path - 路径字符串，支持 `[]` 下标与 `.` 链式访问
 * @param value - 需要写入的值
 * @returns 返回原对象的引用（已被修改）
 *
 * @example
 * ```ts
 * const o: any = {}
 * set(o, 'a.b[0].c', 1) // o => { a: { b: [ { c: 1 } ] } }
 * ```
 */
export function set(obj: any, path: string, value: any): any {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
  let cur = obj
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (i === tokens.length - 1) {
      cur[t] = value
    }
    else {
      if (cur[t] == null)
        cur[t] = Number.isInteger(Number(tokens[i + 1])) ? [] : {}
      cur = cur[t]
    }
  }
  return obj
}
