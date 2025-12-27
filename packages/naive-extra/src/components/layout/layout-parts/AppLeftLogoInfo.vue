<script setup lang="ts">
import { useContext } from '../context'

const { isCollapsed, headerHeight, isLeftMixed, hasSiderLayout } = useContext()!

const isMixed = computed(() => unref(isLeftMixed) || unref(isCollapsed))

function getContainerStyle(_: void) {
  return {
    height: `${unref(headerHeight)}px`,
    display: 'flex',
    alignItems: 'center',
    padding: isMixed.value ? '0' : '0 20px',
    justifyContent: isMixed.value ? 'center' : 'flex-start'
  }
}
</script>

<template>
  <n-flex align="center" :wrap="false" :justify="isMixed ? 'center' : 'flex-start'" :style="hasSiderLayout ? getContainerStyle() : {}" class="cursor-pointer select-none">
    <i class=" i-skill-icons:vuejs-dark text-3xl" />
    <div
      class=" transition-width duration-200"
      :class="{ 'opacity-0 w-0 absolute': isMixed }"
    >
      明天会好的111
    </div>
  </n-flex>
</template>
