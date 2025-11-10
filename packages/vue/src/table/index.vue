<script setup lang="ts">
import type { DataTableColumn, DataTableProps, PaginationProps } from 'naive-ui'
import type { Props, Settings } from './types'
import { NDataTable, NText } from 'naive-ui'
import { computed, h, onActivated, onMounted, reactive, ref, useAttrs } from 'vue'
import TableSetting from './components/TableSetting.vue'

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  striped: true,
  hidebar: false
})

const attrs = useAttrs() as Omit<DataTableProps, 'size' | 'striped'>

const settings = reactive<Settings>({
  size: props.size,
  striped: props.striped,
  columns: attrs.columns!.map(item => ({
    fixed: false,
    ellipsis: { tooltip: true },
    resizable: true,
    align: 'center',
    ...item
  }))
})

const loading = ref(true)

const list = ref<any[]>([])

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    fetchData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchData()
  }
})

const tableRef = ref<InstanceType<typeof NDataTable>>()

const tableProps = computed<DataTableProps>(() => {
  return {
    remote: true,
    renderCell(v: any) {
      return v ?? h(NText, { depth: 3 }, { default: () => '信息缺失' })
    },
    ...attrs
  }
})

async function fetchData() {
  loading.value = true
  const res = await props.fetch({
    pageNum: pagination.page!,
    pageSize: pagination.pageSize!
  })

  loading.value = false
  list.value = res.list
  pagination.itemCount = res.total
}

onActivated(() => {
  fetchData()
})

onMounted(async () => {
  fetchData()

  // console.log({
  //   tableProps: tableProps.value,
  //   tableRef: tableRef.value,
  //   props,
  //   attrs
  // });
})

function handleExport() {
  tableRef.value?.downloadCsv({ fileName: 'data-table' })
}

defineExpose({
  // 获取表格实例
  getTableRef: () => tableRef.value,
  // 刷新
  updateTableData: (isReset = false) => {
    if (isReset) {
      pagination.page = 1
    }
    fetchData()
  },
  setActions<T = Record<string, any>>(columnOption: Partial<DataTableColumn<T>>) {
    settings.columns.push({
      title: '操作',
      align: 'center',
      fixed: 'right',
      key: 'action',
      ...columnOption
    })
  },
  // 导出表格
  downloadCsv: (fileName = 'data-table') => tableRef.value?.downloadCsv({ fileName })
})
</script>

<template>
  <NFlex vertical class="h-full flex-col-stretch">
    <NFlex v-if="!hidebar" align="center" justify="space-between">
      <div>
        <slot name="left" />
      </div>
      <NFlex align="center">
        <slot name="right" />
        <TableSetting v-if="!hidebar" v-model="settings" @realod="fetchData" @export="handleExport" />
      </NFlex>
    </NFlex>
    <NDataTable
      ref="tableRef"
      v-bind="tableProps"
      flex-height
      :size="settings.size"
      :striped="settings.striped"
      :columns="settings.columns"
      :pagination="pagination"
      :loading="loading"
      :data="list"
      class="flex-1-hidden"
    />
  </NFlex>
</template>

<style lang="scss" scoped></style>
