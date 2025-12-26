<script setup lang="ts">
import type { Props } from './props'
import { DEFAULT_LAYOUT_PROPS } from './const'
import { LayoutEmitsKey, provideLayoutContext } from './context'
import AppFooter from './layout-parts/AppFooter.vue'
import AppHeader from './layout-parts/AppHeader.vue'
import AppMain from './layout-parts/AppMain.vue'
import AppSidebar from './layout-parts/AppSidebar.vue'
import LayoutTransition from './layout-parts/LayoutTransition.vue'

const props = withDefaults(defineProps<Props>(), { ...DEFAULT_LAYOUT_PROPS, menuOptions: () => [], baseRoutes: () => [] })

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

const isLeftMixed = computed(() => props.type!.includes('mixed'))

const hasSiderLayout = computed(() => ['side-menu', 'side-menu/2', 'side-mixed-menu/2', 'top-menu/2', 'top-mixed-menu/2'].includes(props.type))

const isBlank = computed(() => props.type === 'blank')

const left = computed(() => {
  if (unref(hasSiderLayout)) {
    return props.isCollapsed || unref(isLeftMixed) ? props.collapsedWidth : props.siderWidth
  }
  return 0
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
