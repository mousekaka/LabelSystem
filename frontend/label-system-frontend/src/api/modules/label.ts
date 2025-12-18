import apiClient from '../request'
import type { PaginatedResponse } from '@/types/global'

// 标签类型定义
export interface LabelTemplate {
  id: string
  name: string
  width: number
  height: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface LabelPrintJob {
  id: string
  templateId: string
  data: Record<string, any>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  printerId?: string
  createdAt: string
  updatedAt: string
}

export interface PrinterDevice {
  id: string
  name: string
  type: string
  connection: string
  status: 'online' | 'offline' | 'error'
  lastSeen?: string
}

// 标签模板API
export const labelTemplateApi = {
  // 获取标签模板列表
  getTemplates(params?: {
    page?: number
    pageSize?: number
    keyword?: string
  }): Promise<PaginatedResponse<LabelTemplate>> {
    return apiClient.get('/label-templates', { params })
  },

  // 获取单个标签模板
  getTemplate(id: string): Promise<LabelTemplate> {
    return apiClient.get(\/label-templates/\\)
  },

  // 创建标签模板
  createTemplate(data: Omit<LabelTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<LabelTemplate> {
    return apiClient.post('/label-templates', data)
  },

  // 更新标签模板
  updateTemplate(id: string, data: Partial<LabelTemplate>): Promise<LabelTemplate> {
    return apiClient.put(\/label-templates/\\, data)
  },

  // 删除标签模板
  deleteTemplate(id: string): Promise<void> {
    return apiClient.delete(\/label-templates/\\)
  },

  // 预览标签
  previewTemplate(data: { templateId: string; data: Record<string, any> }): Promise<{ image: string }> {
    return apiClient.post('/label-templates/preview', data)
  }
}

// 打印任务API
export const printJobApi = {
  // 获取打印任务列表
  getJobs(params?: {
    page?: number
    pageSize?: number
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<LabelPrintJob>> {
    return apiClient.get('/print-jobs', { params })
  },

  // 创建打印任务
  createJob(data: {
    templateId: string
    data: Record<string, any>
    printerId?: string
    copies?: number
  }): Promise<LabelPrintJob> {
    return apiClient.post('/print-jobs', data)
  },

  // 取消打印任务
  cancelJob(id: string): Promise<void> {
    return apiClient.post(\/print-jobs/\/cancel\)
  },

  // 重试打印任务
  retryJob(id: string): Promise<LabelPrintJob> {
    return apiClient.post(\/print-jobs/\/retry\)
  }
}

// 打印机设备API
export const printerApi = {
  // 获取打印机列表
  getPrinters(): Promise<PrinterDevice[]> {
    return apiClient.get('/printers')
  },

  // 测试打印机连接
  testPrinter(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.post(\/printers/\/test\)
  },

  // 更新打印机状态
  updatePrinterStatus(id: string, status: string): Promise<PrinterDevice> {
    return apiClient.put(\/printers/\/status\, { status })
  }
}
