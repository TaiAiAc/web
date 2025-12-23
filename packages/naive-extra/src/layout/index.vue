<script setup lang="ts">
import type { Props } from './props'
import { useRouter } from 'vue-router'
import BasicLayout from './BasicLayout.vue'
import BlankLayout from './BlankLayout.vue'
import { DEFAULT_LAYOUT_PROPS, LayoutContextKey } from './context'
import { transformRouteToMenu } from './route-to-menu'

const props = withDefaults(defineProps<Props>(), { ...DEFAULT_LAYOUT_PROPS, menuOptions: () => [] })

const emit = defineEmits<{
  'update:isCollapsed': [value: boolean]
  'update:inverted': [value: boolean]
  'update:activeKey': [value: string]
  'menuChange': [key: string]
  'active': [key: string]
}>()

// 1. 创建响应式的 activeKey（内部状态）
const activeKey = ref('')

// 2. 构建响应式 context
const router = useRouter()
const menuOptionsComputed = computed(() => {
  const opts = props.menuOptions ?? []
  if (opts.length > 0)
    return opts
  const routes = router.getRoutes() as any
  return transformRouteToMenu(routes)
})

const context = reactive({
  // 使用 toRef 保持与 props 的响应式链接
  type: toRef(props, 'type'),
  bordered: toRef(props, 'bordered'),
  inverted: toRef(props, 'inverted'),
  isCollapsed: toRef(props, 'isCollapsed'),
  headerHeight: toRef(props, 'headerHeight'),
  footerHeight: toRef(props, 'footerHeight'),
  siderWidth: toRef(props, 'siderWidth'),
  collapsedWidth: toRef(props, 'collapsedWidth'),
  menuOptions: menuOptionsComputed,
  activeKey,
  updateIsCollapsed(value: boolean) {
    emit('update:isCollapsed', value)
  },
  updateInverted(value: boolean) {
    emit('update:inverted', value)
  },
  updateActiveKey(value: string) {
    activeKey.value = value
    emit('update:activeKey', value)
    this.onActive(value)
  },
  onActive(key: string) {
    emit('menuChange', key)
    emit('active', key)
  }
})

provide(LayoutContextKey, context)

function getLayoutComponent() {
  switch (props.type) {
    case 'blank':
      return BlankLayout
    default:
      return BasicLayout
  }
}
</script>

<template>
  <component :is="getLayoutComponent()">
    <slot />
  </component>
</template>
