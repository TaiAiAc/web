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
    width: 120,
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
    width: 200,
    key: 'title'
  },
  {
    title: 'SKU 名称',
    key: 'skuName'
  }
]

const tableRef = ref<InstanceType<typeof QuiTable>>()

/**
 * 函数：生成表格测试数据
 * 作用：根据分页信息生成模拟数据列表，便于组件联调与演示
 */
function generateMockList(page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return Array.from({ length: pageSize }, (_, i) => {
    const id = start + i + 1
    return {
      id,
      productCode: `PC-${String(id).padStart(4, '0')}`,
      productMainImage: `https://picsum.photos/seed/${id}/120/80`,
      categoryName: ['数码', '家电', '服饰', '美妆', '图书'][id % 5],
      title: `示例商品标题 ${id}`,
      skuName: `SKU-${(id % 10) + 1}`
    }
  })
}

/**
 * 函数：获取表格数据
 * 作用：返回分页的模拟数据与总数
 */
const fetchList: TableFetchFn = async (pageInfo) => {
  const list = generateMockList(pageInfo.pageNum, pageInfo.pageSize)
  return {
    list,
    total: 500
  }
}
</script>

<template>
  <n-card
    title="适用大部分场景的表格" size="small" style="height: 800px;flex: 1 1 0%;
  overflow: hidden"
  >
    <QuiTable ref="tableRef" :fetch="fetchList" :columns="columns" :scroll-x="1080" min-height="400px">
      <template #left>
        <NButton type="primary">
          添加商品
        </NButton>
      </template>
    </QuiTable>
  </n-card>
</template>

<style lang="scss" scoped></style>
