<template>
  <div class="label-select" :class="{'label-select--disabled': disabled}">
    <div v-if="label" class="label-select__label">{{ label }}</div>
    
    <div class="label-select__wrapper">
      <div
        class="label-select__trigger"
        :class="{
          'label-select__trigger--open': dropdownVisible,
          'label-select__trigger--error': hasError,
          'label-select__trigger--disabled': disabled
        }"
        @click="toggleDropdown"
      >
        <div class="label-select__value">
          <span v-if="selectedOption" class="label-select__value-text">
            {{ selectedOption.label }}
          </span>
          <span v-else class="label-select__placeholder">
            {{ placeholder || '请选择' }}
          </span>
        </div>
        
        <div class="label-select__arrow">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
      </div>
      
      <div
        v-if="dropdownVisible"
        class="label-select__dropdown"
        :style="dropdownStyle"
        @click.stop
      >
        <div v-if="filterable" class="label-select__filter">
          <input
            ref="filterInputRef"
            v-model="filterText"
            class="label-select__filter-input"
            placeholder="搜索..."
            @keydown.esc="closeDropdown"
            @keydown.enter="selectFirstFiltered"
          />
        </div>
        
        <div class="label-select__options" ref="optionsRef">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="label-select__option"
            :class="{
              'label-select__option--selected': isSelected(option),
              'label-select__option--disabled': option.disabled
            }"
            @click="selectOption(option)"
          >
            <span class="label-select__option-label">{{ option.label }}</span>
            <span v-if="isSelected(option)" class="label-select__option-check">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
          </div>
          
          <div v-if="filteredOptions.length === 0" class="label-select__no-data">
            暂无数据
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="errorMessage" class="label-select__error">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  filterable?: boolean
  clearable?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  filterable: false,
  clearable: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
  (e: 'clear'): void
}>()

const dropdownVisible = ref(false)
const filterText = ref('')
const filterInputRef = ref<HTMLInputElement>()
const optionsRef = ref<HTMLDivElement>()
const dropdownStyle = ref({})

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue) || null
})

const filteredOptions = computed(() => {
  if (!filterText.value) return props.options
  
  return props.options.filter(option =>
    option.label.toLowerCase().includes(filterText.value.toLowerCase())
  )
})

const hasError = computed(() => !!props.errorMessage)

const isSelected = (option: SelectOption) => {
  return option.value === props.modelValue
}

const toggleDropdown = () => {
  if (props.disabled) return
  
  dropdownVisible.value = !dropdownVisible.value
  
  if (dropdownVisible.value) {
    nextTick(() => {
      if (props.filterable && filterInputRef.value) {
        filterInputRef.value.focus()
      }
      positionDropdown()
    })
  } else {
    filterText.value = ''
  }
}

const closeDropdown = () => {
  dropdownVisible.value = false
  filterText.value = ''
}

const positionDropdown = () => {
  // 这里可以添加定位逻辑
  dropdownStyle.value = {
    top: '100%',
    left: '0',
    right: '0'
  }
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return
  
  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeDropdown()
}

const selectFirstFiltered = () => {
  if (filteredOptions.value.length > 0 && !filteredOptions.value[0].disabled) {
    selectOption(filteredOptions.value[0])
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.label-select')) {
    closeDropdown()
  }
}

// 点击外部关闭下拉框
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法给父组件
defineExpose({
  focus: () => {
    if (!props.disabled) {
      dropdownVisible.value = true
      nextTick(() => {
        if (props.filterable && filterInputRef.value) {
          filterInputRef.value.focus()
        }
      })
    }
  },
  blur: () => {
    closeDropdown()
  }
})
</script>

<style scoped lang="scss">
.label-select {
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
  }
  
  &__trigger {
    position: relative;
    height: 36px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.3s, box-shadow 0.3s;
    user-select: none;
    
    &:hover {
      border-color: #c0c4cc;
    }
    
    &--open {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
    
    &--error {
      border-color: #f56c6c;
      
      &:hover,
      &--open {
        border-color: #f56c6c;
      }
      
      &--open {
        box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
      }
    }
    
    &--disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  
  &__value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    &-text {
      color: #303133;
    }
  }
  
  &__placeholder {
    color: #c0c4cc;
  }
  
  &__arrow {
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: #c0c4cc;
    transition: transform 0.3s;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  &__trigger--open &__arrow {
    transform: rotate(180deg);
  }
  
  &__dropdown {
    position: absolute;
    z-index: 1000;
    margin-top: 4px;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 100%;
    max-height: 200px;
    overflow: hidden;
    animation: dropdown-slide-in 0.2s;
  }
  
  &__filter {
    padding: 8px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  &__filter-input {
    width: 100%;
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
    color: #303133;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
    
    &:focus {
      border-color: #409eff;
    }
  }
  
  &__options {
    max-height: 160px;
    overflow-y: auto;
  }
  
  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    font-size: 14px;
    color: #303133;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    &--selected {
      background-color: #ecf5ff;
      color: #409eff;
      font-weight: 500;
    }
    
    &--disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      
      &:hover {
        background-color: transparent;
      }
    }
    
    &-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    &-check {
      display: flex;
      align-items: center;
      color: #409eff;
    }
  }
  
  &__no-data {
    padding: 16px;
    text-align: center;
    font-size: 14px;
    color: #909399;
  }
  
  &__error {
    margin-top: 4px;
    font-size: 12px;
    color: #f56c6c;
  }
}

@keyframes dropdown-slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
