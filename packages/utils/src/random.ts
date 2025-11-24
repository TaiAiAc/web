/**
 * 生成随机整数
 *
 * 在闭区间 `[min, max]` 内生成一个随机整数，使用 `Math.random()` 与向下取整实现。
 *
 * @param min - 最小值（包含）；将向上取整
 * @param max - 最大值（包含）；将向下取整
 * @returns 随机整数，满足 `min <= n <= max`
 *
 * @example
 * ```ts
 * randomInt(1, 3) // 1, 2 或 3
 * ```
 *
 * @remarks
 * - 当 `min > max` 时结果不确定；请先规范化边界
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机颜色（十六进制）
 *
 * 生成一个 `#RRGGBB` 格式的随机颜色字符串。
 *
 * @returns 随机颜色字符串，如 `#1a2b3c`
 *
 * @example
 * ```ts
 * randomColor() // '#a1b2c3'
 * ```
 */
export function randomColor(): string {
  const r = randomInt(0, 255)
  const g = randomInt(0, 255)
  const b = randomInt(0, 255)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * 生成随机字母
 *
 * 生成一个随机的英文字母（包含大写与小写）。
 *
 * @returns 单个字母字符
 *
 * @example
 * ```ts
 * randomLetter() // 'A' | 'b' | ...
 * ```
 */
export function randomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return letters[randomInt(0, letters.length - 1)]
}
