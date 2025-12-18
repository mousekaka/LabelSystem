<template>
  <transition name="dialog-fade">
    <div v-if="modelValue" class="dialog-overlay" @click.self="handleOverlayClick">
      <div class="dialog" :style="{ width: width }">
        <div class="dialog__header">
          <h3 class="dialog__title">{{ title }}</h3>
          <button class="dialog__close" @click="closeDialog">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="dialog__body">
          <slot />
        </div>
        
        <div v-if="showFooter" class="dialog__footer">
          <slot name="footer">
            <div class="dialog__actions">
              <button 
                v-if="showCancel" 
                class="dialog__btn dialog__btn--cancel" 
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button 
                v-if="showConfirm" 
                class="dialog__btn dialog__btn--confirm" 
                @click="handleConfirm"
                :loading="confirmLoading"
                :disabled="confirmDisabled"
              >
                {{ confirmText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  showFooter?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  confirmLoading?: boolean
  confirmDisabled?: boolean
  closeOnClickOverlay?: boolean
  closeOnPressEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '500px',
  showFooter: true,
  showCancel: true,
  showConfirm: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmLoading: false,
  confirmDisabled: false,
  closeOnClickOverlay: true,
  closeOnPressEscape: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (props.closeOnPressEscape && event.key === 'Escape') {
    closeDialog()
  }
}

// 监听弹窗状态
watch(() => props.modelValue, (value) => {
  if (value) {
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeydown)
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    // 移除键盘事件监听
    document.removeEventListener('keydown', handleKeydown)
    // 恢复背景滚动
    document.body.style.overflow = ''
  }
})

// 关闭弹窗
const closeDialog = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 处理遮罩层点击
const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    closeDialog()
  }
}

// 处理取消按钮
const handleCancel = () => {
  emit('cancel')
  closeDialog()
}

// 处理确认按钮
const handleConfirm = () => {
  emit('confirm')
}

// 暴露方法给父组件
defineExpose({
  closeDialog,
  handleCancel,
  handleConfirm
})
</script>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlay-fade-in 0.3s;
}

.dialog {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: dialog-slide-in 0.3s;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  &__close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 4px;
    color: #909399;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
      color: #303133;
    }
  }
  
  &__body {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    max-height: 60vh;
  }
  
  &__footer {
    padding: 16px 24px;
    border-top: 1px solid #e4e7ed;
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  &__btn {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    
    &--cancel {
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      color: #606266;
      
      &:hover {
        border-color: #c0c4cc;
        color: #303133;
      }
    }
    
    &--confirm {
      background-color: #409eff;
      color: #ffffff;
      
      &:hover {
        background-color: #66b1ff;
      }
      
      &:disabled {
        background-color: #a0cfff;
        cursor: not-allowed;
      }
      
      &[loading] {
        position: relative;
        color: transparent;
        
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
      }
    }
  }
}

// 动画效果
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
