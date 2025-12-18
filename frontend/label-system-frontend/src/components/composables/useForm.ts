// src/components/composables/useForm.ts
import { ref, reactive, computed, watch, type Ref } from 'vue'

export interface FormField<T = any> {
  value: T
  required?: boolean
  validator?: (value: T) => string | true
  error?: string
  touched?: boolean
  dirty?: boolean
}

export interface FormOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  options: FormOptions = {}
) {
  const { validateOnChange = true, validateOnBlur = true } = options

  // 表单字段
  const fields = reactive(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = reactive<FormField>({
        value: initialValues[key],
        required: false,
        error: '',
        touched: false,
        dirty: false
      })
      return acc
    }, {} as Record<string, FormField>)
  )

  // 表单值
  const values = computed(() => {
    return Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key].value
      return acc
    }, {} as T)
  })

  // 表单是否有效
  const isValid = computed(() => {
    return Object.values(fields).every(field => !field.error)
  })

  // 表单是否被修改
  const isDirty = computed(() => {
    return Object.values(fields).some(field => field.dirty)
  })

  // 设置字段验证规则
  const setValidation = (fieldName: keyof T, rules: Partial<Omit<FormField, 'value'>>) => {
    const field = fields[fieldName as string]
    if (field) {
      Object.assign(field, rules)
    }
  }

  // 验证单个字段
  const validateField = (fieldName: keyof T): boolean => {
    const field = fields[fieldName as string]
    if (!field) return true

    let error = ''

    // 检查必填
    if (field.required && (field.value === undefined || field.value === null || field.value === '')) {
      error = '此字段为必填项'
    }

    // 自定义验证
    if (!error && field.validator) {
      const result = field.validator(field.value)
      if (typeof result === 'string') {
        error = result
      }
    }

    field.error = error
    return !error
  }

  // 验证所有字段
  const validate = (): boolean => {
    let valid = true
    Object.keys(fields).forEach(key => {
      if (!validateField(key as keyof T)) {
        valid = false
      }
    })
    return valid
  }

  // 重置表单
  const reset = () => {
    Object.keys(fields).forEach(key => {
      const field = fields[key]
      field.value = initialValues[key as keyof T]
      field.error = ''
      field.touched = false
      field.dirty = false
    })
  }

  // 字段变更处理器
  const handleFieldChange = (fieldName: keyof T, value: any) => {
    const field = fields[fieldName as string]
    if (field) {
      field.value = value
      field.dirty = true

      if (validateOnChange) {
        validateField(fieldName)
      }
    }
  }

  // 字段失焦处理器
  const handleFieldBlur = (fieldName: keyof T) => {
    const field = fields[fieldName as string]
    if (field) {
      field.touched = true

      if (validateOnBlur) {
        validateField(fieldName)
      }
    }
  }

  // 获取字段错误信息
  const getFieldError = (fieldName: keyof T): string => {
    const field = fields[fieldName as string]
    return field?.error || ''
  }

  // 表单提交
  const handleSubmit = async (callback: (values: T) => Promise<void> | void) => {
    if (!validate()) {
      return
    }

    try {
      await callback(values.value)
    } catch (error) {
      console.error('表单提交失败:', error)
      // 可以在这里处理提交错误
    }
  }

  return {
    // 响应式数据
    fields,
    values,
    isValid,
    isDirty,

    // 方法
    setValidation,
    validateField,
    validate,
    reset,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    handleSubmit
  }
}

// 使用示例类型
export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export function useLoginForm() {
  const form = useForm<LoginForm>({
    username: '',
    password: '',
    remember: false
  })

  // 设置验证规则
  form.setValidation('username', {
    required: true,
    validator: (value: string) => {
      if (value.length < 3) {
        return '用户名至少需要3个字符'
      }
      return true
    }
  })

  form.setValidation('password', {
    required: true,
    validator: (value: string) => {
      if (value.length < 6) {
        return '密码至少需要6个字符'
      }
      return true
    }
  })

  return form
}
