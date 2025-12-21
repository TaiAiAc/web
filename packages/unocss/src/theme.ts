import type { PresetUnoTheme } from 'unocss'

export const theme: PresetUnoTheme = {
  // naive-ui 颜色系统
  colors: {
    primary: 'var(--n-primary-color, #18a058)',
    primaryHover: 'var(--n-primary-color-hover, #36ad6a)',
    primaryPressed: 'var(--n-primary-color-pressed, #0c7a43)',
    primarySuppl: 'var(--n-primary-color-suppl, #36ad6a)',

    info: 'var(--n-info-color, #2080f0)',
    infoHover: 'var(--n-info-color-hover, #4098fc)',
    infoPressed: 'var(--n-info-color-pressed, #1060c9)',
    infoSuppl: 'var(--n-info-color-suppl, #4098fc)',

    success: 'var(--n-success-color, #18a058)',
    successHover: 'var(--n-success-color-hover, #36ad6a)',
    successPressed: 'var(--n-success-color-pressed, #0c7a43)',
    successSuppl: 'var(--n-success-color-suppl, #36ad6a)',

    warning: 'var(--n-warning-color, #f0a020)',
    warningHover: 'var(--n-warning-color-hover, #fcb040)',
    warningPressed: 'var(--n-warning-color-pressed, #c97c10)',
    warningSuppl: 'var(--n-warning-color-suppl, #fcb040)',

    error: 'var(--n-error-color, #d03050)',
    errorHover: 'var(--n-error-color-hover, #de576d)',
    errorPressed: 'var(--n-error-color-pressed, #ab1f3f)',
    errorSuppl: 'var(--n-error-color-suppl, #de576d)'
  },
  // 字体族
  fontFamily: {
    sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    mono: `'Fira Code', 'Courier New', monospace`
  },
  borderRadius: {
    DEFAULT: 'var(--n-border-radius, 6px)',
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px'
  },
  boxShadow: {
    DEFAULT: 'var(--n-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.1))',
    card: 'var(--n-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.08))',
    popover: 'var(--n-popover-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.15))'
  }
}
