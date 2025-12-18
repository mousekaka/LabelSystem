import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandler?: boolean
  showLoading?: boolean
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: RequestConfig) => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (!config.skipAuth && token) {
          config.headers = config.headers || {}
          config.headers.Authorization = \Bearer \\
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data

        // 处理业务错误
        if (code !== 200 && code !== 0) {
          ElMessage.error(message || '请求失败')
          return Promise.reject(new Error(message || '请求失败'))
        }

        return data
      },
      (error) => {
        // 处理HTTP错误
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              // 未授权，清除用户信息并跳转登录
              localStorage.removeItem('token')
              router.push('/login')
              break
            case 403:
              ElMessage.error('无权限访问')
              break
            case 404:
              ElMessage.error('资源不存在')
              break
            case 500:
              ElMessage.error('服务器内部错误')
              break
            default:
              ElMessage.error(data?.message || '请求失败')
          }

          return Promise.reject(new Error(data?.message || '请求失败'))
        }

        // 网络错误
        if (error.code === 'ECONNABORTED') {
          ElMessage.error('请求超时')
          return Promise.reject(new Error('请求超时'))
        }

        ElMessage.error('网络错误')
        return Promise.reject(new Error('网络错误'))
      }
    )
  }

  // GET请求
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  // POST请求
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // PUT请求
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  // DELETE请求
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      }
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
