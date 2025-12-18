<template>
  <div class="print-queue">
    <div class="print-queue__header">
      <h2 class="print-queue__title">打印任务队列</h2>
      <div class="print-queue__actions">
        <button class="print-queue__action-btn" @click="refreshQueue">
          <i class="el-icon-refresh"></i>
          <span>刷新</span>
        </button>
        <button class="print-queue__action-btn print-queue__action-btn--primary" @click="createPrintJob">
          <i class="el-icon-plus"></i>
          <span>新建任务</span>
        </button>
      </div>
    </div>
    
    <div class="print-queue__content">
      <p class="print-queue__placeholder">打印任务队列组件 - 开发中</p>
      <p>这里将显示待打印的任务列表和打印状态</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const refreshQueue = () => {
  console.log('刷新打印队列')
}

const createPrintJob = () => {
  console.log('创建新打印任务')
}
</script>

<style scoped lang="scss">
.print-queue {
  padding: 20px;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  
  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
  
  &__actions {
    display: flex;
    gap: 12px;
  }
  
  &__action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 14px;
    color: #606266;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #c0c4cc;
      color: #303133;
    }
    
    &--primary {
      background-color: #409eff;
      color: #ffffff;
      border-color: #409eff;
      
      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }
  }
  
  &__content {
    padding: 40px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
  }
  
  &__placeholder {
    font-size: 18px;
    color: #409eff;
    margin-bottom: 16px;
  }
}
</style>
