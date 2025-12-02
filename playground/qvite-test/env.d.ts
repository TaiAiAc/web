interface ImportMetaEnv {
  readonly VITE_APIURL: string
  readonly VITE_BASEURL: string
  readonly VITE_DESC: string
  readonly VITE_TESTURL: string
  readonly VITE_TITLE: string
  readonly VITE_UPLOADURL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
