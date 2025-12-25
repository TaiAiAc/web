<script setup lang="ts">
/**
 * 通用布局过渡组件
 *
 * 为侧边栏、头部、底部、内容区域提供统一的进场/出场动画能力，
 * 通过 `mode` 控制动画类型，适配宽度/高度/位移/透明等常见过渡。
 *
 * @param props.mode - 动画模式：'fade' | 'slide-x' | 'slide-y' | 'scale' | 'width' | 'height'
 * @param props.duration - 过渡时长（毫秒），默认 250
 * @param props.easing - 缓动函数，默认 cubic-bezier(0.25,0.46,0.45,0.94)
 * @returns 无返回值（渲染一个 <Transition> 包裹的插槽）
 *
 * @example
 * ```vue
 * <LayoutTransition mode="width">
 *   <AppSidebar v-if="showSider" />
 * </LayoutTransition>
 * ```
 *
 * @remarks
 * - width/height 模式使用 scrollWidth/scrollHeight 进行展开动画，before-leave 固定当前尺寸避免抖动
 * - slide-x/slide-y 使用 transform 与 opacity 联合过渡
 * - scale 使用轻微缩放与透明度过渡
 *
 * @security
 * - 仅修改元素内联样式；不涉及外部副作用
 *
 * @performance
 * - 依赖浏览器原生过渡；时间复杂度与节点尺寸无关
 */
const props = withDefaults(defineProps<{
  mode?: 'fade' | 'slide-x' | 'slide-y' | 'scale' | 'width' | 'height'
  duration?: number
  easing?: string
  appear?: boolean
}>(), {
  mode: 'fade',
  duration: 250,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  appear: true
})

/**
 * 设置通用过渡样式
 * 将 transition 应用于节点，按需组合属性。
 */
function setTransition(node: HTMLElement, propsList: string[]) {
  node.style.transition = propsList.map(p => `${p} ${props.duration}ms ${props.easing}`).join(', ')
}

/**
 * 宽度入场动画（展开）
 *
 * 初始 width=0，随后过渡到 scrollWidth，实现展开效果。
 *
 * @param el - 进入的元素
 */
function widthEnter(el: Element) {
  const node = el as HTMLElement
  const computedStyle = window.getComputedStyle(node)
  const target
    = Number.parseFloat(computedStyle.width || '0')
      || node.getBoundingClientRect().width
      || node.offsetWidth
      || node.scrollWidth
  if (!target || target <= 0) {
    node.style.transition = ''
    node.style.overflow = ''
    node.style.width = ''
    return
  }
  node.style.overflow = 'hidden'
  node.style.width = '0px'
  setTransition(node, ['width'])
  requestAnimationFrame(() => {
    node.style.width = `${target}px`
  })
}

/**
 * 宽度离场前动画（收起）
 *
 * 固定当前宽度，然后过渡到 0。
 *
 * @param el - 离场的元素
 */
function widthBeforeLeave(el: Element) {
  const node = el as HTMLElement
  const current = node.offsetWidth
  node.style.overflow = 'hidden'
  node.style.width = `${current}px`
  setTransition(node, ['width'])
  requestAnimationFrame(() => {
    node.style.width = '0px'
  })
}

/**
 * 高度入场动画（展开）
 *
 * 初始 height=0，随后过渡到 scrollHeight，实现展开效果。
 *
 * @param el - 进入的元素
 */
function heightEnter(el: Element) {
  const node = el as HTMLElement
  const target = node.scrollHeight
  node.style.overflow = 'hidden'
  node.style.height = '0px'
  setTransition(node, ['height'])
  requestAnimationFrame(() => {
    node.style.height = `${target}px`
  })
}

/**
 * 高度离场前动画（收起）
 *
 * 固定当前高度，然后过渡到 0。
 *
 * @param el - 离场的元素
 */
function heightBeforeLeave(el: Element) {
  const node = el as HTMLElement
  const current = node.offsetHeight
  node.style.overflow = 'hidden'
  node.style.height = `${current}px`
  setTransition(node, ['height'])
  requestAnimationFrame(() => {
    node.style.height = '0px'
  })
}

/**
 * 透明入场动画
 *
 * opacity: 0 -> 1
 *
 * @param el - 进入的元素
 */
function fadeEnter(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '0'
  setTransition(node, ['opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '1'
  })
}

