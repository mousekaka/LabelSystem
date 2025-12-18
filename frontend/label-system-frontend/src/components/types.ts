// src/components/types.ts - 组件类型定义
export interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  icon?: string
}

export interface InputProps {
  modelValue: string
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email'
  disabled?: boolean
  clearable?: boolean
  maxlength?: number
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  modelValue: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
}

export interface TableColumn {
  prop: string
  label: string
  width?: number
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any) => string
}

export interface TableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  height?: number
  border?: boolean
  stripe?: boolean
}

export interface LabelTemplate {
  id: string
  name: string
  width: number
  height: number
  fields: LabelField[]
  createdAt: Date
}

export interface LabelField {
  id: string
  type: 'text' | 'barcode' | 'qrcode' | 'image'
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontFamily?: string
}

export interface PrintJob {
  id: string
  templateId: string
  status: 'pending' | 'printing' | 'completed' | 'failed'
  copies: number
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export interface DeviceStatus {
  id: string
  name: string
  type: 'printer' | 'scanner'
  status: 'online' | 'offline' | 'error'
  ip: string
  lastHeartbeat: Date
  printCount: number
}
