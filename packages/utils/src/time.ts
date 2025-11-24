/**
 * 格式化时间戳
 *
 * 将 `Date` 转换为 `YYYY-MM-DD HH:mm:ss` 格式的本地时间字符串。
 *
 * @param d - 时间对象；使用本地时区
 * @returns 格式化后的时间字符串，例如 `2025-11-24 17:20:00`
 *
 * @example
 * ```ts
 * formatTimestamp(new Date(0)) // '1970-01-01 08:00:00'（取决于本地时区）
 * ```
 *
 * @remarks
 * - 采用本地时区；如需 UTC 请自行转换
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function formatTimestamp(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const h = pad(d.getHours())
  const min = pad(d.getMinutes())
  const s = pad(d.getSeconds())
  return `${y}-${m}-${day} ${h}:${min}:${s}`
}
