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
  'hover-opacity': 'hover:opacity-80 transition-opacity cursor-pointer',

  // ============ 进场/退场动画 shortcuts ============

  // 1. 淡入淡出
  'anim-fade': 'transition-opacity duration-250 ease-in-out',
  'anim-fade-enter': 'opacity-0',
  'anim-fade-leave': 'opacity-0',

  // 2. 从右侧滑入/滑出（适合抽屉、右侧面板）
  'anim-slide-right': 'transition-transform duration-300 ease-layout',
  'anim-slide-right-enter': 'translate-x-full',
  'anim-slide-right-leave': 'translate-x-full',

  // 3. 从左侧滑入/滑出（适合左侧菜单）
  'anim-slide-left': 'transition-transform duration-300 ease-layout',
  'anim-slide-left-enter': '-translate-x-full',
  'anim-slide-left-leave': '-translate-x-full',

  // 4. 缩放淡入（适合弹窗、卡片）
  'anim-scale-fade': 'transition-[transform,opacity] duration-250 ease-in-out',
  'anim-scale-fade-enter': 'scale-95 opacity-0',
  'anim-scale-fade-leave': 'scale-90 opacity-0',

  // 5. ✅ 宽度塌陷动画（核心！用于侧边栏展开/收起）
  'anim-width-collapse': 'overflow-hidden transition-width duration-300 ease-layout',
  'anim-width-collapse-enter': 'w-0!',
  'anim-width-collapse-leave': 'w-0!',

  // 6. 高度塌陷（适合折叠面板）
  'anim-height-collapse': 'overflow-hidden transition-height duration-300 ease',
  'anim-height-collapse-enter': 'h-0!',
  'anim-height-collapse-leave': 'h-0!',

  // ============ 辅助类 ============
  // 强制内联样式优先级（用于动画结束状态）
  'w-0!': 'w-0 !important',
  'h-0!': 'h-0 !important'
} satisfies UserShortcuts<PresetUnoTheme>
