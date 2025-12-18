<template>
  <div class="acceptance-test">
    <h1>验收测试页面</h1>
    <p class="subtitle">验证路由和组件正常工作</p>
    
    <div class="test-content">
      <div class="card">
        <h3>✅ 路由工作正常</h3>
        <p>您已成功访问验收测试页面，说明路由配置正确。</p>
      </div>
      
      <div class="card">
        <h3>🎨 样式加载正常</h3>
        <p>页面已应用全局样式，说明CSS加载正常。</p>
      </div>
      
      <div class="card">
        <h3>🚀 Vue应用正常运行</h3>
        <p>Vue应用已正确挂载，控制台应该有调试信息。</p>
      </div>
      
      <div class="navigation">
        <h3>🔗 测试其他页面</h3>
        <div class="nav-links">
          <router-link to="/component-demo" class="nav-link">组件演示</router-link>
          <router-link to="/label-editor" class="nav-link">标签编辑器</router-link>
          <router-link to="/print-queue" class="nav-link">打印队列</router-link>
          <router-link to="/device-status" class="nav-link">设备状态</router-link>
          <router-link to="/data-chart" class="nav-link">数据图表</router-link>
          <router-link to="/router-debug" class="nav-link">路由调试</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('✅ 验收测试页面已加载')
  console.log('📊 页面状态：正常')
  console.log('🔗 路由工作：正常')
})
</script>

<style scoped lang="scss">
.acceptance-test {
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

.test-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #409eff;
  
  h3 {
    color: #303133;
    margin-bottom: 12px;
    font-size: 20px;
  }
  
  p {
    color: #606266;
    line-height: 1.6;
  }
}

.navigation {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: #303133;
    margin-bottom: 20px;
    font-size: 20px;
  }
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.nav-link {
  display: inline-block;
  padding: 10px 20px;
  background: #ecf5ff;
  color: #409eff;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid #409eff;
  transition: all 0.3s;
  font-weight: 500;
  
  &:hover {
    background: #409eff;
    color: white;
    transform: translateY(-2px);
  }
}
</style>
