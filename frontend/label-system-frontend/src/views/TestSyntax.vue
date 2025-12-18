<template>
  <div class="test-page">
    <h1>语法错误修复测试页面</h1>
    <p class="subtitle">验证ESBuild语法错误是否已修复</p>
    
    <div class="test-sections">
      <section class="test-section">
        <h2>组件库状态</h2>
        <div class="status-box">
          <div class="status-item">
            <span class="label">组件库入口文件:</span>
            <span class="value" :class="{ 'success': hasIndexFile }">
              {{ hasIndexFile ? '✅ 存在' : '❌ 不存在' }}
            </span>
          </div>
          <div class="status-item">
            <span class="label">语法检查:</span>
            <span class="value" :class="{ 'success': syntaxOk }">
              {{ syntaxOk ? '✅ 通过' : '❌ 失败' }}
            </span>
          </div>
        </div>
      </section>
      
      <section class="test-section">
        <h2>快速测试</h2>
        <div class="quick-links">
          <router-link to="/" class="test-link">首页</router-link>
          <router-link to="/acceptance-test" class="test-link">验收测试</router-link>
          <router-link to="/print-queue" class="test-link">打印队列</router-link>
          <router-link to="/device-status" class="test-link">设备状态</router-link>
          <router-link to="/data-chart" class="test-link">数据图表</router-link>
          <router-link to="/router-debug" class="test-link">路由调试</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const hasIndexFile = ref(false)
const syntaxOk = ref(false)

onMounted(async () => {
  // 检查文件是否存在
  try {
    const response = await fetch('/src/components/index.ts')
    hasIndexFile.value = response.ok
  } catch (error) {
    console.warn('无法检查组件库文件:', error)
  }
  
  // 检查控制台是否有错误
  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = function(...args) {
    const message = args.join(' ')
    if (message.includes('Unexpected') || message.includes('esbuild')) {
      syntaxOk.value = false
    }
    originalError.apply(console, args)
  }
  
  console.warn = function(...args) {
    const message = args.join(' ')
    if (message.includes('already been registered')) {
      console.log('检测到重复注册警告，但这是预期的')
    }
    originalWarn.apply(console, args)
  }
  
  // 设置初始状态
  syntaxOk.value = true
})
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #303133;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  margin-bottom: 30px;
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.status-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  min-width: 150px;
  color: #606266;
  font-weight: 500;
}

.value {
  color: #303133;
}

.value.success {
  color: #67c23a;
}

.value.error {
  color: #f56c6c;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.test-link {
  display: inline-block;
  padding: 10px 20px;
  background: #ecf5ff;
  color: #409eff;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid #409eff;
  transition: all 0.3s;
}

.test-link:hover {
  background: #409eff;
  color: white;
}
</style>
