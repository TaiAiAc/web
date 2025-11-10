import type { GridItemProps, GridProps, SwitchProps, UploadProps } from 'naive-ui'
import type { CSSProperties } from 'vue'

export type ComponentType
  = | 'NInput'
    | 'NInputGroup'
    | 'NInputPassword'
    | 'NInputSearch'
    | 'NInputTextArea'
    | 'NInputNumber'
    | 'NInputCountDown'
    | 'NDynamicInput'
    | 'NSelect'
    | 'NTreeSelect'
    | 'NRadioButtonGroup'
    | 'NRadioGroup'
    | 'NCheckbox'
    | 'NCheckboxGroup'
    | 'NAutoComplete'
    | 'NCascader'
    | 'NDatePicker'
    | 'NMonthPicker'
    | 'NRangePicker'
    | 'NWeekPicker'
    | 'NTimePicker'
    | 'NSwitch'
    | 'NStrengthMeter'
    | 'NUpload'
    | 'NIconPicker'
    | 'NRender'
    | 'NSlider'
    | 'NRate'
    | 'NDynamicTags'
    | 'NImage'

export interface FormSchema<T = Recordable<string>> {
  field: keyof T
  label: string
  labelMessage?: string
  labelMessageStyle?: object | string
  defaultValue?: any
  component?: ComponentType
  componentProps?: Record<string, any>
  slot?: string
  rules?: object[]
  giProps?: GridItemProps
  isFull?: boolean
  suffix?: string
}

export interface Props {
  schemas: FormSchema<Recordable<string>>[]
  disabled?: boolean
  // 标签宽度  固定宽度
  labelWidth?: number | string
  labelPlacement?: 'top' | 'left'
  // 是否展示为行内表单
  inline?: boolean
  // 大小
  size?: 'small' | 'medium' | 'large'
  // 组件是否width 100%
  isFull?: boolean
  // grid 配置
  gridProps?: GridProps
  // grid 样式
  gridStyle?: CSSProperties
  // gi配置
  giProps?: GridItemProps
}

export interface CustomSwitchProps extends SwitchProps {
  checkedText: string
  uncheckedText: string
}

export interface UploadConfig extends UploadProps {
  fileType: 'image-view' | 'video-view' | 'audio-view' | 'file' | 'file-dragger'
  fileSize?: number
  /** 传入string返回值为url 不传默认数据为数组形式 */
  dataType?: 'string'
}

export enum AcceptType {
  /**
   * 图片格式：常见光栅和矢量图像
   */
  Image = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg',

  /**
   * 视频格式：常见视频文件类型
   */
  Video = '.mp4,.webm,.ogg,.mov,.avi,.wmv,.flv,.mkv',

  /**
   * 音频格式：常见音频文件类型
   */
  Audio = '.mp3,.wav,.ogg,.aac,.flac,.m4a',

  /**
   * 文档和压缩文件：常用办公文档和压缩包
   */
  File = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.zip,.rar,.7z,.tar,.gz'
}
