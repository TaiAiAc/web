<script setup lang="ts">
import { useContext } from '../context'

const { bordered, inverted, footerHeight } = useContext()!
</script>

<template>
  <n-layout-footer position="absolute" :bordered="bordered" :inverted="inverted" :style="{ height: `${footerHeight}px`, zIndex: 1 }">
    <slot />
  </n-layout-footer>
</template>
