<script setup lang="ts">
import { injectLayoutContext } from '../context'

const ctx = injectLayoutContext()!

function getContentPositionStyle(_: void) {
  return {
    top: `${ctx.headerHeight}px`,
    bottom: `${ctx.footerHeight}px`
  }
}
</script>

<template>
  <NLayoutContent
    position="absolute"
    :style="getContentPositionStyle()"
    :native-scrollbar="false"
    content-style="padding: 16px;"
  >
    <slot />
  </NLayoutContent>
</template>
