import type { UploadProps } from 'naive-ui'
import type { Props as QuiUploadProps } from './props'
import { AcceptType } from './enum'

export function useUploadProps(config: QuiUploadProps) {
  const uploadComponentProps: QuiUploadProps = {
    ...config,
    defaultUpload: true,
    max: 5,
    accept: undefined
  }

  const getUploadProps = (option?: UploadProps): UploadProps => {
    return { ...uploadComponentProps, ...option }
  }

  const getImageUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Image }),
      ...option
    }
  }

  const getVedioUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Video }),
      ...option
    }
  }

  const getAudioUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Audio }),
      ...option
    }
  }

  return {
    getUploadProps,
    getImageUploadProps,
    getVedioUploadProps,
    getAudioUploadProps
  }
}
