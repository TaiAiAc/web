interface ImportMetaEnv {
  readonly VITE_API_URL: '/api'
  readonly VITE_BASE_URL: 'http://localhost:3000' | 'https://api.example.com' | 'https://api.release.example.com' | 'https://api.staging.example.com' | 'https://api.test.example.com'
  readonly VITE_DESC: '发布环境变量' | '开发环境变量' | '测试环境变量' | '生产环境变量' | '通用环境变量' | '预发布环境变量'
  readonly VITE_GIS_CSS: '/gis'
  readonly VITE_GIS_JS: '/gis'
  readonly VITE_TEST_URL: 'https://quiteerjs.github.io/web/'
  readonly VITE_TITLE: 'prod' | 'release' | 'staging' | 'test' | 'xxx'
  readonly VITE_UPLOAD_URL: '/files'
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
