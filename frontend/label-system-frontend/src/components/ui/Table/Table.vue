<template>
  <div class="label-table" :class="{'label-table--loading': loading}">
    <div v-if="loading" class="label-table__loading">
      <div class="label-table__loading-spinner"></div>
      <span>加载中...</span>
    </div>
    
    <div class="label-table__wrapper">
      <table class="label-table__table" :style="{ height: height ? height + 'px' : 'auto' }">
        <thead class="label-table__thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.prop"
              :style="{ width: column.width ? column.width + 'px' : 'auto' }"
              class="label-table__th"
              :class="{
                'label-table__th--sortable': column.sortable,
                'label-table__th--sort-asc': column.prop === sortBy && sortOrder === 'asc',
                'label-table__th--sort-desc': column.prop === sortBy && sortOrder === 'desc'
              }"
              @click="handleSort(column)"
            >
              <div class="label-table__th-content">
                <span class="label-table__th-label">{{ column.label }}</span>
                <span v-if="column.sortable" class="label-table__th-sort">
                  <svg class="label-table__th-sort-icon" viewBox="0 0 24 24" width="12" height="12">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody class="label-table__tbody">
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="rowIndex"
            class="label-table__tr"
            :class="{
              'label-table__tr--striped': stripe && rowIndex % 2 === 1,
              'label-table__tr--hoverable': !loading
            }"
            @click="handleRowClick(row)"
          >
            <td
              v-for="column in columns"
              :key="column.prop"
              class="label-table__td"
            >
              <div class="label-table__td-content">
                <slot :name="column.prop" :row="row" :value="getCellValue(row, column)">
                  {{ getCellValue(row, column) }}
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="paginatedData.length === 0" class="label-table__empty">
        <div class="label-table__empty-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="#c0c4cc" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
          </svg>
        </div>
        <p class="label-table__empty-text">暂无数据</p>
      </div>
    </div>
    
    <div v-if="showPagination" class="label-table__pagination">
      <div class="label-table__pagination-info">
        显示 {{ startIndex + 1 }} 到 {{ endIndex }} 条，共 {{ data.length }} 条
      </div>
      
      <div class="label-table__pagination-controls">
        <button
          class="label-table__pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="label-table__pagination-pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="label-table__pagination-page"
            :class="{'label-table__pagination-page--active': page === currentPage}"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          class="label-table__pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumn, TableProps } from '../../types'

interface Props extends TableProps {
  pageSize?: number
  currentPage?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  border: true,
  stripe: true,
  pageSize: 10,
  currentPage: 1,
  showPagination: true
})

const emit = defineEmits<{
  (e: 'row-click', row: any): void
  (e: 'sort', column: string, order: 'asc' | 'desc'): void
  (e: 'page-change', page: number): void
}>()

const sortBy = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(props.currentPage)

// 处理排序
const handleSort = (column: TableColumn) => {
  if (!column.sortable) return
  
  if (sortBy.value === column.prop) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column.prop
    sortOrder.value = 'asc'
  }
  
  emit('sort', column.prop, sortOrder.value)
}

// 获取单元格值
const getCellValue = (row: any, column: TableColumn) => {
  const value = row[column.prop]
  if (column.formatter) {
    return column.formatter(row, column, value)
  }
  return value
}

// 处理行点击
const handleRowClick = (row: any) => {
  if (!props.loading) {
    emit('row-click', row)
  }
}

// 分页相关计算
const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.pageSize)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.data.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * props.pageSize
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * props.pageSize, props.data.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, currentPage.value + 2)
    
    if (currentPage.value <= 3) {
      end = maxVisible
    } else if (currentPage.value >= totalPages.value - 2) {
      start = totalPages.value - maxVisible + 1
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  
  currentPage.value = page
  emit('page-change', page)
}

// 监听外部传入的当前页码
watch(() => props.currentPage, (value) => {
  currentPage.value = value
})
</script>

<style scoped lang="scss">
.label-table {
  position: relative;
  width: 100%;
  
  &--loading &__wrapper {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
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
      margin-bottom: 10px;
    }
    
    span {
      font-size: 14px;
      color: #606266;
    }
  }
  
  &__wrapper {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    background-color: #ffffff;
  }
  
  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  &__thead {
    background-color: #fafafa;
  }
  
  &__th {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    text-align: left;
    border-bottom: 1px solid #e4e7ed;
    cursor: default;
    
    &--sortable {
      cursor: pointer;
      
      &:hover {
        background-color: #f5f7fa;
      }
    }
    
    &--sort-asc &__sort-icon,
    &--sort-desc &__sort-icon {
      opacity: 1;
    }
    
    &--sort-asc &__sort-icon {
      transform: rotate(180deg);
    }
    
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    &-sort {
      display: flex;
      align-items: center;
    }
    
    &-sort-icon {
      opacity: 0.3;
      transition: opacity 0.3s, transform 0.3s;
    }
  }
  
  &__tbody {
    .label-table__tr {
      border-bottom: 1px solid #e4e7ed;
      transition: background-color 0.3s;
      
      &:last-child {
        border-bottom: none;
      }
      
      &--striped {
        background-color: #fafafa;
      }
      
      &--hoverable:hover {
        background-color: #f5f7fa;
        cursor: pointer;
      }
    }
  }
  
  &__td {
    padding: 12px 16px;
    font-size: 14px;
    color: #606266;
    border-bottom: 1px solid #e4e7ed;
    
    &-content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  &__empty {
    padding: 60px 0;
    text-align: center;
    
    &-icon {
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    &-text {
      font-size: 14px;
      color: #909399;
    }
  }
  
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    
    &-info {
      font-size: 14px;
      color: #606266;
    }
    
    &-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    &-btn {
      padding: 8px 16px;
      font-size: 14px;
      color: #606266;
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover:not(:disabled) {
        border-color: #c0c4cc;
        color: #303133;
      }
      
      &:disabled {
        color: #c0c4cc;
        cursor: not-allowed;
      }
    }
    
    &-pages {
      display: flex;
      gap: 4px;
    }
    
    &-page {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      font-size: 14px;
      color: #606266;
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #c0c4cc;
        color: #303133;
      }
      
      &--active {
        background-color: #409eff;
        border-color: #409eff;
        color: #ffffff;
        
        &:hover {
          background-color: #66b1ff;
          border-color: #66b1ff;
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
