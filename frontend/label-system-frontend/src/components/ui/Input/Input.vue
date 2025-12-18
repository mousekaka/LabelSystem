<template>
  <div class="label-input" :class="{'label-input--disabled': disabled}">
    <div v-if="label" class="label-input__label">{{ label }}</div>
    
    <div class="label-input__wrapper">
      <input
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :class="{'label-input__input--error': hasError}"
        class="label-input__input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <button
        v-if="clearable && modelValue && !disabled"
        class="label-input__clear"
        @click="handleClear"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      
      <div v-if="showLength" class="label-input__length">
        {{ currentLength }}/{{ maxlength }}
      </div>
    </div>
    
    <div v-if="errorMessage" class="label-input__error">{{ errorMessage }}</div>
    
    <div v-if="helpText" class="label-input__help">{{ helpText }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface InputProps {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email' | 'tel'
  disabled?: boolean
  clearable?: boolean
  maxlength?: number
  errorMessage?: string
  helpText?: string
  showLength?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  disabled: false,
  clearable: false,
  showLength: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement>()

const currentLength = computed(() => props.modelValue.length)
const hasError = computed(() => !!props.errorMessage)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 暴露方法给父组件
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style scoped lang="scss">
.label-input {
  margin-bottom: 16px;
  width: 100%;
  
  &__label {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
  
  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  &__input {
    flex: 1;
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #303133;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    transition: border-color 0.3s, box-shadow 0.3s;
    outline: none;
    
    &:hover {
      border-color: #c0c4cc;
    }
    
    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
    
    &--error {
      border-color: #f56c6c;
      
      &:hover,
      &:focus {
        border-color: #f56c6c;
      }
      
      &:focus {
        box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
      }
    }
    
    &:disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
    
    &::placeholder {
      color: #c0c4cc;
    }
  }
  
  &__clear {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #c0c4cc;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: #909399;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  &__length {
    position: absolute;
    right: 10px;
    font-size: 12px;
    color: #909399;
    user-select: none;
  }
  
  &__error {
    margin-top: 4px;
    font-size: 12px;
    color: #f56c6c;
  }
  
  &__help {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
  }
  
  &--disabled &__input {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
</style>

