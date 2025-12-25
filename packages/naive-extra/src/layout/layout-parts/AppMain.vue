<script setup lang="ts">
import { useContext } from '../context'

const { headerHeight, footerHeight, type } = useContext()

const isBlank = computed(() => unref(type) === 'blank')

function getContentPositionStyle(_: void) {
  return {
    top: isBlank.value ? '0px' : `${unref(headerHeight)}px`,
    bottom: isBlank.value ? '0px' : `${unref(footerHeight)}px`
  }
}
</script>

<template>
  <n-layout-content
    position="absolute" embedded
    :style="getContentPositionStyle()"
    :native-scrollbar="false"
    content-style="padding: 16px;"
  >
    <RouterView />
  </n-layout-content>
</template>
