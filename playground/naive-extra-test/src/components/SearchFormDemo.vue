<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import type { CascaderProps, SelectProps } from 'naive-ui'
import { QuiForm } from '@quiteer/naive-extra'
import { reactive, ref } from 'vue'

const schemas: FormSchema<any>[] = reactive([
  {
    field: 'categoryId',
    label: '类目',
    component: 'NCascader',
    componentProps: {
      options: [],
      checkStrategy: 'child',
      valueField: 'id',
      labelField: 'name',
      childrenField: 'childrenLevelList'
    } as CascaderProps
  },
  {
    field: 'productCode',
    label: '商品编号',
    component: 'NInput'
  },
  {
    field: 'skuName',
    label: 'SKU名称',
    component: 'NInput'
  },
  {
    field: 'title',
    label: '商品标题',
    component: 'NInput'
  },
  {
    field: 'color',
    label: '颜色',
    component: 'NInput'
  },
  {
    field: 'listingStatus',
    label: '上架状态',
    component: 'NSelect',
    componentProps: {
      options: [
        {
          label: '未上架',
          value: 0
        },
        {
          label: '已上架',
          value: 1
        }
      ]
    } as SelectProps
  }
])

const formRef = ref<InstanceType<typeof QuiForm>>()

function getSearchParams() {
  return formRef.value?.getFieldsValue()
}

function handleSubmit() {
  console.log('getSearchParams() :>> ', getSearchParams())
}
</script>

<template>
  <n-card title="audio-view" size="small">
    <QuiForm
      ref="formRef"
      :schemas="schemas"
      inline
      label-width="100"
      @submit="handleSubmit"
      @reset="handleSubmit"
    />
  </n-card>
</template>

<style lang="scss" scoped></style>
