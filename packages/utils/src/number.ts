/**
 * 函数：限制数值范围
 * 作用：将数值限制在 [min, max] 区间
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/**
 * 函数：是否在范围内
 * 作用：判断数值是否落在半开半闭区间 [start, end)
 */
export function inRange(n: number, start: number, end: number): boolean {
  const s = Math.min(start, end)
  const e = Math.max(start, end)
  return n >= s && n < e
}
