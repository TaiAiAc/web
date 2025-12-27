import type { DataTableColumn, DataTableProps } from 'naive-ui'

export type TableSize = 'medium' | 'small' | 'large' | undefined

export interface Props extends /* @vue-ignore */ DataTableProps {
  size?: TableSize
  striped?: boolean
  fetch: FetchFn
  hidebar?: boolean
}

export type Column = DataTableColumn<Recordable>
export type Columns = Column[]

export interface Settings {
  size: TableSize
  striped: boolean
  columns: any[]
}

export interface FetchFn {
  (pageInfo: { pageNum: number, pageSize: number }): Promise<{
    list: any[]
    total: number
  }>
}

export type ExportType = 'all' | 'section'
