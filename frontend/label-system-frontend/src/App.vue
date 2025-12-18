<template>
  <div id="app">
    <!-- 路由视图容器 -->
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p>正在加载页面...</p>
            </div>
          </template>
        </Suspense>
      </template>
      <div v-else class="error-container">
        <h2>❌ 页面加载失败</h2>
        <p>无法加载请求的页面。可能的原因：</p>
        <ul>
          <li>页面文件不存在</li>
          <li>组件导入错误</li>
          <li>路由配置问题</li>
        </ul>
        <button @click="goHome" class="home-btn">返回首页</button>
      </div>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 加载动画 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误页面样式 */
.error-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h2 {
    color: #f56c6c;
    margin-bottom: 20px;
  }
  
  p {
    color: #606266;
    margin-bottom: 16px;
  }
  
  ul {
    text-align: left;
    margin: 20px auto;
    max-width: 300px;
    color: #909399;
    
    li {
      margin-bottom: 8px;
    }
  }
  
  .home-btn {
    padding: 12px 24px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #66b1ff;
    }
  }
}
</style>
