<template>
  <div class="label-card" :class="[
    `label-card--${type}`,
    {
      'label-card--shadow': shadow,
      'label-card--bordered': bordered,
      'label-card--loading': loading,
      'label-card--clickable': clickable
    }
  ]" @click="handleClick">
    <div v-if="loading" class="label-card__loading">
      <div class="label-card__loading-spinner"></div>
    </div>
    
    <div v-if="$slots.header || title" class="label-card__header">
      <slot name="header">
        <div class="label-card__header-content">
          <h3 v-if="title" class="label-card__title">{{ title }}</h3>
          <span v-if="subtitle" class="label-card__subtitle">{{ subtitle }}</span>
        </div>
      </slot>
      
      <div v-if="$slots['header-action']" class="label-card__header-action">
        <slot name="header-action" />
      </div>
    </div>
    
    <div class="label-card__body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="label-card__footer">
      <slot name="footer" />
    </div>
    
    <div v-if="hasAction" class="label-card__action-overlay">
      <div class="label-card__action-content">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  shadow?: boolean
  bordered?: boolean
  loading?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  shadow: true,
  bordered: true,
  loading: false,
  clickable: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()
const hasAction = computed(() => !!slots.action)

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.label-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  
  &--default {
    background-color: #ffffff;
    border-color: #e4e7ed;
  }
  
  &--primary {
    background-color: #ecf5ff;
    border-color: #409eff;
  }
  
  &--success {
    background-color: #f0f9eb;
    border-color: #67c23a;
  }
  
  &--warning {
    background-color: #fdf6ec;
    border-color: #e6a23c;
  }
  
  &--danger {
    background-color: #fef0f0;
    border-color: #f56c6c;
  }
  
  &--info {
    background-color: #f4f4f5;
    border-color: #909399;
  }
  
  &--shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  &--bordered {
    border: 1px solid;
  }
  
  &--loading {
    pointer-events: none;
    
    .label-card__body {
      opacity: 0.6;
    }
  }
  
  &--clickable {
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
  
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 10;
    
    &-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #409eff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid;
    border-color: inherit;
    
    &-content {
      flex: 1;
    }
    
    &-action {
      margin-left: 12px;
    }
  }
  
  &__title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  &__subtitle {
    font-size: 14px;
    color: #909399;
  }
  
  &__body {
    padding: 24px;
  }
  
  &__footer {
    padding: 16px 24px;
    border-top: 1px solid;
    border-color: inherit;
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &__action-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 1;
    }
  }
  
  &__action-content {
    display: flex;
    gap: 8px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
