/** @description: 判断是否支持 matchMedia */
export function supportsMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

/** @description: 媒体查询匹配 */
export function matchesMedia(query: string): boolean {
  if (!supportsMatchMedia())
    return false
  try {
    return window.matchMedia(query).matches
  }
  catch {
    return false
  }
}

/** @description: 是否竖屏 */
export function isPortrait(): boolean {
  return matchesMedia('(orientation: portrait)')
}

/** @description: 是否横屏 */
export function isLandscape(): boolean {
  return matchesMedia('(orientation: landscape)')
}

/** @description: 是否偏好深色模式 */
export function prefersColorSchemeDark(): boolean {
  return matchesMedia('(prefers-color-scheme: dark)')
}

/** @description: 是否偏好浅色模式 */
export function prefersColorSchemeLight(): boolean {
  return matchesMedia('(prefers-color-scheme: light)')
}

/** @description: 是否偏好减少动效 */
export function prefersReducedMotion(): boolean {
  return matchesMedia('(prefers-reduced-motion: reduce)')
}

/** @description: 是否高分屏（Retina） */
export function isRetina(): boolean {
  if (matchesMedia('(min-resolution: 2dppx)'))
    return true
  if (typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number')
    return window.devicePixelRatio >= 2
  return false
}

/** @description: 指针是否支持悬停 */
export function isHoverCapable(): boolean {
  return matchesMedia('(hover: hover)')
}

/** @description: 指针是否为粗略类型（触摸） */
export function isPointerCoarse(): boolean {
  return matchesMedia('(pointer: coarse)')
}

/** @description: 是否不小于指定宽度 */
export function isMinWidth(px: number): boolean {
  return matchesMedia(`(min-width: ${px}px)`)
}

/** @description: 是否不大于指定宽度 */
export function isMaxWidth(px: number): boolean {
  return matchesMedia(`(max-width: ${px}px)`)
}

/** @description: 是否处于宽度区间 */
export function isBetweenWidth(min: number, max: number): boolean {
  if (min > max)
    throw new RangeError('min should be less than or equal to max')
  return matchesMedia(`(min-width: ${min}px) and (max-width: ${max}px)`)
}

/** @description: 断点：极小屏（≤639） */
export function isXs(): boolean {
  return isMaxWidth(639)
}

/** @description: 断点：小屏（640-767） */
export function isSm(): boolean {
  return isBetweenWidth(640, 767)
}

/** @description: 断点：中屏（768-1023） */
export function isMd(): boolean {
  return isBetweenWidth(768, 1023)
}

/** @description: 断点：大屏（1024-1279） */
export function isLg(): boolean {
  return isBetweenWidth(1024, 1279)
}

/** @description: 断点：超大屏（≥1280） */
export function isXl(): boolean {
  return isMinWidth(1280)
}
