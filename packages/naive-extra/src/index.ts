import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'

import { QuiPopconfirmButton, QuiTooltipButton } from './button'
import { QuiForm } from './form'
import { QuiIcon } from './icon'
import { QuiLayout, useLayout } from './layout'
import { QuiProvider } from './provider'
import { QuiSearchBar } from './search-bar'
import { QuiTable } from './table'

import { AcceptType, QuiUpload, useUploadProps } from './upload'
import 'virtual:uno.css'

export {
  QuiForm,
  QuiIcon,
  QuiLayout,
  QuiPopconfirmButton,
  QuiProvider,
  QuiSearchBar,
  QuiTable,
  QuiTooltipButton,
  QuiUpload
}

export {
  AcceptType,
  useUploadProps
}

export {
  useLayout
}

export type { PopconfirmButtonProps, TooltipButtonProps } from './button'
export { useForm } from './form'
export type { CustomSwitchProps, FormProps, FormSchema } from './form'
export type { LayoutProps } from './layout'

export { useBorderRadio, useColorScheme, useLocale, useTheme } from './provider'
export type { ProviderProps } from './provider'
export type { SearchBarProps } from './search-bar'
export { useColumn, useTable } from './table'
export type {
  TableColumn,
  TableColumns,
  TableExportType,
  TableFetchFn,
  TableProps,
  TableSettings,
  TableSize
} from './table'
export type { UploadProps } from './upload'

declare global {
  interface Window {
    $message?: MessageApi
    $dialog?: DialogApi
    $notification?: NotificationApi
    $loadingBar?: LoadingBarApi
  }
}
