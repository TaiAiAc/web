import type { UploadProps } from 'naive-ui'
import type { UploadConfig } from '../types'
import { AcceptType } from '../types'

export function useUploadProps(config: UploadConfig) {
  const uploadComponentProps: UploadConfig = {
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
