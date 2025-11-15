<script setup lang="tsx">
import type { TableFetchFn } from '@quiteer/naive-extra'
import type { DataTableColumns } from 'naive-ui'
import { QuiTable } from '@quiteer/naive-extra'
import { NImage } from 'naive-ui'
import { ref } from 'vue'

const columns: DataTableColumns<any> = [
  {
    title: '产品 ID',
    width: 80,
    key: 'id'
  },
  {
    title: '产品编码',
    width: 80,
    key: 'productCode'
  },
  {
    title: '商品封面',
    key: 'productMainImage',
    render(rowData) {
      return <NImage width="80" src={rowData.productMainImage} />
    }
  },
  {
    title: '商品类目',
    key: 'categoryName'
  },
  {
    title: '商品名称',
    key: 'title'
  },
  {
    title: 'SKU 名称',
    key: 'skuName'
  }
]

const tableRef = ref<InstanceType<typeof QuiTable>>()

const fetchList: TableFetchFn = async (pageInfo) => {
  console.log('pageInfo: ', pageInfo)
  return {
    list: [],
    total: 0
  }
}
</script>

<template>
  <n-card title="适用大部分场景的表格" size="small">
    <QuiTable ref="tableRef" :fetch="fetchList" :columns="columns" :scroll-x="1080">
      <template #left>
        <NButton type="primary">
          添加商品
        </NButton>
      </template>
    </QuiTable>
  </n-card>
</template>

<style lang="scss" scoped></style>
