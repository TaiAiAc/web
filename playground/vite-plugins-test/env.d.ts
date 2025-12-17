interface ImportMetaEnv {
  readonly VITE_API_URL: '/api'
  readonly VITE_BASE_URL: 'http://localhost:3000' | 'https://api.test.example.com'
  readonly VITE_DESC: '开发环境变量' | '测试环境变量' | '混淆环境变量' | '生产环境变量' | '通用环境变量'
  readonly VITE_GIS_CSS: '/1' | '/gis'
  readonly VITE_GIS_JS: '/gis'
  readonly VITE_TEST: 'false'
  readonly VITE_TEST_URL: 'https://quiteerjs.github.io/web/'
  readonly VITE_TEST1: 'true'
  readonly VITE_TITLE: 'prod' | 'test'
  readonly VITE_UPLOAD_URL: '/files'
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
