import type { PresetUnoTheme, UserShortcuts } from 'unocss'

export const shortcuts = {
  // Flex
  'flex-center': 'flex justify-center items-center',
  'flex-x-center': 'flex justify-center',
  'flex-y-center': 'flex items-center',
  'flex-col': 'flex flex-col',
  'flex-col-center': 'flex-center flex-col',
  'flex-col-stretch': 'flex-col items-stretch',
  'flex-between': 'flex justify-between items-center',
  'i-flex-center': 'inline-flex justify-center items-center',
  'i-flex-x-center': 'inline-flex justify-center',
  'i-flex-y-center': 'inline-flex items-center',
  'i-flex-col': 'flex-col inline-flex',
  'i-flex-col-center': 'flex-col i-flex-center',
  'i-flex-col-stretch': 'i-flex-col items-stretch',
  'flex-1-hidden': 'flex-1 overflow-hidden',

  // Absolute / Fixed
  'absolute-lt': 'absolute left-0 top-0',
  'absolute-lb': 'absolute left-0 bottom-0',
  'absolute-rt': 'absolute right-0 top-0',
  'absolute-rb': 'absolute right-0 bottom-0',
  'absolute-tl': 'absolute-lt',
  'absolute-tr': 'absolute-rt',
  'absolute-bl': 'absolute-lb',
  'absolute-br': 'absolute-rb',
  'absolute-center': 'absolute-lt flex-center size-full',
  'fixed-lt': 'fixed left-0 top-0',
  'fixed-lb': 'fixed left-0 bottom-0',
  'fixed-rt': 'fixed right-0 top-0',
  'fixed-rb': 'fixed right-0 bottom-0',
  'fixed-tl': 'fixed-lt',
  'fixed-tr': 'fixed-rt',
  'fixed-bl': 'fixed-lb',
  'fixed-br': 'fixed-rb',
  'fixed-center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'abs-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'abs-full': 'absolute inset-0',

  // Dimensions
  'wh-full': 'w-full h-full',
  'w-screen-w': 'w-100vw',
  'h-screen-h': 'h-100vh',

  // Text
  'nowrap-hidden': 'overflow-hidden whitespace-nowrap',
  'ellipsis-text': 'nowrap-hidden text-ellipsis',
  'ellipsis': 'truncate',
  'text-ellipsis': 'truncate',

  // Interaction
  'cursor-pointer': 'cursor-pointer select-none',
  'hover-opacity': 'hover:opacity-80 transition-opacity cursor-pointer'
} satisfies UserShortcuts<PresetUnoTheme>
