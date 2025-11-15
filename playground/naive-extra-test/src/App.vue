<script setup lang="ts">
import ButtonDemo from './components/ButtonDemo.vue'
import FormDemo from './components/FormDemo.vue'
import SearchFormDemo from './components/SearchFormDemo.vue'
import TableDemo from './components/TableDemo.vue'
import UploadDemo from './components/UploadDemo.vue'
</script>

<template>
  <n-flex style="width: 80%; margin: 50px auto;">
    <n-h1>@quiteer/naive-extra 组件库示例</n-h1>
    <ButtonDemo />
    <UploadDemo />
    <FormDemo />
    <SearchFormDemo />
    <TableDemo />
  </n-flex>
</template>
