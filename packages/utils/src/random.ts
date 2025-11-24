// 返回一个随机整数，范围为 [min, max]
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 作用：返回随机的十六进制颜色字符串，格式为 '#RRGGBB'
export function randomColor(): string {
  const r = randomInt(0, 255)
  const g = randomInt(0, 255)
  const b = randomInt(0, 255)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// 返回一个随机的字母（大写或小写）
export function randomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return letters[randomInt(0, letters.length - 1)]
}
