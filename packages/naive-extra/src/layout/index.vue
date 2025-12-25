<script setup lang="ts">
import type { Props } from './props'
import { useRoute, useRouter } from 'vue-router'
import { DEFAULT_LAYOUT_PROPS } from './const'
import { LayoutEmitsKey, provideLayoutContext } from './context'
import AppFooter from './layout-parts/AppFooter.vue'
import AppHeader from './layout-parts/AppHeader.vue'
import AppMain from './layout-parts/AppMain.vue'
import AppSidebar from './layout-parts/AppSidebar.vue'
import LayoutTransition from './layout-parts/LayoutTransition.vue'

const props = withDefaults(defineProps<Props>(), { ...DEFAULT_LAYOUT_PROPS, menuOptions: () => [] })

const emit = defineEmits<{
  'update:isCollapsed': [value: boolean]
  'update:inverted': [value: boolean]
  'update:activeKey': [value: string]
}>()

provide(LayoutEmitsKey, {
  updateIsCollapsed(value: boolean) {
    emit('update:isCollapsed', value)
  },
  updateInverted(value: boolean) {
    emit('update:inverted', value)
  },
  updateActiveKey(value: string) {
    emit('update:activeKey', value)
  }
})

provideLayoutContext(props)

const isLeftMixed = computed(() => ['left-mixed', 'left-mixed-top-priority'].includes(props.type))

const hasSiderLayout = computed(() => ['left-menu', 'left-mixed', 'left-mixed-top-priority', 'top-mixed-side-priority', 'top-mixed-top-priority'].includes(props.type))

const isBlank = computed(() => props.type === 'blank')

const left = computed(() => {
  if (unref(hasSiderLayout)) {
    return props.isCollapsed || unref(isLeftMixed) ? props.collapsedWidth : props.siderWidth
  }
  return 0
})

function findNodeByKey(list: any[], key: string): any | null {
  const stack = [...(list || [])]
  while (stack.length) {
    const n = stack.pop()
    if (n?.key === key)
      return n
    if (Array.isArray(n?.children))
      stack.push(...n.children)
  }
  return null
}
function findFirstLeaf(node: any): any {
  let cur = node
  while (cur && Array.isArray(cur.children) && cur.children.length) {
    cur = cur.children[0]
  }
  return cur
}

const route = useRoute()
const router = useRouter()

const stop = watch(() => props.type, () => {
  const opts = props.menuOptions as any[] || []
  const cur = String(props.activeKey ?? '')
  const node = findNodeByKey(opts, cur)
  if (node && Array.isArray(node.children) && node.children.length) {
    const leaf = findFirstLeaf(node.children[0])
    if (leaf?.key) {
      emit('update:activeKey', leaf.key)
      if (leaf.key !== route.path)
        router.push(leaf.key)
    }
  }
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <n-layout :has-sider="hasSiderLayout" position="absolute" :native-scrollbar="false" :inverted="inverted">
    <LayoutTransition mode="fade">
      <AppSidebar v-if="hasSiderLayout" />
    </LayoutTransition>

    <n-layout position="absolute" :style="{ left: `${left}px` }">
      <LayoutTransition mode="height">
        <AppHeader v-if="!isBlank" />
      </LayoutTransition>

      <AppMain />

      <LayoutTransition mode="height">
        <AppFooter v-if="!isBlank">
          固定页脚
        </AppFooter>
      </LayoutTransition>
    </n-layout>
  </n-layout>
</template>
