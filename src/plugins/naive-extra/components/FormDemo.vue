<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import type { PopconfirmProps } from 'naive-ui'
import { QuiForm, QuiPopconfirmButton } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true, message: '请输入姓名' }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

const popconfirmProps: PopconfirmProps = {
  onPositiveClick(e) {
    e.preventDefault()
  },
  onNegativeClick(e) {
    e.preventDefault()
  }
}
</script>

<template>
  <QuiForm :schemas="schemas">
    <template #action-button>
      <QuiTooltipButton type="primary" tip="这是一个提示按钮">
        提示按钮
      </QuiTooltipButton>
      <QuiPopconfirmButton
        title="确认删除吗？" :popconfirm-props="popconfirmProps"
      >
        二次确认
      </QuiPopconfirmButton>
    </template>
  </QuiForm>
</template>

<style lang="scss" scoped></style>
