<script setup lang="ts">
import { injectLayoutContext } from '../context'

const ctx = injectLayoutContext()!

function getContainerStyle(_: void) {
  return {
    height: `${ctx.headerHeight}px`,
    display: 'flex',
    alignItems: 'center',
    padding: ctx.isCollapsed ? '0' : '0 20px',
    justifyContent: ctx.isCollapsed ? 'center' : 'flex-start'
  }
}
</script>

<template>
  <div :style="getContainerStyle()">
    <i class=" i-skill-icons:vuejs-dark text-3xl" />
    <div v-if="!ctx.isCollapsed" style="margin-left: 8px;">
      明天会好的111
    </div>
  </div>
</template>
