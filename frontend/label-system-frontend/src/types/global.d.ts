/// <reference types=\"vite/client\" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 全局类型扩展
declare global {
  interface Window {
    __APP_VERSION__: string
  }
  
  type ApiResponse<T = any> = {
    code: number
    message: string
    data: T
    timestamp: number
  }
  
  type PaginatedResponse<T = any> = {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export {}
