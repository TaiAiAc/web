<script setup lang="tsx">
import AxiosDemo from './Axios.demo.vue'

const Btn = <button>我来自 tsx 组件</button>
</script>

<template>
  <h1 class="text-3xl font-bold text-center bg-amber">
    You did it!
  </h1>
  <div class="flex-center">
    如果背景色是红色说明 unocss 配置覆盖成功
  </div>
  <Btn />
  <AxiosDemo />
</template>

<style scoped></style>
