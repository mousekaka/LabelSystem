<template>
  <button
    :class="[
      'label-button',
      `label-button--${type}`,
      `label-button--${size}`,
      {
        'label-button--loading': loading,
        'label-button--disabled': disabled
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="label-button__loading">
      <svg class="label-button__loading-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke-width="2" stroke="currentColor"/>
      </svg>
    </span>
    <span v-if="icon" class="label-button__icon">
      <i :class="icon"></i>
    </span>
    <span class="label-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">


// 定义Props
interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  icon?: string
}

// 设置默认值
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  loading: false,
  disabled: false,
  icon: ''
})

// 定义事件
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.label-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  outline: none;
  
  &--small {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  &--default {
    background-color: #ffffff;
    border-color: #dcdfe6;
    color: #606266;
    
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
    
    &:active {
      border-color: #337ecc;
      color: #337ecc;
    }
  }
  
  &--primary {
    background-color: #409eff;
    border-color: #409eff;
    color: #ffffff;
    
    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
    
    &:active {
      background-color: #337ecc;
      border-color: #337ecc;
    }
  }
  
  &--success {
    background-color: #67c23a;
    border-color: #67c23a;
    color: #ffffff;
    
    &:hover {
      background-color: #85ce61;
      border-color: #85ce61;
    }
    
    &:active {
      background-color: #529b2e;
      border-color: #529b2e;
    }
  }
  
  &--warning {
    background-color: #e6a23c;
    border-color: #e6a23c;
    color: #ffffff;
    
    &:hover {
      background-color: #ebb563;
      border-color: #ebb563;
    }
    
    &:active {
      background-color: #c28a33;
      border-color: #c28a33;
    }
  }
  
  &--danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: #ffffff;
    
    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
    
    &:active {
      background-color: #c45656;
      border-color: #c45656;
    }
  }
  
  &--info {
    background-color: #909399;
    border-color: #909399;
    color: #ffffff;
    
    &:hover {
      background-color: #a6a9ad;
      border-color: #a6a9ad;
    }
    
    &:active {
      background-color: #74767a;
      border-color: #74767a;
    }
  }
  
  &--loading {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &__loading {
    display: inline-flex;
    margin-right: 6px;
    
    &-icon {
      width: 14px;
      height: 14px;
      animation: rotate 1s linear infinite;
      
      circle {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-linecap: round;
      }
    }
  }
  
  &__icon {
    margin-right: 6px;
    display: inline-flex;
    align-items: center;
  }
  
  &__content {
    display: inline-flex;
    align-items: center;
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

