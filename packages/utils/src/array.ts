/**
 * 数组去重
 *
 * 使用 `Set` 进行去重，保持元素的原始出现顺序，适用于可比较的原始类型或引用相等的对象。
 *
 * @param arr - 需要去重的数组；当元素为对象时基于引用地址判断相等
 * @returns 返回不含重复元素的新数组；长度小于等于输入数组长度
 * @throws {TypeError} 当传入的 `arr` 不是数组时可能在调用方触发类型错误
 *
 * @example
 * ```ts
 * unique([1, 1, 2, 3]) // [1, 2, 3]
 * const o = {}; unique([o, o, {}]).length // 2（对象按引用相等去重）
 * ```
 *
 * @remarks
 * - 对象与数组等复杂类型基于引用相等；深度相等请结合序列化或哈希策略
 * - 去重后返回新数组，不会修改原数组
 *
 * @security
 * 输入包含敏感可变对象时，去重后仍共享引用；谨慎修改返回数组中的对象
 *
 * @performance
 * 时间复杂度 O(n)，空间复杂度 O(n)
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 数组分块
 *
 * 将输入数组按指定 `size` 划分为多个子数组；当 `size <= 0` 时返回空数组。
 *
 * @param arr - 需要分块的数组
 * @param size - 每个分块的最大元素数量；必须为正整数
 * @returns 返回二维数组，每个子数组长度不超过 `size`
 *
 * @example
 * ```ts
 * chunk([1,2,3,4,5], 2) // [[1,2],[3,4],[5]]
 * chunk([1,2], 0) // []
 * ```
 *
 * @remarks
 * - 最后一个分块可能长度小于 `size`
 * - 不修改原数组，返回新数组
 *
 * @performance
 * 时间复杂度 O(n)，空间复杂度 O(n)
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  if (size <= 0)
    return res
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

/**
 * 扁平化数组
 *
 * 将二维或多维数组拍平为一维；当前实现在 `depth > 0` 时拍平一层（浅扁平）。
 *
 * @param arr - 由元素或子数组组成的数组
 * @param depth - 扁平化深度；当前实现当 `depth > 0` 时拍平一层
 * @returns 返回拍平后的新数组
 *
 * @example
 * ```ts
 * flatten([1,[2,3]]) // [1,2,3]
 * flatten([1,[2,[3]]], 0) // 原样返回
 * ```
 *
 * @remarks
 * - 若需要多层深度扁平，可迭代调用或使用原生 `Array.prototype.flat`
 * - 不修改原数组
 *
 * @performance
 * 时间复杂度 O(n)，空间复杂度 O(n)
 */
export function flatten<T>(arr: (T | T[])[], depth = 1): T[] {
  return depth > 0 ? arr.reduce<T[]>((acc, v) => acc.concat(v as any), []) : (arr as T[])
}

/**
 * 分组数组
 *
 * 基于 `keyFn` 的返回值对数组元素进行分组，生成键到元素列表的映射。
 *
 * @param arr - 需要分组的数组
 * @param keyFn - 键生成函数；对每个元素调用并返回分组键
 * @returns 以分组键为属性名、对应元素数组为值的对象映射
 *
 * @example
 * ```ts
 * groupBy(['a','aa','b'], s => s.length) // { 1: ['a','b'], 2: ['aa'] }
 * ```
 *
 * @remarks
 * - 返回对象的键为 `PropertyKey`（string/number/symbol）
 * - 不修改原数组
 *
 * @performance
 * 时间复杂度 O(n)，空间复杂度 O(n)
 */
export function groupBy<T, K extends PropertyKey>(arr: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    ;(acc[key] ||= []).push(item)
    return acc
  }, {} as Record<K, T[]>)
}

/**
 * 数组分隔
 *
 * 根据 `predicate` 将数组划分为两部分：命中（满足条件）与未命中（不满足条件）。
 *
 * @param arr - 输入数组
 * @param predicate - 谓词函数；返回 `true` 的元素划入第一部分
 * @returns 二元组 `[命中数组, 未命中数组]`
 *
 * @example
 * ```ts
 * partition([1,2,3,4], x => x % 2 === 0) // [[2,4],[1,3]]
 * ```
 *
 * @remarks
 * - 不修改原数组，返回两个新数组
 *
 * @performance
 * 时间复杂度 O(n)，空间复杂度 O(n)
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const a: T[] = []
  const b: T[] = []
  for (const item of arr) (predicate(item) ? a : b).push(item)
  return [a, b]
}