/**
 * 透明离场前动画
 *
 * opacity: 1 -> 0
 *
 * @param el - 离场的元素
 */
function fadeBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '1'
  setTransition(node, ['opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '0'
  })
}

/**
 * 横向位移入场动画
 *
 * transform: translateX(-8px) -> 0, opacity: 0 -> 1
 *
 * @param el - 进入的元素
 */
function slideXEnter(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '0'
  node.style.transform = 'translateX(-8px)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '1'
    node.style.transform = 'translateX(0)'
  })
}

/**
 * 横向位移离场前动画
 *
 * transform: 0 -> translateX(-8px), opacity: 1 -> 0
 *
 * @param el - 离场的元素
 */
function slideXBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '1'
  node.style.transform = 'translateX(0)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '0'
    node.style.transform = 'translateX(-8px)'
  })
}

/**
 * 纵向位移入场动画
 *
 * transform: translateY(-6px) -> 0, opacity: 0 -> 1
 *
 * @param el - 进入的元素
 */
function slideYEnter(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '0'
  node.style.transform = 'translateY(-6px)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '1'
    node.style.transform = 'translateY(0)'
  })
}

/**
 * 纵向位移离场前动画
 *
 * transform: 0 -> translateY(-6px), opacity: 1 -> 0
 *
 * @param el - 离场的元素
 */
function slideYBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '1'
  node.style.transform = 'translateY(0)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '0'
    node.style.transform = 'translateY(-6px)'
  })
}

/**
 * 轻微缩放入场动画
 *
 * scale: 0.98 -> 1, opacity: 0 -> 1
 *
 * @param el - 进入的元素
 */
function scaleEnter(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '0'
  node.style.transform = 'scale(0.98)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '1'
    node.style.transform = 'scale(1)'
  })
}

/**
 * 轻微缩放离场前动画
 *
 * scale: 1 -> 0.98, opacity: 1 -> 0
 *
 * @param el - 离场的元素
 */
function scaleBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.opacity = '1'
  node.style.transform = 'scale(1)'
  setTransition(node, ['transform', 'opacity'])
  requestAnimationFrame(() => {
    node.style.opacity = '0'
    node.style.transform = 'scale(0.98)'
  })
}

/**
 * 清理动画样式
 *
 * 移除过渡、溢出、尺寸、透明度、位移等，避免影响后续布局。
 *
 * @param el - 离场后的元素
 */
function afterLeave(el: Element) {
  const node = el as HTMLElement
  node.style.transition = ''
  node.style.overflow = ''
  node.style.width = ''
  node.style.height = ''
  node.style.opacity = ''
  node.style.transform = ''
}

/**
 * 统一进场处理
 *
 * 根据 `mode` 分派具体动画。
 *
 * @param el - 进入元素
 */
function handleEnter(el: Element) {
  switch (props.mode) {
    case 'width':
      widthEnter(el)
      break
    case 'height':
      heightEnter(el)
      break
    case 'slide-x':
      slideXEnter(el)
      break
    case 'slide-y':
      slideYEnter(el)
      break
    case 'scale':
      scaleEnter(el)
      break
    default:
      fadeEnter(el)
  }
}

/**
 * 统一离场前处理
 *
 * 根据 `mode` 分派具体动画。
 *
 * @param el - 离场元素
 */
function handleBeforeLeave(el: Element) {
  switch (props.mode) {
    case 'width':
      widthBeforeLeave(el)
      break
    case 'height':
      heightBeforeLeave(el)
      break
    case 'slide-x':
      slideXBeforeLeave(el)
      break
    case 'slide-y':
      slideYBeforeLeave(el)
      break
    case 'scale':
      scaleBeforeLeave(el)
      break
    default:
      fadeBeforeLeave(el)
  }
}
</script>

<template>
  <Transition
    :appear="props.appear"
    @enter="handleEnter"
    @before-leave="handleBeforeLeave"
    @after-leave="afterLeave"
  >
    <slot />
  </Transition>
  <!-- 用法：
    <LayoutTransition mode="width"><AppSidebar v-if="hasSider"/></LayoutTransition>
    <LayoutTransition mode="height"><AppHeader v-if="showHeader"/></LayoutTransition>
    <LayoutTransition mode="fade"><AppMain v-if="ready"/></LayoutTransition>
  -->
</template>

<style scoped></style>
