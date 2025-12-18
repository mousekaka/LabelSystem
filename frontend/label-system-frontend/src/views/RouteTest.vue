<template>
  <div class="route-test">
    <h1>路由测试页面</h1>
    <p class="subtitle">测试所有路由是否正常工作</p>
    
    <div class="test-results">
      <h2>路由测试结果</h2>
      
      <div class="route-status">
        <div class="status-item">
          <span class="status-label">当前路由:</span>
          <code class="status-value">{{ currentRoute.path }}</code>
        </div>
        
        <div class="status-item">
          <span class="status-label">路由名称:</span>
          <span class="status-value">{{ currentRoute.name || '未命名' }}</span>
        </div>
        
        <div class="status-item">
          <span class="status-label">组件重复注册警告:</span>
          <span class="status-value" :class="{ 'warning': hasDuplicateWarning }">
            {{ hasDuplicateWarning ? '⚠️ 检测到' : '✅ 未检测到' }}
          </span>
        </div>
      </div>
      
      <div class="route-links">
        <h3>测试所有路由:</h3>
        <div class="link-grid">
          <router-link 
            v-for="route in testRoutes" 
            :key="route.path"
            :to="route.path"
            class="route-link"
            @click="testRoute(route)"
          >
            <div class="link-content">
              <div class="link-icon">
                <i :class="route.icon"></i>
              </div>
              <div class="link-info">
                <div class="link-name">{{ route.name }}</div>
                <div class="link-path">{{ route.path }}</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      
      <div class="debug-info">
        <h3>调试信息</h3>
        <div class="console-simulator">
          <div class="console-header">控制台输出</div>
          <div class="console-content">
            <div class="console-line">🔗 路由跳转: {{ lastNavigation.from }}  {{ lastNavigation.to }}</div>
            <div class="console-line" v-if="duplicateWarnings.length > 0">
              ⚠️ 组件重复注册警告: {{ duplicateWarnings.length }} 个
            </div>
            <div class="console-line" v-else>
              ✅ 无组件重复注册警告
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = ref({
  path: route.path,
  name: route.name,
  fullPath: route.fullPath
})

const hasDuplicateWarning = ref(false)
const duplicateWarnings = ref<string[]>([])
const lastNavigation = ref({ from: '/', to: '/' })

// 监听控制台错误
onMounted(() => {
  const originalWarn = console.warn
  const originalError = console.error
  
  console.warn = function(...args) {
    const message = args.join(' ')
    if (message.includes('has already been registered') || 
        message.includes('AnonymousComponent')) {
      hasDuplicateWarning.value = true
      duplicateWarnings.value.push(message)
    }
    originalWarn.apply(console, args)
  }
  
  console.error = function(...args) {
    const message = args.join(' ')
    if (message.includes('has already been registered')) {
      hasDuplicateWarning.value = true
      duplicateWarnings.value.push(message)
    }
    originalError.apply(console, args)
  }
  
  // 记录初始路由
  currentRoute.value = {
    path: route.path,
    name: route.name,
    fullPath: route.fullPath
  }
})

const testRoutes = [
  { path: '/', name: '首页', icon: 'el-icon-house' },
  { path: '/acceptance-test', name: '验收测试', icon: 'el-icon-check' },
  { path: '/component-demo', name: '组件演示', icon: 'el-icon-monitor' },
  { path: '/label-editor', name: '标签编辑器', icon: 'el-icon-edit' },
  { path: '/print-queue', name: '打印队列', icon: 'el-icon-printer' },
  { path: '/device-status', name: '设备状态', icon: 'el-icon-cpu' },
  { path: '/data-chart', name: '数据图表', icon: 'el-icon-data-analysis' },
  { path: '/router-debug', name: '路由调试', icon: 'el-icon-connection' },
  { path: '/not-exist-test', name: '404测试', icon: 'el-icon-warning' }
]

const testRoute = (routeItem: any) => {
  lastNavigation.value = {
    from: currentRoute.value.path,
    to: routeItem.path
  }
  
  // 更新当前路由信息
  setTimeout(() => {
    currentRoute.value = {
      path: route.path,
      name: route.name,
      fullPath: route.fullPath
    }
  }, 100)
}
</script>

<style scoped lang="scss">
.route-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  h1 {
    color: #303133;
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: #909399;
    margin-bottom: 30px;
    font-size: 16px;
  }
}

.test-results {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  h2 {
    color: #303133;
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #409eff;
  }
}

.route-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .status-label {
      min-width: 150px;
      color: #606266;
      font-weight: 500;
    }
    
    .status-value {
      color: #303133;
      
      &.warning {
        color: #e6a23c;
        font-weight: 600;
      }
    }
    
    code {
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'Consolas', monospace;
      font-size: 14px;
    }
  }
}

.route-links {
  margin-bottom: 30px;
  
  h3 {
    color: #606266;
    margin: 0 0 16px 0;
  }
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.route-link {
  display: block;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
    background: #ecf5ff;
    transform: translateY(-2px);
  }
  
  .link-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .link-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: linear-gradient(135deg, #409eff, #66b1ff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
  }
  
  .link-info {
    .link-name {
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }
    
    .link-path {
      font-size: 12px;
      color: #909399;
      font-family: 'Consolas', monospace;
    }
  }
}

.debug-info {
  h3 {
    color: #606266;
    margin: 0 0 16px 0;
  }
}

.console-simulator {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  
  .console-header {
    background: #2c3e50;
    color: white;
    padding: 10px 16px;
    font-family: 'Consolas', monospace;
    font-size: 14px;
  }
  
  .console-content {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    font-family: 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    
    .console-line {
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
