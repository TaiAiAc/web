<script setup lang="tsx">
import type { TableFetchFn } from '@quiteer/naive-extra'
import type { DataTableColumns } from 'naive-ui'
import { QuiTable, useTable } from '@quiteer/naive-extra'
import { NButton, NImage } from 'naive-ui'
// no ref needed

const { tableRef, refresh, downloadCsv, setActions, createIndexColumn } = useTable()

const columns: DataTableColumns<any> = [
  {
    ...createIndexColumn('序号', 60)
  },
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

function appendActionColumn() {
  setActions({
    title: '操作',
    render(row: any) {
      return <NButton text type="primary" onClick={() => console.info(`查看 ${row.title}`)}>查看</NButton>
    }
  })
}

function setSizeSmall() {
  // 改变尺寸示例
  tableRef.value?.setSize('small')
}

function toggleStriped() {
  // 切换斑马纹示例
  tableRef.value?.setStriped(true)
}

function jumpToPage2() {
  // 设置分页示例
  tableRef.value?.setPagination({ page: 2, pageSize: 10 })
  refresh(false)
}

function replaceFetchToDelay() {
  // 替换远端 fetch 示例：增加 300ms 延迟
  tableRef.value?.setFetch(async ({ pageNum, pageSize }: { pageNum: number, pageSize: number }) => {
    await new Promise(r => setTimeout(r, 300))
    const list = generateMockList(pageNum, pageSize)
    return { list, total: 500 }
  })
  refresh(true)
}

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
      <template #right>
        <NButton @click="refresh(true)">
          刷新并重置到第一页
        </NButton>
        <NButton @click="downloadCsv('product-list')">
          导出 CSV
        </NButton>
        <NButton type="primary" @click="appendActionColumn">
          追加操作列
        </NButton>
        <NButton @click="setSizeSmall">
          尺寸设为 small
        </NButton>
        <NButton @click="toggleStriped">
          开启斑马纹
        </NButton>
        <NButton @click="jumpToPage2">
          跳转到第 2 页
        </NButton>
        <NButton @click="replaceFetchToDelay">
          替换远端 fetch（延迟）
        </NButton>
      </template>
    </QuiTable>
  </n-card>
</template>

<style lang="scss" scoped></style>
