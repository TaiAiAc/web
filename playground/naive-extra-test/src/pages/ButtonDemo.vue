<script setup lang="ts">
import { QuiPopconfirmButton, QuiTooltipButton } from 'naive-extra'
</script>

<template>
  <n-card title="简单封装的按钮组件" size="small">
    <n-flex>
      <QuiPopconfirmButton title="确认删除吗？">
        确认对话按钮
      </QuiPopconfirmButton>
      <QuiTooltipButton tip="展示一些缩略详情">
        弹窗按钮
      </QuiTooltipButton>
    </n-flex>
  </n-card>
</template>

<style lang="scss" scoped></style>
