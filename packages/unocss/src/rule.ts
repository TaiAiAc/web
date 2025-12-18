import type { Rule } from 'unocss'

const baseRules: Rule[] = [
  [/^wh-(\d+)$/, ([, d]) => ({ width: `${Number(d) / 4}rem`, height: `${Number(d) / 4}rem` })]
]

export const buttonRules: Rule[] = [
  [/^btn-(primary|secondary)$/, ([_, variant]) => {
    const colors: Record<string, string> = {
      primary: '#3b82f6',
      secondary: '#6366f1'
    }
    return {
      'background-color': colors[variant],
      'color': 'white',
      'padding': '0.5rem 1rem',
      'border-radius': '0.25rem',
      'font-weight': '500'
    }
  }, { layer: 'components' }]
]

export const cardRules: Rule[] = [
  [/^card$/, () => ({
    'border-radius': '0.5rem',
    'box-shadow': '0 1px 3px rgba(0,0,0,0.1)',
    'padding': '1rem',
    'background-color': 'white'
  }), { layer: 'components' }]
]

export const rules: Rule[] = [
  ...baseRules,
  ...buttonRules,
  ...cardRules
]
