<template>
  <div class="not-found">
    <div class="error-container">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">您访问的页面不存在或已被移除。</p>
      
      <div class="error-actions">
        <router-link to="/acceptance-test" class="action-btn primary">
          返回首页
        </router-link>
        <button @click="$router.go(-1)" class="action-btn">
          返回上一页
        </button>
      </div>
      
      <div class="error-details" v-if="errorInfo">
        <p><strong>错误路径：</strong> {{ errorInfo.path }}</p>
        <p><strong>完整路径：</strong> {{ errorInfo.fullPath }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const errorInfo = computed(() => ({
  path: route.path,
  fullPath: route.fullPath,
  params: route.params
}))
</script>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #f56c6c;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 32px;
  color: #303133;
  margin-bottom: 16px;
}

.error-message {
  color: #909399;
  font-size: 16px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 30px;
}

.action-btn {
  padding: 12px 28px;
  border: 2px solid #409eff;
  background: white;
  color: #409eff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background: #409eff;
    color: white;
    transform: translateY(-2px);
  }
  
  &.primary {
    background: #409eff;
    color: white;
    
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
    }
  }
}

.error-details {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  text-align: left;
  
  p {
    margin-bottom: 8px;
    color: #606266;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    strong {
      color: #303133;
      min-width: 100px;
      display: inline-block;
    }
  }
}
</style>
