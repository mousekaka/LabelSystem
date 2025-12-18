<template>
  <div class="router-debug">
    <h1>路由调试页面</h1>
    <p class="subtitle">调试和监控Vue Router状态</p>
    
    <div class="debug-content">
      <div class="debug-section">
        <h3>📊 当前路由状态</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">路径：</span>
            <code class="info-value">{{ currentRoute.path }}</code>
          </div>
          <div class="info-item">
            <span class="info-label">名称：</span>
            <span class="info-value">{{ currentRoute.name || '未命名' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">完整路径：</span>
            <code class="info-value">{{ currentRoute.fullPath }}</code>
          </div>
          <div class="info-item">
            <span class="info-label">参数：</span>
            <span class="info-value">{{ JSON.stringify(currentRoute.params) }}</span>
          </div>
        </div>
      </div>
      
      <div class="debug-section">
        <h3>🔗 可用路由</h3>
        <div class="routes-list">
          <div v-for="route in availableRoutes" :key="route.path" class="route-item">
            <div class="route-info">
              <div class="route-name">{{ route.name }}</div>
              <code class="route-path">{{ route.path }}</code>
            </div>
            <router-link :to="route.path" class="route-link">
              访问 
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="debug-section">
        <h3>🛠️ 调试工具</h3>
        <div class="tool-buttons">
          <button @click="checkRouter()" class="tool-btn">检查路由实例</button>
          <button @click="clearConsole()" class="tool-btn">清空控制台</button>
          <button @click="testNavigation()" class="tool-btn">测试导航</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => ({
  path: route.path,
  name: route.name,
  fullPath: route.fullPath,
  params: route.params
}))

const availableRoutes = [
  { path: '/', name: '首页' },
  { path: '/acceptance-test', name: '验收测试' },
  { path: '/component-demo', name: '组件演示' },
  { path: '/label-editor', name: '标签编辑器' },
  { path: '/print-queue', name: '打印队列' },
  { path: '/device-status', name: '设备状态' },
  { path: '/data-chart', name: '数据图表' },
  { path: '/router-debug', name: '路由调试' }
]

const checkRouter = () => {
  console.log('=== 路由检查 ===')
  console.log('Vue Router实例:', window.__VUE_ROUTER__ ? '✅ 存在' : '❌ 不存在')
  console.log('当前路由:', route)
}

const clearConsole = () => {
  console.clear()
  console.log('控制台已清空')
}

const testNavigation = () => {
  console.log('测试导航...')
  // 可以添加导航测试逻辑
}
</script>

<style scoped lang="scss">
.router-debug {
  max-width: 1000px;
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

.debug-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.debug-section {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  
  .info-label {
    min-width: 80px;
    color: #606266;
    font-weight: 500;
  }
  
  .info-value {
    color: #303133;
    word-break: break-all;
  }
  
  code {
    font-family: 'Consolas', monospace;
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.route-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: #ecf5ff;
  }
  
  .route-info {
    .route-name {
      color: #303133;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .route-path {
      color: #909399;
      font-size: 13px;
      font-family: 'Consolas', monospace;
    }
  }
  
  .route-link {
    padding: 8px 16px;
    background: #409eff;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
      background: #66b1ff;
    }
  }
}

.tool-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.tool-btn {
  padding: 12px 24px;
  background: #ecf5ff;
  color: #409eff;
  border: 2px solid #409eff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #409eff;
    color: white;
  }
}
</style>
