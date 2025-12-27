import QuiTable from './index.vue'
import { useColumn } from './useColumn'
import { useTable } from './useTable'

export { QuiTable, useColumn, useTable }

export type {
  Column as TableColumn,
  Columns as TableColumns,
  ExportType as TableExportType,
  FetchFn as TableFetchFn,
  Props as TableProps,
  Settings as TableSettings,
  TableSize
} from './props'
