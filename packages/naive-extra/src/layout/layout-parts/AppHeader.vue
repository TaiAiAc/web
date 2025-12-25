<script setup lang="ts">
import { useContext } from '../context'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { type, bordered, inverted, headerHeight, activeKey, hasSiderLayout, isTopMain, menuOptions: options, firstLevelMenuOptions, subLevelMenuOptions, updateActiveKey } = useContext()

const headerStyle = computed(() => ({
  height: `${unref(headerHeight)}px`,
  zIndex: 1,
  padding: unref(hasSiderLayout) ? '0' : '0 16px'
}))

const showMenu = computed(() => ['top-menu', 'left-mixed-top-priority', 'top-mixed-top-priority', 'top-mixed-side-priority'].includes(unref(type)!))

const active = ref('')

const topActiveKey = computed({
  get: () => {
    if (unref(isTopMain)) {
      return unref(activeKey)
    }
    return active.value
  },
  set: (val) => {
    if (unref(isTopMain)) {
      updateActiveKey(val!)
    }
    else {
      active.value = val!
    }
  }
})

const menuOptions = computed(() => {
  if (unref(type) === 'top-menu')
    return unref(options)
  return unref(isTopMain) ? unref(firstLevelMenuOptions) : unref(subLevelMenuOptions)
})

function onMenuSelect(key: string) {
  if (unref(isTopMain)) {
    updateActiveKey(key)
  }
  else {
    active.value = key
  }
}
</script>

<template>
  <n-layout-header position="absolute" :bordered="bordered" :inverted="inverted" :style="headerStyle">
    <n-flex align="center" :wrap="false" class="w-full" :style="{ height: `${headerHeight}px` }">
      <AppLeftLogoInfo v-if="!hasSiderLayout" />
      <AppBreadcrumb v-if="type === 'left-menu'" />
      <n-menu
        v-if="showMenu"
        v-model:value="topActiveKey"
        class="flex-1"
        mode="horizontal"
        :options="menuOptions"
        responsive
        :inverted="inverted"
        @update:value="onMenuSelect"
      />
    </n-flex>
  </n-layout-header>
</template>
