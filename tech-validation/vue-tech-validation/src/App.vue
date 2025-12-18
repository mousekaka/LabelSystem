<template>
  <div style="padding: 20px;">
    <h1 style="color: #409EFF;">✅ Vue 3 + TypeScript 验证成功！</h1>
    
    <div style="margin: 20px 0; padding: 20px; background: #f0f9ff; border-radius: 8px;">
      <h3>核心框架状态</h3>
      <ul style="list-style: none; padding: 0;">
        <li>✅ Vue 3: 运行正常</li>
        <li>✅ TypeScript: 编译正常</li>
        <li>✅ Vite: 开发服务器正常</li>
      </ul>
    </div>
    
    <div style="margin: 20px 0; padding: 20px; background: #f0f9ff; border-radius: 8px;">
      <h3>Element Plus 验证</h3>
      <button @click="showMessage" style="margin-right: 10px;">原生按钮</button>
      <el-button type="primary" @click="showElementMessage">Element Plus 按钮</el-button>
      <p style="margin-top: 10px;">消息: {{ message }}</p>
    </div>
    
    <div style="margin: 20px 0; padding: 20px; background: #f0f9ff; border-radius: 8px;">
      <h3>环境信息</h3>
      <pre style="background: white; padding: 10px; border-radius: 4px; overflow: auto;">
Node.js: 24.11.1
npm: 11.6.2
Vite: 7.3.0
时间: 15:15:04
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const message = ref('')

const showMessage = () => {
  message.value = '原生按钮点击成功！'
}

const showElementMessage = () => {
  ElMessage.success('Element Plus 按钮点击成功！')
  message.value = 'Element Plus 按钮点击成功！'
}
</script>

<style>
/* 添加一些基本样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
