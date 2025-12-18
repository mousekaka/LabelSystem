<template>
  <div class="data-chart">
    <div class="data-chart__header">
      <h2 class="data-chart__title">数据统计图表</h2>
      <div class="data-chart__controls">
        <select class="data-chart__select" v-model="timeRange">
          <option value="day">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="year">今年</option>
        </select>
      </div>
    </div>
    
    <div class="data-chart__content">
      <p class="data-chart__placeholder">数据图表组件 - 开发中</p>
      <p>这里将显示打印量、设备使用率等统计图表</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const timeRange = ref('day')
</script>

<style scoped lang="scss">
.data-chart {
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
  
  &__controls {
    .data-chart__select {
      padding: 8px 16px;
      font-size: 14px;
      color: #606266;
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      cursor: pointer;
      
      &:focus {
        outline: none;
        border-color: #409eff;
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
