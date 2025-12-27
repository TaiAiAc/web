import type { UploadProps } from 'naive-ui'

export interface Props extends /* @vue-ignore */ UploadProps {
  fileType: 'image-view' | 'video-view' | 'audio-view' | 'file' | 'dragger-file'
  fileSize?: number
  /** 传入string返回值为url 不传默认数据为数组形式 */
  dataType?: 'string'
}
