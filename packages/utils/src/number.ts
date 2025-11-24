/**
 * 限制数值范围
 *
 * 将输入数值限制在闭区间 `[min, max]` 内，常用于滑块、分页等边界控制。
 *
 * @param n - 待限制的数值
 * @param min - 下界；建议 `min <= max`
 * @param max - 上界；建议 `max >= min`
 * @returns 若 `n < min` 返回 `min`；若 `n > max` 返回 `max`；否则返回 `n`
 *
 * @example
 * ```ts
 * clamp(10, 0, 5) // 5
 * clamp(-1, 0, 5) // 0
 * clamp(3, 0, 5) // 3
 * ```
 *
 * @remarks
 * - 当 `min > max` 时行为为将 `n` 限制在逻辑错误边界内，返回值可能不符合预期
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/**
 * 是否在范围内
 *
 * 判断数值是否落在半开区间 `[start, end)` 内；支持 `start > end` 的输入，内部将边界规范化。
 *
 * @param n - 待判断的数值
 * @param start - 起始边界（包含）
 * @param end - 结束边界（不包含）
 * @returns 当 `n >= min(start,end)` 且 `n < max(start,end)` 时返回 `true`
 *
 * @example
 * ```ts
 * inRange(3, 1, 5) // true
 * inRange(5, 1, 5) // false
 * inRange(3, 5, 1) // true（会规范化为 [1,5)）
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function inRange(n: number, start: number, end: number): boolean {
  const s = Math.min(start, end)
  const e = Math.max(start, end)
  return n >= s && n < e
}
