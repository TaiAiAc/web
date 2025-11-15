import type { QuiTable } from '@quiteer/naive-extra'
import type { DataTableColumns } from 'naive-ui'
import { NImage } from 'naive-ui'
import { ref } from 'vue'

export function useTable() {
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

  return {
    tableRef,
    columns
  }
}
