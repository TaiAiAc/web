<script setup lang="ts">
import { providePermissions } from '@quiteer/directives'

// 为演示注入一个权限码（组合式：对子树生效）
providePermissions(['kjk_jt_shanc'])
</script>

<template>
  <h1 v-permission="['kjk_jt_shanc']">
    You did it!
  </h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
