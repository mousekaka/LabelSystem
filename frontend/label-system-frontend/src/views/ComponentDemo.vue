<template>
  <div class="component-demo">
    <h1>组件演示页面</h1>
    <p class="subtitle">展示系统组件的功能演示</p>
    
    <div class="demo-content">
      <div class="section">
        <h3>📋 页面信息</h3>
        <div class="info-card">
          <p><strong>页面名称：</strong>组件演示</p>
          <p><strong>路由路径：</strong> /component-demo</p>
          <p><strong>状态：</strong> <span class="status-success">正常</span></p>
        </div>
      </div>
      
      <div class="navigation">
        <router-link to="/acceptance-test" class="back-link"> 返回验收测试</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('✅ 组件演示页面已加载')
})
</script>

<style scoped lang="scss">
.component-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  
  h1 {
    color: #303133;
    margin-bottom: 12px;
    font-size: 32px;
  }
  
  .subtitle {
    color: #909399;
    margin-bottom: 40px;
    font-size: 18px;
  }
}

.demo-content {
  .section {
    margin-bottom: 32px;
    
    h3 {
      color: #303133;
      margin-bottom: 16px;
      font-size: 20px;
    }
  }
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  p {
    margin-bottom: 12px;
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

.status-success {
  color: #67c23a;
  background: #f0f9eb;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.navigation {
  margin-top: 32px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background: white;
  color: #606266;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
  font-weight: 500;
  
  &:hover {
    background: #f5f7fa;
    border-color: #409eff;
    color: #409eff;
  }
}
</style>
