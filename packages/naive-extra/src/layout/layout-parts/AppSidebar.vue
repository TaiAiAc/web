<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue'
import { useContext } from '../context'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { isCollapsed, collapsedWidth, siderWidth, headerHeight, bordered, inverted, isLeftMain, activeKey, type, menuOptions: options, firstLevelMenuOptions, subLevelMenuOptions, isLeftMixed, updateActiveKey, updateIsCollapsed } = useContext()

const width = computed(() => (unref(isCollapsed) || unref(isLeftMixed) ? unref(collapsedWidth) : unref(siderWidth)))

function handleUpdateValue(key: string) {
  updateActiveKey(key)
}

function handleUpdateCollapsed(v: boolean) {
  updateIsCollapsed(v)
}

const menuOptions = computed(() => {
  if (unref(type) === 'left-menu')
    return unref(options)
  return unref(isLeftMain) ? unref(firstLevelMenuOptions) : unref(subLevelMenuOptions)
})

const expandedKeys = ref<string[]>([])
function computeExpandedKeys(path: string) {
  const parts = String(path ?? '').split('/').filter(Boolean)
  const keys: string[] = []
  for (let i = 0; i < parts.length - 1; i++) {
    keys.push(`/${parts.slice(0, i + 1).join('/')}`)
  }
  return keys
}

watch(activeKey, (p) => {
  expandedKeys.value = computeExpandedKeys(p as string)
}, { immediate: true })

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys
}
</script>

<template>
  <n-layout-sider
    position="absolute"
    collapse-mode="width"
    :show-trigger="isLeftMixed ? false : 'bar'"
    :width="width"
    :collapsed-width="collapsedWidth"
    :bordered="bordered"
    :inverted="inverted"
    :collapsed="isLeftMixed ? true : isCollapsed"
    :native-scrollbar="false"
    @update:collapsed="handleUpdateCollapsed"
  >
    <n-layout-header :inverted="inverted">
      <slot name="header">
        <AppLeftLogoInfo :header-height="headerHeight" :is-collapsed="isCollapsed" />
      </slot>
    </n-layout-header>
    <n-menu
      :value="activeKey"
      :options="menuOptions"
      :expanded-keys="expandedKeys"
      :collapsed-width="collapsedWidth"
      :inverted="inverted"
      @update:value="handleUpdateValue"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </n-layout-sider>
</template>
