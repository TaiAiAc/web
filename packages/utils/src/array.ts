/**
 * 函数：数组去重
 * 作用：返回不含重复元素的新数组
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 函数：数组分块
 * 作用：将数组按指定大小切分为二维数组
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  if (size <= 0)
    return res
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

/**
 * 函数：扁平化数组
 * 作用：将多维数组拍平为一维（深度 1 或指定深度）
 */
export function flatten<T>(arr: (T | T[])[], depth = 1): T[] {
  return depth > 0 ? arr.reduce<T[]>((acc, v) => acc.concat(v as any), []) : (arr as T[])
}

/**
 * 函数：分组数组
 * 作用：按键函数返回值对数组进行分组
 */
export function groupBy<T, K extends PropertyKey>(arr: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    ;(acc[key] ||= []).push(item)
    return acc
  }, {} as Record<K, T[]>)
}

/**
 * 函数：数组分隔
 * 作用：根据谓词将数组划分为命中与未命中两部分
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const a: T[] = []
  const b: T[] = []
  for (const item of arr) (predicate(item) ? a : b).push(item)
  return [a, b]
}
