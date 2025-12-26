<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useContext } from '../context'
import { resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { type, bordered, inverted, headerHeight, activeKey, mainActiveKey, subActiveKey, hasSiderLayout, isLeftMain, isTopMain, menuOptions: options, mainMenuOptions, subMenuOptions, updateActiveKey } = useContext()

const headerStyle = computed(() => ({
  height: `${unref(headerHeight)}px`,
  zIndex: 1,
  padding: unref(hasSiderLayout) ? '0' : '0 16px'
}))

const showMenu = computed(() => ['top-menu', 'top-menu/2', 'top-mixed-menu/2', 'side-menu/2', 'side-mixed-menu/2'].includes(unref(type)!))
const isTopMenu = computed(() => unref(type) === 'top-menu')

const active = ref('')

const menuOptions = computed(() => {
  if (isTopMenu.value)
    return unref(options)
  return unref(isTopMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
})

function getKey(key: string) {
  const opts = (unref(options) as any[]) || []
  const topKey = resolveTopParentKeyFromMenu(opts as any, key)
  const leafKey = resolveLeafKeyFromMenu(opts as any, key)
  mainActiveKey.value = topKey
  subActiveKey.value = leafKey
  return { topKey, leafKey }
}

watchEffect(() => {
  if (unref(isTopMain)) {
    const { topKey } = getKey(unref(activeKey)!)
    active.value = topKey
  }

  if (unref(isLeftMain)) {
    const { leafKey } = getKey(unref(activeKey)!)
    active.value = leafKey
  }
})

const router = useRouter()
function handleUpdateValue(key: string) {
  console.log('key: ', key)
  updateActiveKey(key)
  active.value = key
  if (unref(isTopMain) && !isTopMenu.value) {
    const { leafKey } = getKey(key)
    console.log('leafKey: ', leafKey)
    router.push(leafKey)
  }
}
</script>

<template>
  <n-layout-header position="absolute" :bordered="bordered" :inverted="inverted" :style="headerStyle">
    <n-flex align="center" :wrap="false" class="w-full" :style="{ height: `${headerHeight}px` }">
      <AppLeftLogoInfo v-if="!hasSiderLayout" />
      <AppBreadcrumb v-if="type === 'side-menu'" />
      <n-menu
        v-if="showMenu"
        v-model:value="active"
        class="flex-1"
        mode="horizontal"
        :options="menuOptions"
        responsive
        :inverted="inverted"
        @update:value="handleUpdateValue"
      />
    </n-flex>
  </n-layout-header>
</template>
