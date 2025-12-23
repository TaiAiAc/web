<script setup lang="ts">
import { injectLayoutContext } from '../context'

const ctx = injectLayoutContext()!
</script>

<template>
  <NLayoutFooter position="absolute" :bordered="ctx.bordered" :inverted="ctx.inverted" :style="{ height: `${ctx.footerHeight}px`, zIndex: 1 }">
    <slot />
  </NLayoutFooter>
</template>
